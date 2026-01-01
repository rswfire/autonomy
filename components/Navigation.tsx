// components/Navigation.tsx
"use client";

import {navigation} from "@/lib/navigation";
import Icon from "@/components/Icon";
import {useState} from "react";

export function Navigation() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    return (
        <nav className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">

                <a href="/"
                   className="text-base font-semibold tracking-wide text-zinc-900"
                >
                    rswfire.dev
                </a>

                <div className="flex items-center gap-8">
                    {navigation.map((group) => {
                        const isOpen = openMenu === group.id;
                        return (
                            <div
                                key={group.id}
                                className="relative"
                                onMouseEnter={() => setOpenMenu(group.id)}
                                onMouseLeave={() => setOpenMenu(null)}
                            >
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 cursor-pointer transition-colors py-2">
                                    <Icon name={group.icon} size={16} />
                                    <span>{group.label}</span>
                                </div>

                                {isOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-0 w-72 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden"
                                        style={{
                                            animation: 'fadeIn 120ms ease-out'
                                        }}
                                    >
                                        <div className="py-2">
                                            {group.items.map((item) => (

                                                <a key={item.href}
                                                   href={item.href}
                                                   className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Icon
                                                        name={item.icon}
                                                        size={16}
                                                        className="text-zinc-400 mt-0.5 flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-zinc-900">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
