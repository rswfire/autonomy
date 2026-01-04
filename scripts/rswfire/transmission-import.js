#!/usr/bin/env node

/**
 * Transmission Import Script
 * Migrates signals from beta Autonomy (rswfire.online) to new system
 *
 * Usage:
 *   node transmission-import.js --realm-id YOUR_REALM_ID --auth-token YOUR_JWT
 *
 * Environment variables:
 *   BETA_API_URL (default: https://rswfire.online/api)
 *   NEW_API_URL (default: http://localhost:3000/api/admin)
 *   BATCH_SIZE (default: 10)
 *   START_PAGE (default: 1)
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
    betaApiUrl: process.env.BETA_API_URL || 'https://rswfire.online/api',
    newApiUrl: process.env.NEW_API_URL || 'http://localhost:3000/api/admin',
    batchSize: parseInt(process.env.BATCH_SIZE) || 10,
    startPage: parseInt(process.env.START_PAGE) || 1,
    progressFile: './import-progress.json',
    errorLogFile: './import-errors.json',
};

// Parse command line arguments
const args = process.argv.slice(2);
const realmId = args[args.indexOf('--realm-id') + 1];
const authToken = args[args.indexOf('--auth-token') + 1];

if (!realmId || !authToken) {
    console.error('Usage: node transmission-import.js --realm-id YOUR_REALM_ID --auth-token YOUR_JWT');
    process.exit(1);
}

// Progress tracking
let progress = {
    totalFetched: 0,
    totalImported: 0,
    currentPage: CONFIG.startPage,
    errors: [],
    lastProcessedId: null,
};

// Load previous progress if exists
async function loadProgress() {
    try {
        const data = await fs.readFile(CONFIG.progressFile, 'utf8');
        progress = { ...progress, ...JSON.parse(data) };
        console.log(`Resuming from page ${progress.currentPage}, ${progress.totalImported} imported so far`);
    } catch (err) {
        console.log('Starting fresh import');
    }
}

// Save progress
async function saveProgress() {
    await fs.writeFile(CONFIG.progressFile, JSON.stringify(progress, null, 2));
}

// Save errors
async function saveErrors() {
    await fs.writeFile(CONFIG.errorLogFile, JSON.stringify(progress.errors, null, 2));
}

// Fetch transmissions from beta API
async function fetchTransmissions(page = 1, perPage = 24) {
    const url = `${CONFIG.betaApiUrl}/transmissions?page=${page}&perPage=${perPage}&domain=rswfire.com`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
    }

    return response.json();
}

// Fetch individual transmission detail (includes transcript)
async function fetchTransmissionDetail(signalUlid) {
    const url = `${CONFIG.betaApiUrl}/transmission/${signalUlid}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch detail for ${signalUlid}: ${response.statusText}`);
    }

    return response.json();
}

// Map beta transmission to new signal format
function mapTransmissionToSignal(transmission, realmId) {
    const metadata = transmission.signal_metadata || {};
    const youtubeData = metadata.youtube || {};
    const payload = transmission.signal_payload || {};

    // Extract transcript data from signal_payload
    const transcript = payload.transcript || null;
    const timedTranscript = payload['timed-transcript'] || null;

    // Build signal payload for TRANSMISSION type
    const signal_payload = {
        file_path: youtubeData.url || `https://www.youtube.com/watch?v=${youtubeData.id}`,
        transcript: transcript,
        timed_transcript: timedTranscript,
    };

    // Build metadata according to TransmissionMetadata schema ONLY
    const signal_metadata = {
        // Legacy reference for cross-reference
        legacy: {
            signal_ulid: transmission.signal_ulid,
            signal_id: transmission.signal_id,
        },

        // Source metadata (properly nested)
        source_type: 'youtube',
        source_url: youtubeData.url,

        youtube: {
            id: youtubeData.id,
            url: youtubeData.url,
            thumbnail: youtubeData.thumbnail,
            channel: youtubeData.channel,
            channel_id: youtubeData.channel_id,
            published_at: youtubeData.published_at,
        },

        // Technical metadata
        duration: metadata.duration,
    };

    return {
        realm_id: realmId,
        signal_type: 'TRANSMISSION',
        signal_context: 'CAPTURE',
        signal_title: transmission.signal_title || transmission.surface_title || 'Untitled Transmission',
        signal_description: transmission.signal_description,
        signal_author: 'rswfire',
        signal_temperature: 0.0,
        signal_status: transmission.structure_visibility === 'public' ? 'ACTIVE' : 'ARCHIVED',
        signal_visibility: transmission.structure_visibility === 'sanctum' ? 'SANCTUM' :
            transmission.structure_visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
        signal_metadata,
        signal_payload,
        signal_tags: transmission.signal_metadata?.record?.tags || [],
        stamp_created: new Date(transmission.stamp_created),
    };
}

// Import single signal to new API
async function importSignal(signal) {
    const response = await fetch(`${CONFIG.newApiUrl}/signals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `auth_token=${authToken}`,
        },
        body: JSON.stringify(signal),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`Import failed: ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

// Process batch of transmissions
async function processBatch(transmissions) {
    const results = [];

    for (const transmission of transmissions) {
        try {
            // Fetch full detail (includes transcript)
            const detail = await fetchTransmissionDetail(transmission.signal_ulid);

            const signal = mapTransmissionToSignal(detail, realmId);
            const result = await importSignal(signal);

            results.push({
                success: true,
                legacy_ulid: transmission.signal_ulid,
                new_signal_id: result.signal.signal_id,
                title: signal.signal_title,
                has_transcript: !!signal.signal_payload.transcript,
            });

            progress.totalImported++;
            progress.lastProcessedId = transmission.signal_ulid;

            const transcriptStatus = signal.signal_payload.transcript ? '📝' : '  ';
            console.log(`✓ ${transcriptStatus} Imported: ${signal.signal_title.substring(0, 50)}...`);

            // Rate limiting (detail fetch + import)
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            const errorRecord = {
                legacy_ulid: transmission.signal_ulid,
                title: transmission.signal_title,
                error: error.message,
                timestamp: new Date().toISOString(),
            };

            progress.errors.push(errorRecord);
            results.push({ success: false, ...errorRecord });

            console.error(`✗ Failed: ${transmission.signal_title.substring(0, 50)}... - ${error.message}`);
        }
    }

    return results;
}

// Main import function
async function runImport() {
    console.log('🔥 Transmission Import Starting...\n');
    console.log(`Realm ID: ${realmId}`);
    console.log(`Beta API: ${CONFIG.betaApiUrl}`);
    console.log(`New API: ${CONFIG.newApiUrl}`);
    console.log(`Batch Size: ${CONFIG.batchSize}\n`);

    await loadProgress();

    let currentPage = progress.currentPage;
    let hasMorePages = true;

    while (hasMorePages) {
        try {
            console.log(`\n📄 Fetching page ${currentPage}...`);
            const response = await fetchTransmissions(currentPage, CONFIG.batchSize);

            if (!response.data || response.data.length === 0) {
                console.log('No more transmissions to import');
                break;
            }

            progress.totalFetched += response.data.length;
            progress.currentPage = currentPage;

            console.log(`Found ${response.data.length} transmissions on page ${currentPage}`);

            // Process batch
            const results = await processBatch(response.data);
            const successCount = results.filter(r => r.success).length;

            console.log(`\n✓ Imported ${successCount}/${response.data.length} from page ${currentPage}`);

            // Save progress after each page
            await saveProgress();
            if (progress.errors.length > 0) {
                await saveErrors();
            }

            // Check if there are more pages
            hasMorePages = response.next_page_url !== null;
            currentPage++;

            // Safety pause between pages
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`\n❌ Error processing page ${currentPage}:`, error.message);
            await saveProgress();
            await saveErrors();

            // Decide whether to continue or abort
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise(resolve => {
                readline.question('Continue to next page? (y/n): ', resolve);
            });
            readline.close();

            if (answer.toLowerCase() !== 'y') {
                console.log('Import aborted by user');
                break;
            }

            currentPage++;
        }
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Import Complete!\n');
    console.log(`Total Fetched: ${progress.totalFetched}`);
    console.log(`Total Imported: ${progress.totalImported}`);
    console.log(`Errors: ${progress.errors.length}`);

    if (progress.errors.length > 0) {
        console.log(`\n⚠️  Check ${CONFIG.errorLogFile} for error details`);
    }

    await saveProgress();
    console.log(`\n📊 Progress saved to ${CONFIG.progressFile}`);
}

// Run the import
runImport().catch(error => {
    console.error('Fatal error:', error);
    saveProgress().then(() => {
        saveErrors().then(() => {
            process.exit(1);
        });
    });
});
