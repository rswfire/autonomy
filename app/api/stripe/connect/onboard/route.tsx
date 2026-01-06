// app/api/stripe/connect/onboard/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI } from '@/lib/utils/auth'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2025-12-15.clover',
})

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuthAPI()
        const { realm_id } = await req.json()

        // Verify user owns this realm
        const realm = await prisma.realm.findFirst({
            where: {
                realm_id,
                user_id: user.user_id,
            },
        })

        if (!realm) {
            return NextResponse.json({ error: 'Realm not found' }, { status: 404 })
        }

        // Create Connect account
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        })

        // Create account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/realms/${realm_id}/sanctum`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/connect/callback?realm_id=${realm_id}`,
            type: 'account_onboarding',
        })

        // Store account ID immediately
        const settings = realm.realm_settings as any || {}
        settings.sanctum = settings.sanctum || {}
        settings.sanctum.stripe = {
            account_id: account.id,
            onboarding_complete: false,
            charges_enabled: false,
            payouts_enabled: false,
        }

        await prisma.realm.update({
            where: { realm_id },
            data: { realm_settings: settings },
        })

        return NextResponse.json({ url: accountLink.url })
    } catch (error) {
        if (error instanceof Error && error.message === 'Not authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        console.error('Stripe Connect error:', error)
        return NextResponse.json({ error: 'Failed to create Connect account' }, { status: 500 })
    }
}
