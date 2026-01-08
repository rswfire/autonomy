// components/docs/TableOfContents.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { docsNavigation, type DocSection } from '@/lib/docs-navigation'
import { useState } from 'react'

interface TableOfContentsProps {
    className?: string
}

function NavSection({ section }: { section: DocSection }) {
    const pathname = usePathname()

    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
            </h3>
            <ul className="space-y-1">
                {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                                    ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }
                                `}
                            >
                                <Icon name={item.icon} size={16} />
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export function TableOfContents({ className = '' }: TableOfContentsProps) {
    return (
        <nav className={className}>
            {docsNavigation.map((section) => (
                <NavSection key={section.title} section={section} />
            ))}
        </nav>
    )
}

export function MobileTableOfContents() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Open table of contents"
            >
                <Icon name="Menu" size={20} />
                <span className="text-sm font-medium">Docs</span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Documentation</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <TableOfContents />
                    </div>
                </div>
            </div>
        </>
    )
}
