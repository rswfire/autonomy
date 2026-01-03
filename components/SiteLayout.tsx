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
        <div className="flex min-h-screen">
            {/* Desktop sidebar */}
            <div className="hidden md:block">
                <SiteNavigation />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
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

                    {/* spacer to balance layout */}
                    <div className="w-6" />
                </div>

                <main className="site-main flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
