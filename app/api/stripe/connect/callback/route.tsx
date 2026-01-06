// app/api/stripe/connect/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI } from '@/lib/utils/auth'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2025-12-15.clover',
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://builtwithautonomy.com'

export async function GET(req: NextRequest) {
    try {
        const user = await requireAuthAPI()
        const realm_id = req.nextUrl.searchParams.get('realm_id')

        if (!realm_id) {
            return NextResponse.redirect(new URL('/admin/realms', BASE_URL))
        }

        const realm = await prisma.realm.findFirst({
            where: {
                realm_id,
                user_id: user.user_id,
            },
        })

        if (!realm) {
            return NextResponse.redirect(new URL('/admin/realms', BASE_URL))
        }

        const settings = realm.realm_settings as any
        const accountId = settings?.sanctum?.stripe?.account_id

        if (!accountId) {
            throw new Error('No Stripe account found')
        }

        // Retrieve account to check onboarding status
        const account = await stripe.accounts.retrieve(accountId)

        settings.sanctum.stripe = {
            account_id: accountId,
            onboarding_complete: account.details_submitted,
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
        }

        await prisma.realm.update({
            where: { realm_id },
            data: { realm_settings: settings },
        })

        return NextResponse.redirect(new URL(`/admin/realms/${realm_id}/sanctum`, BASE_URL))
    } catch (error) {
        console.error('Stripe callback error:', error)
        const realm_id = req.nextUrl.searchParams.get('realm_id')
        return NextResponse.redirect(new URL(`/admin/realms/${realm_id}/sanctum?error=onboarding_failed`, BASE_URL))
    }
}
