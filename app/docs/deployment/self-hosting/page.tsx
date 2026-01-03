// app/docs/deployment/self-hosting/page.tsx
import Link from 'next/link'

export default function SelfHostingPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Self-Hosting Guide</h1>
            <p className="text-xl text-gray-600 mb-12">
                Deploy Autonomy on your own infrastructure for complete data sovereignty.
            </p>

            {/* Why Self-Host */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Self-Host?</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        Self-hosting Autonomy gives you:
                    </p>
                    <ul className="space-y-2">
                        <li><strong>Complete data sovereignty</strong> — Your signals never leave your infrastructure</li>
                        <li><strong>Full control</strong> — Customize, modify, and extend as needed</li>
                        <li><strong>Privacy</strong> — No third-party access to your documented reality</li>
                        <li><strong>No platform dependencies</strong> — You're not subject to terms of service changes</li>
                    </ul>
                </div>
            </section>

            {/* Requirements */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Requirements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Minimum</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• 1 CPU core</li>
                            <li>• 1GB RAM</li>
                            <li>• 10GB storage</li>
                            <li>• Node.js 18+</li>
                            <li>• PostgreSQL 14+ or MySQL 8+</li>
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Recommended</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• 2+ CPU cores</li>
                            <li>• 4GB+ RAM</li>
                            <li>• 50GB+ storage (for media files)</li>
                            <li>• Node.js 20+</li>
                            <li>• PostgreSQL 16+ (for PostGIS/pgvector)</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Installation Steps */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation Steps</h2>

                <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Clone Repository</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`git clone https://github.com/rswfire/autonomy.git
cd builtwithautonomy.com`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Install Dependencies</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">npm install</pre>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Set Up Database</h3>
                        <p className="text-gray-700 mb-3">
                            Create a PostgreSQL or MySQL database:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`# PostgreSQL
createdb autonomy

# MySQL
mysql -u root -p -e "CREATE DATABASE autonomy;"`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 4: Configure Environment</h3>
                        <p className="text-gray-700 mb-3">
                            Create <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`# Database (choose one)
DATABASE_URL="postgresql://user:password@localhost:5432/autonomy"
# DATABASE_URL="mysql://user:password@localhost:3306/autonomy"

# JWT Secret (generate random string)
JWT_SECRET="your-secure-random-secret-key-here"

# Environment
NODE_ENV="production"

# Port (optional, defaults to 3000)
PORT=3000`}
                            </pre>
                        </div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm">
                            <p className="text-gray-700">
                                <strong>Security:</strong> Generate a strong JWT_SECRET using:
                            </p>
                            <code className="block mt-2 bg-gray-900 text-gray-100 p-2 rounded">
                                openssl rand -base64 32
                            </code>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 5: Generate Schema & Run Migrations</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`npm run db:generate-schema
npx prisma generate
npx prisma migrate deploy`}
                            </pre>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 6: Create Owner Account</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">npm run create:owner</pre>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Follow the prompts to set up your admin account. This also creates your default private realm.
                        </p>
                    </div>

                    {/* Step 7 */}
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 7: Build & Start</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`npm run build
npm start`}
                            </pre>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Application will be available at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
                        </p>
                    </div>
                </div>
            </section>

            {/* Process Manager */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Process Management</h2>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Using systemd (Linux)</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            Create <code className="bg-gray-100 px-2 py-1 rounded">~/.config/systemd/user/autonomy.service</code>:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`[Unit]
Description=Autonomy - Cognitive Infrastructure
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/builtwithautonomy.com
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=default.target`}
                            </pre>
                        </div>
                        <p className="text-gray-700 mb-3 text-sm">Enable and start:</p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`systemctl --user daemon-reload
systemctl --user enable autonomy
systemctl --user start autonomy
systemctl --user status autonomy`}
                            </pre>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Using PM2 (Cross-platform)</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`npm install -g pm2
pm2 start npm --name autonomy -- start
pm2 save
pm2 startup`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reverse Proxy */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reverse Proxy (HTTPS)</h2>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Nginx Configuration</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            Create <code className="bg-gray-100 px-2 py-1 rounded">/etc/nginx/sites-available/autonomy</code>:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`}
                            </pre>
                        </div>
                        <p className="text-gray-700 mt-3 text-sm">Enable site:</p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mt-2">
                            <pre className="whitespace-pre-wrap">
{`sudo ln -s /etc/nginx/sites-available/autonomy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`}
                            </pre>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">SSL Certificate (Let's Encrypt)</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deploy Script */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Automated Deployment Script</h2>
                <p className="text-gray-700 mb-4">
                    Create <code className="bg-gray-100 px-2 py-1 rounded text-sm">scripts/deploy.sh</code> for easy updates:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-4">
                    <pre className="whitespace-pre-wrap">
{`#!/bin/bash
set -euo pipefail

DOMAIN="yourdomain.com"
APP_DIR="/path/to/builtwithautonomy.com"
BRANCH="main"

echo "🚀 Deploying $DOMAIN"

cd "$APP_DIR"

# Show current version
echo "📝 Current commit: $(git rev-parse --short HEAD)"

# Fetch and reset
echo "⬇️  Fetching latest changes..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# Show new version
echo "📝 New commit: $(git rev-parse --short HEAD)"

# Clean build
echo "🧹 Cleaning old build..."
rm -rf node_modules .next

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Build
echo "🔨 Building application..."
npm run build

# Verify build
if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory missing"
    exit 1
fi

echo "✅ Build successful"

# Restart service
echo "🔄 Restarting service..."
systemctl --user restart autonomy

# Wait for service to start
sleep 2

# Check service status
if systemctl --user is-active --quiet autonomy; then
    echo "✅ Service restarted successfully"
    echo "🌐 Live at: https://$DOMAIN"
else
    echo "❌ Service failed to start"
    echo "📋 Check logs: journalctl --user -u autonomy -n 50"
    exit 1
fi`}
                    </pre>
                </div>
                <p className="text-gray-700 text-sm">Make executable and run:</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mt-2">
                    <pre className="whitespace-pre-wrap">
{`chmod +x scripts/deploy.sh
./scripts/deploy.sh`}
                    </pre>
                </div>
            </section>

            {/* Backup */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Backup Strategy</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Database Backups</h3>
                    <p className="text-gray-700 mb-3">
                        Set up automated daily backups:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                        <pre className="whitespace-pre-wrap">
{`# PostgreSQL
pg_dump autonomy > backup_$(date +%Y%m%d).sql

# MySQL
mysqldump autonomy > backup_$(date +%Y%m%d).sql`}
                        </pre>
                    </div>
                    <p className="text-gray-700 text-sm">
                        Add to cron for daily backups at 2 AM:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mt-2">
                        <pre className="whitespace-pre-wrap">
{`0 2 * * * pg_dump autonomy > /backups/autonomy_$(date +\%Y\%m\%d).sql`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Monitoring */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Monitoring & Logs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">View Logs (systemd)</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`# Last 50 lines
journalctl --user -u autonomy -n 50

# Follow logs
journalctl --user -u autonomy -f`}
                            </pre>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">View Logs (PM2)</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`# View logs
pm2 logs autonomy

# Monitor
pm2 monit`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Port already in use</h3>
                        <p className="text-gray-600 text-sm mb-2">Change PORT in .env file or stop conflicting service</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">lsof -i :3000</code>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Database connection failed</h3>
                        <p className="text-gray-600 text-sm">Verify DATABASE_URL is correct and database is running</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Build errors after update</h3>
                        <p className="text-gray-600 text-sm mb-2">Clean install:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">rm -rf node_modules .next && npm install && npm run build</code>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Prisma client not found</h3>
                        <p className="text-gray-600 text-sm mb-2">Regenerate:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">npx prisma generate</code>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/getting-started" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
                        <p className="text-gray-600">Create your first signal after deployment.</p>
                    </Link>

                    <Link href="/docs/architecture/database-schema" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Schema</h3>
                        <p className="text-gray-600">Understand the data structure.</p>
                    </Link>

                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Realms</h3>
                        <p className="text-gray-600">Your data sovereignty architecture.</p>
                    </Link>

                    <a href="https://github.com/rswfire/autonomy/issues" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issues</h3>
                        <p className="text-gray-600">Found a problem? Let us know on GitHub.</p>
                    </a>
                </div>
            </section>
        </div>
    )
}
