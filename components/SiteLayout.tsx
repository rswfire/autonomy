'use client'

import { useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { SiteNavigation } from '@/components/SiteNavigation'

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top bar and sidebar */}
            <div className="flex flex-1">
                {/* Desktop sidebar */}
                <div className="hidden md:block">
                    <SiteNavigation />
                </div>

                {/* Mobile sidebar overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="relative z-10 w-64 h-full bg-gray-900 shadow-xl">
                            <SiteNavigation onClose={() => setMobileMenuOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Main column */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile top bar */}
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 text-gray-100">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="text-teal-400 hover:text-white"
                            aria-label="Open navigation"
                        >
                            <Icon name="Menu" size={24} />
                        </button>
                        <Link
                            href="/"
                            className="font-mono text-lg font-semibold text-teal-400"
                        >
                            autonomy
                        </Link>
                        <div style={{ width: 24 }} />
                    </div>

                    {/* Main content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>

            {/* Footer stays at the bottom */}
            <footer className="border-t border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex-1 max-w-md">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-3 tracking-widest">CORE PRINCIPLES</h3>
                            <ul className="space-y-2 text-sm text-zinc-600">
                                <li><strong>Reality has structure.</strong><br />Patterns are real and detectable.</li>
                                <li><strong>Cognition has architecture.</strong><br />Coherent thinking follows traceable logic.</li>
                                <li><strong>Systems can fragment or preserve.</strong><br />Most platforms fragment. Autonomy preserves.</li>
                                <li><strong>Sovereignty matters.</strong><br />You should own your data, your patterns, your truth.</li>
                                <li><strong>Epistemic honesty is non-negotiable.</strong><br />Systems that reframe your reality are abusive,<br />even when they claim to help.</li>
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
                                    Built with <Link href="https://github.com/rswfire/builtwithautonomy.com" className="text-stone-900 underline" target="_blank" rel="noopener noreferrer">Autonomy</Link>.
                                </p>
                                <p className="text-xs text-zinc-500 tracking-wide">
                                    By <Link href="https://rswfire.com/handshake" className="text-stone-900 underline" target="_blank" rel="noopener noreferrer">Robert Samuel White</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    )
}
