// components/Anchor.tsx
import Link from 'next/link'

interface AnchorProps {
    href: string
    children: React.ReactNode
    className?: string
    target?: string
    rel?: string
}

export function Anchor({ href, children, className = '', target, rel }: AnchorProps) {
    // External links
    if (href.startsWith('http://') || href.startsWith('https://')) {
        return (

            <a href={href}
                className={className}
                target={target || '_blank'}
                rel={rel || 'noopener noreferrer'}
            >
                {children}
            </a>
        )
    }

    // Internal links - use Next.js Link
    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}
