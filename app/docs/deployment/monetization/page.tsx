// app/docs/deployment/monetization/page.tsx
import Link from 'next/link'

export default function StripeConnectPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Stripe Connect & Sanctum</h1>
            <p className="text-xl text-gray-600 mb-12">
                Enable monetization for realm owners through Stripe Connect and subscription-based access control.
            </p>

            {/* Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Sanctum?</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        Sanctum is Autonomy's subscription and access control system. It allows realm owners to:
                    </p>
                    <ul className="space-y-2">
                        <li><strong>Monetize their realms</strong> — Create subscription tiers with custom pricing</li>
                        <li><strong>Control access</strong> — Gate signals by visibility level (PUBLIC, PRIVATE, SANCTUM)</li>
                        <li><strong>Own their revenue</strong> — Payments go directly to realm owners via Stripe Connect</li>
                        <li><strong>Customize branding</strong> — Name their subscription area whatever they want</li>
                    </ul>
                    <p>
                        Unlike traditional platforms where you're a user on someone else's system, Sanctum gives each realm owner
                        their own Stripe account and complete control over pricing and access.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Stripe Connect Works</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                    <p className="text-gray-700">
                        <strong>Stripe Connect</strong> allows platforms to facilitate payments between users.
                        Each realm owner connects their own Stripe account, and payments go directly to them—not through the platform.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Platform Setup</h3>
                                <p className="text-gray-700 text-sm">
                                    The platform owner (you, if self-hosting) enables Stripe Connect on their Stripe account.
                                    This is a one-time setup that authorizes your platform to create connected accounts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Realm Owner Onboarding</h3>
                                <p className="text-gray-700 text-sm">
                                    Realm owners click "Connect Stripe" in their Sanctum settings. They're redirected to Stripe's
                                    onboarding flow where they create/connect their Stripe account and verify their identity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Account Connection Stored</h3>
                                <p className="text-gray-700 text-sm">
                                    After onboarding, Stripe returns the connected account ID. This is stored in the realm's settings
                                    at <code className="bg-gray-100 px-2 py-1 rounded text-xs">realm_settings.sanctum.stripe.account_id</code>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                                4
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Subscription Creation</h3>
                                <p className="text-gray-700 text-sm">
                                    When users subscribe to a realm, payments are processed on the realm owner's connected Stripe account.
                                    The platform can optionally take an application fee (e.g., 5%) for providing infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Setup */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Setup (One-Time)</h2>

                <div className="space-y-8">
                    <div className="border-l-4 border-teal-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Enable Stripe Connect</h3>
                        <ol className="space-y-3 text-gray-700 text-sm list-decimal list-inside">
                            <li>Go to <a href="https://dashboard.stripe.com/settings/connect" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard → Connect Settings</a></li>
                            <li>Click "Get started" or "Enable Connect"</li>
                            <li>Select industry (e.g., "Website building or hosting")</li>
                            <li>Complete platform application form</li>
                            <li>Verify your identity with government ID</li>
                            <li>Wait for approval (usually instant)</li>
                        </ol>
                    </div>

                    <div className="border-l-4 border-teal-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Configure Environment Variables</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            Add your Stripe keys to <code className="bg-gray-100 px-2 py-1 rounded">.env</code>:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm mb-3">
                            <pre className="whitespace-pre-wrap">
{`# Stripe API Keys
STRIPE_SECRET="sk_live_..."  # Your secret key
STRIPE_KEY="pk_live_..."     # Your publishable key (for client-side)
STRIPE_WEBHOOK_SECRET="whsec_..."  # For webhook signature verification

# Public URL (required for redirects)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"`}
                            </pre>
                        </div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-sm">
                            <p className="text-gray-700">
                                <strong>Important:</strong> Use live keys (<code>sk_live_</code>) for production.
                                Use test keys (<code>sk_test_</code>) for development.
                            </p>
                        </div>
                    </div>

                    <div className="border-l-4 border-teal-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Configure Branding</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            Customize what realm owners see during onboarding:
                        </p>
                        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                            <li>Go to <a href="https://dashboard.stripe.com/settings/connect/branding" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Connect Settings → Branding</a></li>
                            <li>Set platform name (e.g., "Autonomy Realms")</li>
                            <li>Upload platform logo/icon</li>
                            <li>Set brand colors</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Realm Owner Setup */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Realm Owner Setup</h2>

                <div className="space-y-8">
                    <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Navigate to Sanctum Settings</h3>
                        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                            <li>Go to Admin → Realms</li>
                            <li>Click "Sanctum" button on your realm</li>
                            <li>Or navigate to Settings tab → Sanctum tab</li>
                        </ol>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Connect Stripe Account</h3>
                        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                            <li>Click "Connect Stripe" button</li>
                            <li>You'll be redirected to Stripe's onboarding</li>
                            <li>Create new account or sign in to existing</li>
                            <li>Complete identity verification (government ID required)</li>
                            <li>Add bank account for payouts</li>
                            <li>Review and accept Stripe's terms</li>
                            <li>You'll be redirected back to Sanctum settings</li>
                        </ol>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm mt-4">
                            <p className="text-gray-700">
                                <strong>Note:</strong> If using live Stripe keys, this creates a real Stripe account.
                                Test keys create test-mode accounts for development.
                            </p>
                        </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Enable Sanctum</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            After Stripe is connected, configure your Sanctum:
                        </p>
                        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                            <li>Toggle "Enable Sanctum" on</li>
                            <li>Set display name (default: "Sanctum", can be "Supporters", "Members", etc.)</li>
                            <li>Click "Add Tier" to create subscription tiers</li>
                        </ol>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 4: Create Subscription Tiers</h3>
                        <p className="text-gray-700 mb-3 text-sm">
                            Define how users can subscribe to your realm:
                        </p>

                        <div className="space-y-4 mt-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Fixed Price Tier</h4>
                                <p className="text-gray-600 text-sm mb-3">Set a specific monthly or yearly price</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Name:</strong> "Supporter", "Patron", "Inner Circle"</li>
                                    <li>• <strong>Price:</strong> $5.00, $10.00, $25.00, etc.</li>
                                    <li>• <strong>Interval:</strong> Monthly or Yearly</li>
                                    <li>• <strong>Description:</strong> What subscribers get</li>
                                </ul>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Custom Amount Tier</h4>
                                <p className="text-gray-600 text-sm mb-3">"Pay what you want" with optional minimum</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Pricing Type:</strong> Select "Custom Amount"</li>
                                    <li>• <strong>Minimum:</strong> $1.00 (or 0 for truly optional)</li>
                                    <li>• <strong>Suggested:</strong> $10.00 (pre-filled for user)</li>
                                    <li>• <strong>Interval:</strong> Monthly or Yearly</li>
                                </ul>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Free Tier</h4>
                                <p className="text-gray-600 text-sm mb-3">Access control without payment</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>Price:</strong> $0.00</li>
                                    <li>• <strong>Use case:</strong> Invite-only access, beta testers, manual approvals</li>
                                    <li>• <strong>Note:</strong> Users still need to "subscribe" (no charge), giving you control</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Access Control */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Control with Signal Visibility</h2>
                <p className="text-gray-700 mb-6">
                    Sanctum uses signal visibility levels to control who can see what:
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="font-semibold text-green-900 mb-2">PUBLIC</h3>
                        <p className="text-sm text-green-800">
                            Anyone can see these signals, even without an account. Perfect for marketing content, blog posts, public transmissions.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">PRIVATE</h3>
                        <p className="text-sm text-blue-800">
                            Only authenticated users with any Sanctum tier can see these. Good for member-only content that doesn't need highest tier.
                        </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="font-semibold text-purple-900 mb-2">SANCTUM</h3>
                        <p className="text-sm text-purple-800">
                            Only users with specific Sanctum tier(s) can see these. This is your premium content, gated by subscription.
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Flexible Control</h4>
                    <p className="text-gray-700 text-sm">
                        You can set visibility on a per-signal basis. Mix PUBLIC transmissions (to attract subscribers) with
                        SANCTUM transmissions (to reward them). Or keep everything PRIVATE for a community-only realm.
                    </p>
                </div>
            </section>

            {/* Data Structure */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical: How It's Stored</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Realm Settings</h3>
                        <p className="text-gray-700 text-sm mb-3">
                            Sanctum configuration is stored in <code className="bg-gray-100 px-2 py-1 rounded">realm_settings.sanctum</code>:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`{
  "sanctum": {
    "enabled": true,
    "display_name": "Inner Circle",
    "stripe": {
      "account_id": "acct_...",
      "onboarding_complete": true,
      "charges_enabled": true,
      "payouts_enabled": true
    },
    "tiers": [
      {
        "id": "uuid-here",
        "name": "Supporter",
        "price": 1000,  // $10.00 in cents
        "interval": "month",
        "description": "Support my work"
      },
      {
        "id": "uuid-here",
        "name": "Custom",
        "price": "custom",
        "price_minimum": 100,  // $1.00 minimum
        "price_suggested": 1000,  // $10.00 suggested
        "interval": "month",
        "description": "Pay what you want"
      }
    ]
  }
}`}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">User Subscriptions</h3>
                        <p className="text-gray-700 text-sm mb-3">
                            When a user subscribes, they're added to <code className="bg-gray-100 px-2 py-1 rounded">realm_users</code> with Sanctum data:
                        </p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`{
  "realm_id": "01ABC...",
  "user_id": "01XYZ...",
  "user_role": "SANCTUM",
  "sanctum_tier": "uuid-of-tier",
  "stripe_subscription_id": "sub_...",
  "stripe_subscription_status": "active",
  "stamp_joined": "2026-01-06T..."
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Webhooks */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhook Configuration</h2>
                <p className="text-gray-700 mb-6">
                    Stripe sends webhooks when subscription events occur (created, canceled, payment failed). Configure these to keep subscriptions in sync:
                </p>

                <div className="space-y-6">
                    <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Add Webhook Endpoint</h3>
                        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                            <li>Go to <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard → Webhooks</a></li>
                            <li>Click "Add endpoint"</li>
                            <li>Enter URL: <code className="bg-gray-100 px-2 py-1 rounded">https://yourdomain.com/api/stripe/webhooks</code></li>
                            <li>Select events:
                                <ul className="ml-6 mt-2 space-y-1">
                                    <li>• <code className="bg-gray-100 px-2 py-1 rounded text-xs">customer.subscription.created</code></li>
                                    <li>• <code className="bg-gray-100 px-2 py-1 rounded text-xs">customer.subscription.updated</code></li>
                                    <li>• <code className="bg-gray-100 px-2 py-1 rounded text-xs">customer.subscription.deleted</code></li>
                                    <li>• <code className="bg-gray-100 px-2 py-1 rounded text-xs">invoice.payment_failed</code></li>
                                </ul>
                            </li>
                            <li>Click "Add endpoint"</li>
                            <li>Copy the webhook signing secret</li>
                        </ol>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Add Signing Secret to Environment</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap">
{`STRIPE_WEBHOOK_SECRET="whsec_..."`}
                            </pre>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm">
                        <p className="text-gray-700">
                            <strong>Note:</strong> Webhook handlers will be implemented in future updates to automatically
                            update <code className="bg-gray-100 px-2 py-1 rounded">stripe_subscription_status</code> when subscriptions change.
                        </p>
                    </div>
                </div>
            </section>

            {/* Revenue Model */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Revenue (Optional)</h2>
                <p className="text-gray-700 mb-6">
                    As the platform operator, you can optionally take an application fee from each transaction:
                </p>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Application Fees</h3>
                    <p className="text-gray-700 text-sm mb-4">
                        When creating a subscription, you can specify an application fee percentage or fixed amount:
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                        <p className="text-gray-700 mb-2"><strong>Example:</strong></p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• User subscribes for $10/month</li>
                            <li>• Stripe takes 2.9% + $0.30 = $0.59</li>
                            <li>• Platform takes 5% = $0.50</li>
                            <li>• Realm owner receives $8.91</li>
                        </ul>
                    </div>
                    <p className="text-gray-700 text-sm mt-4">
                        This is configured when creating the subscription in Stripe. Set to 0% if you want realm owners to receive full amount (minus Stripe fees).
                    </p>
                </div>
            </section>

            {/* Security */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Considerations</h2>
                <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <h4 className="font-semibold text-red-900 mb-2">Never expose secret keys</h4>
                        <p className="text-red-800 text-sm">
                            STRIPE_SECRET must only exist server-side in .env file. Never commit to git, never send to client.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">Verify webhook signatures</h4>
                        <p className="text-yellow-800 text-sm">
                            Always verify webhook signatures using STRIPE_WEBHOOK_SECRET to ensure requests are from Stripe.
                        </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">HTTPS required for live mode</h4>
                        <p className="text-blue-800 text-sm">
                            Stripe requires HTTPS for all live-mode redirect URLs and webhooks. Use test mode for local development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">"You can only create new accounts if you've signed up for Connect"</h3>
                        <p className="text-gray-600 text-sm">Enable Stripe Connect in your dashboard first (Step 1 of Platform Setup above)</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">"Livemode requests must always be redirected via HTTPS"</h3>
                        <p className="text-gray-600 text-sm">Check that NEXT_PUBLIC_APP_URL uses https:// not http://. Or use test keys for development.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Redirects to localhost instead of production domain</h3>
                        <p className="text-gray-600 text-sm">Update callback route to use NEXT_PUBLIC_APP_URL instead of req.url for redirect construction</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Subscription status not updating</h3>
                        <p className="text-gray-600 text-sm">Verify webhook endpoint is configured and receiving events. Check webhook logs in Stripe dashboard.</p>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Realms</h3>
                        <p className="text-gray-600">Learn about realm architecture and sovereignty.</p>
                    </Link>

                    <Link href="/docs/concepts/signals" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Signal Visibility</h3>
                        <p className="text-gray-600">Control who sees what with signal visibility levels.</p>
                    </Link>

                    <a href="https://docs.stripe.com/connect" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Connect Docs</h3>
                        <p className="text-gray-600">Official Stripe documentation for Connect.</p>
                    </a>

                    <a href="https://github.com/rswfire/autonomy/issues" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issues</h3>
                        <p className="text-gray-600">Found a problem? Let us know on GitHub.</p>
                    </a>
                </div>
            </section>
        </div>
    )
}
