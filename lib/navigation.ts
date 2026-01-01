// lib/navigation.ts

import type { IconName } from "@/components/Icon";

export type NavItem = {
    label: string;
    href: string;
    description: string;
    icon: IconName;
};

export type NavGroup = {
    id: "primary" | "secondary" | "system";
    label: string;
    icon: IconName;
    items: NavItem[];
};

export const navigation: NavGroup[] = [
    {
        id: "primary",
        label: "Explore",
        icon: "Compass",
        items: [
            {
                label: "Home",
                href: "/",
                description: "An overview of this site and how to navigate it",
                icon: "Menu",
            }
        ],
    },
    {
        id: "secondary",
        label: "Secondary",
        icon: "FileText",
        items: [
            {
                label: "Coming Soon",
                href: "/coming-soon",
                description: "Working on it.",
                icon: "FileText",
            }
        ],
    },
    {
        id: "system",
        label: "System",
        icon: "Lock",
        items: [
            {
                label: "Contact",
                href: "/contact",
                description: "How to reach me or start a conversation",
                icon: "Mail",
            },
        ],
    },
];
