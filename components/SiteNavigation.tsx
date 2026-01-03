'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Icon from '@/components/Icon'

interface NavItem {
    name: string
    href: string
    icon: any
}

interface NavSection {
    title: string
    items: NavItem[]
}

export function SiteNavigation({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const [isOwner, setIsOwner] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/auth/check')
                const data = await response.json()
                setIsOwner(data.authenticated)
                setUserEmail(data.email ?? null)
            } catch {
                setIsOwner(false)
                setUserEmail(null)
            }
        }

        checkAuth()
    }, [pathname])

    const publicSections: NavSection[] = [
        {
            title: 'Main',
            items: [
                { name: 'Home', href: '/', icon: 'Home' },
                { name: 'Dashboard', href: '/admin', icon: 'SquareTerminal' },
                { name: 'Docs', href: '/docs', icon: 'BookOpen' },
            ],
        },
    ]

    const docsSections: NavSection[] = [
        {
            title: 'Getting Started',
            items: [{ name: 'Quick Start', href: '/docs/getting-started', icon: 'Rocket' }],
        },
        {
            title: 'Core Concepts',
            items: [
                { name: 'Signals', href: '/docs/concepts/signals', icon: 'Radio' },
                { name: 'Realms', href: '/docs/concepts/realms', icon: 'Castle' },
                { name: 'Clusters', href: '/docs/concepts/clusters', icon: 'Network' },
                { name: 'Synthesis', href: '/docs/concepts/synthesis', icon: 'Sparkles' },
            ],
        },
        {
            title: 'Philosophy',
            items: [
                { name: 'Why Autonomy', href: '/docs/philosophy', icon: 'Lightbulb' },
                { name: 'The Myth', href: '/docs/myth', icon: 'Scroll' },
            ],
        },
        {
            title: 'Architecture',
            items: [
                { name: 'Database Schema', href: '/docs/architecture/database-schema', icon: 'Database' },
                { name: 'Multi-Tenancy', href: '/docs/architecture/multi-tenancy', icon: 'Users' },
                { name: 'Authentication', href: '/docs/architecture/authentication', icon: 'Shield' },
                { name: 'Autonomy CLI', href: '/docs/architecture/cli', icon: 'Settings' },
            ],
        },
        {
            title: 'Deployment',
            items: [{ name: 'Self-Hosting', href: '/docs/deployment/self-hosting', icon: 'Server' }],
        },
    ]

    const adminSection: NavSection = {
        title: 'Admin',
        items: [
            { name: 'Signals', href: '/admin/signals', icon: 'SquareActivity' },
            { name: 'Clusters', href: '/admin/clusters', icon: 'SquareCode' },
            { name: 'Synthesis', href: '/admin/synthesis', icon: 'SquareAsterisk' },
            { name: 'Users', href: '/admin/users', icon: 'SquareUserRound' },
            { name: 'Settings', href: '/admin/settings', icon: 'SquareTerminal' },
        ],
    }

    const isDocsPage = pathname.startsWith('/docs')

    const sections: NavSection[] = isDocsPage
        ? [...publicSections, ...docsSections]
        : isOwner
            ? [...publicSections, adminSection]
            : publicSections

    return (
        <aside className="w-64 h-full bg-gray-900 text-gray-100 flex flex-col">
            <div className="flex flex-col items-center justify-center border-b border-gray-800 p-4">
                <Icon name="SquareStack" size={24} className="text-teal-400" />
                <Link href="/" className="font-mono text-lg font-semibold tracking-tight" onClick={onClose}>
                    <span className="text-teal-400">autonomy</span>
                </Link>
            </div>

            {userEmail && (
                <div className="border-b border-gray-800 px-4 py-3 text-xs text-gray-500">
                    <div className="mb-1">{userEmail}</div>
                    <Link
                        href="/admin/logout"
                        className="text-teal-400 hover:underline transition"
                        onClick={onClose}
                    >
                        Logout
                    </Link>
                </div>
            )}

            <nav className="flex-1 px-3 py-6 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title} className="mb-8">
                        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/' && item.href !== '/docs' && pathname.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-gray-800 text-teal-400'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                                        }`}
                                    >
                                        <Icon name={item.icon} size={20} />
                                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 font-mono">
                    <div>v0.1.0</div>
                </div>
            </div>
        </aside>
    )
}
