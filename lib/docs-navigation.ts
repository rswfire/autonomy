// lib/docs-navigation.ts
import { type IconName } from "@/components/Icon";

export interface DocLink {
    name: string
    href: string
    icon: IconName
}

export interface DocSection {
    title: string
    items: DocLink[]
}

export const docsNavigation: DocSection[] = [
    {
        title: "Getting Started",
        items: [
            { name: "Quick Start", href: "/docs/getting-started", icon: "Rocket" },
        ],
    },
    {
        title: "Core Concepts",
        items: [
            { name: "Signals", href: "/docs/concepts/signals", icon: "Radio" },
            { name: "Analysis", href: "/docs/concepts/analysis", icon: "Search" },
            { name: "Realms", href: "/docs/concepts/realms", icon: "Castle" },
            { name: "Clusters", href: "/docs/concepts/clusters", icon: "Network" },
            { name: "Synthesis", href: "/docs/concepts/synthesis", icon: "Sparkles" },
        ],
    },
    {
        title: "Philosophy",
        items: [
            { name: "Why Autonomy", href: "/docs/philosophy", icon: "Lightbulb" },
            { name: "The Myth", href: "/docs/myth", icon: "ScrollText" },
        ],
    },
    {
        title: "Architecture",
        items: [
            { name: "Database Schema", href: "/docs/architecture/database-schema", icon: "Database" },
            { name: "Multi-Tenancy", href: "/docs/architecture/multi-tenancy", icon: "Users" },
            { name: "Authentication", href: "/docs/architecture/authentication", icon: "Shield" },
            { name: "Autonomy CLI", href: "/docs/architecture/cli", icon: "Terminal" },
        ],
    },
    {
        title: "Deployment",
        items: [
            { name: "Monetization", href: "/docs/deployment/monetization", icon: "DollarSign" },
            { name: "Self-Hosting", href: "/docs/deployment/self-hosting", icon: "Server" },
        ],
    },
]
