// app/layout.tsx (add container wrapper around {children})
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Script from "next/script";
import { Toaster } from 'sonner'
import { SiteHeader } from '@/components/SiteHeader'
import Link from 'next/link'
import Icon from '@/components/Icon'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
    title: 'Autonomy',
    description: 'Open-source infrastructure for signal preservation and reflection',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <head>
            {process.env.NODE_ENV === "production" && (
                <Script
                    src="https://analytics.rswfire.online/script.js"
                    data-website-id="7ef56f74-a7a3-46ac-8a02-c5710fa1fc69"
                    strategy="afterInteractive"
                />
            )}
        </head>

        <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased flex min-h-screen flex-col`}>
        <Toaster position="top-right" />

        <SiteHeader />

        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {children}
                </div>
            </div>
        </main>

        <footer className="border-t border-zinc-200 bg-zinc-50">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1 max-w-md">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-3 tracking-widest">
                            CORE PRINCIPLES
                        </h3>
                        <ul className="space-y-2 text-sm text-zinc-600">
                            <li>
                                <strong>Reality has structure.</strong>
                                <br />
                                Patterns are real and detectable.
                            </li>
                            <li>
                                <strong>Cognition has architecture.</strong>
                                <br />
                                Coherent thinking follows traceable logic.
                            </li>
                            <li>
                                <strong>Systems can fragment or preserve.</strong>
                                <br />
                                Most platforms fragment. Autonomy preserves.
                            </li>
                            <li>
                                <strong>Sovereignty matters.</strong>
                                <br />
                                You should own your data, your patterns, your truth.
                            </li>
                            <li>
                                <strong>Epistemic honesty is non-negotiable.</strong>
                                <br />
                                Systems that reframe your reality are abusive,
                                <br />
                                even when they claim to help.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-end gap-4 self-end">
                        <div className="text-right space-y-2">
                            <div className="flex gap-2 justify-end mb-2 mr-4">
                                <Icon name="Flame" size={24} className="text-red-600" />
                                <Icon name="Droplets" size={24} className="text-blue-900" />
                                <Icon name="TreeDeciduous" size={24} className="text-emerald-600" />
                            </div>
                            <p className="text-xs text-zinc-500 tracking-wide">
                                Built with{' '}
                                <Link
                                    href="https://github.com/rswfire/autonomy"
                                    className="text-stone-900 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Autonomy
                                </Link>
                                .
                            </p>
                            <p className="text-xs text-zinc-500 tracking-wide">
                                By{' '}
                                <Link
                                    href="https://rswfire.com/handshake"
                                    className="text-stone-900 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Robert Samuel White
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        </body>
        </html>
    )
}
