// components/SiteHeader.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'

export function SiteHeader() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Icon name="SquareStack" size={24} className="text-teal-400" />
                        <span className="font-mono text-lg font-semibold text-teal-400">autonomy</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition ${
                                pathname === '/' ? 'text-teal-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/docs"
                            className={`text-sm font-medium transition ${
                                pathname.startsWith('/docs') ? 'text-teal-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Docs
                        </Link>
                        <Link
                            href="/admin"
                            className={`text-sm font-medium transition ${
                                pathname.startsWith('/admin') ? 'text-teal-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Dashboard
                        </Link>

                        <a href="https://github.com/rswfire/autonomy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-300 hover:text-white transition"
                        >
                        GitHub
                    </a>

                    <a href="https://autonomyrealms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition"
                    >
                    Get Your Realm
                </a>
            </nav>

            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white"
            >
                <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
        </div>

    {/* Mobile Navigation */}
    {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
                <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === '/' ? 'bg-gray-800 text-teal-400' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    Home
                </Link>
                <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname.startsWith('/docs')
                            ? 'bg-gray-800 text-teal-400'
                            : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    Docs
                </Link>
                <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname.startsWith('/admin')
                            ? 'bg-gray-800 text-teal-400'
                            : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    Dashboard
                </Link>

                <a href="https://github.com/rswfire/autonomy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800"
                >
                GitHub
            </a>

            <a href="https://autonomyrealms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 text-center"
            >
            Get Your Realm
        </a>
    </div>
    </div>
    )}
</div>
</header>
)
}
