// app/layout.tsx
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Open_Sans } from 'next/font/google'
import SiteLayout from '@/components/SiteLayout'
import './globals.css'

const openSans = Open_Sans({
    weight: '400',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        default: 'Built with Autonomy',
        template: '%s | Built with Autonomy',
    },
    description: 'Built with Autonomy.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body className={openSans.className}>
        <SiteLayout>
            {children}
        </SiteLayout>
        </body>
        </html>
    )
}
