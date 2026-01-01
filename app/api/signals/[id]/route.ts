// app/api/signals/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const signal = await prisma.signal.findUnique({
            where: { id: params.id },
            include: {
                reflection: true,
                clusters: {
                    include: {
                        cluster: true,
                    },
                },
            },
        });

        if (!signal) {
            return NextResponse.json(
                { error: 'Signal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ signal });

    } catch (error) {
        console.error('Signal fetch failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
