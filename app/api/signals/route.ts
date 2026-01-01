// app/api/signals/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getAIProvider } from '@/lib/ai';

const createSignalSchema = z.object({
    type: z.enum(['PHOTO', 'VIDEO', 'AUDIO', 'TEXT', 'LOCATION']),
    content: z.string().min(1),
    status: z.enum(['PUBLIC', 'PRIVATE', 'SANCTUM']).optional(),
    capturedAt: z.string().datetime().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    metadata: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = createSignalSchema.parse(body);

        // TODO: Add authentication
        const userId = 'temp-user-id'; // Replace with actual auth

        // Create signal
        const signal = await prisma.signal.create({
            data: {
                userId,
                type: validated.type,
                content: validated.content,
                status: validated.status || 'PUBLIC',
                capturedAt: validated.capturedAt ? new Date(validated.capturedAt) : new Date(),
                latitude: validated.latitude,
                longitude: validated.longitude,
                metadata: validated.metadata,
            },
        });

        // Run AI reflection asynchronously
        const aiProvider = getAIProvider();

        try {
            const reflection = await aiProvider.reflect(validated.content, validated.type);

            await prisma.reflection.create({
                data: {
                    signalId: signal.id,
                    metadata: reflection.metadata,
                    patterns: reflection.patterns,
                    sentiment: reflection.sentiment,
                    provider: aiProvider.name,
                    model: 'claude-sonnet-4-20250514', // Track which model
                },
            });
        } catch (error) {
            console.error('Reflection failed:', error);
            // Signal created successfully, reflection failed - that's okay
        }

        return NextResponse.json({ signal }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Signal creation failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // TODO: Add authentication and filter by userId

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');

        const signals = await prisma.signal.findMany({
            where: {
                ...(type && { type: type as any }),
                ...(status && { status: status as any }),
            },
            include: {
                reflection: true,
            },
            orderBy: { capturedAt: 'desc' },
            take: Math.min(limit, 100), // Max 100
        });

        return NextResponse.json({ signals });

    } catch (error) {
        console.error('Signal fetch failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
