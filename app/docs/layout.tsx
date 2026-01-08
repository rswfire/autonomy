// app/docs/layout.tsx
import { TableOfContents, MobileTableOfContents } from '@/components/docs/TableOfContents'

export default function DocsLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-8">
                            <TableOfContents />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <MobileTableOfContents />
            </div>
        </div>
    )
}
