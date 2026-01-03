// components/SiteNavigation.tsx
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

export function SiteNavigation() {
    const pathname = usePathname()
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/auth/check')
                const data = await response.json()
                setIsOwner(data.role === 'OWNER' || data.role === 'SANCTUM')
            } catch {
                setIsOwner(false)
            }
        }
        checkAuth()
    }, [])

    const publicSections: NavSection[] = [
        {
            title: 'Main',
            items: [
                { name: 'Home', href: '/', icon: 'Home' },
                { name: 'Admin', href: '/admin', icon: 'Compass' },
            ],
        },
    ]

    const adminSection: NavSection = {
        title: 'Admin',
        items: [
            { name: 'Dashboard', href: '/admin', icon: 'BarChart3' },
            { name: 'Signals', href: '/admin/signals', icon: 'Radio' },
            { name: 'Clusters', href: '/admin/clusters', icon: 'FolderOpen' },
            { name: 'Synthesis', href: '/admin/synthesis', icon: 'Sparkles' },
            { name: 'Users', href: '/admin/users', icon: 'Users' },
            { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
        ],
    }

    const sections = isOwner ? [...publicSections, adminSection] : publicSections

    return (
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <Link href="/" className="font-mono text-lg font-semibold tracking-tight">
                    <span className="text-teal-400">autonomy</span>
                </Link>
            </div>

            <nav className="flex-1 px-3 py-6 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title} className="mb-8">
                        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            flex items-center px-3 py-2.5 rounded-lg transition-colors
                                            ${isActive
                                            ? 'bg-gray-800 text-teal-400'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                                        }
                                        `}
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
