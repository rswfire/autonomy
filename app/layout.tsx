// app/layout.tsx
import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { navigation } from "@/lib/navigation";
import { Open_Sans } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const openSans = Open_Sans({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Built with Autonomy",
        template: "%s | Built with Autonomy",
    },
    description: "Built with Autonomy.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
        <body className={openSans.className}>
        <header className="site-header">
            <Navigation />
        </header>

        <main className="site-main">
            {children}
        </main>

            <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div>
                        <strong className="block font-semibold">rswfire.dev</strong>
                        <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                            Systems, autonomy, and long-horizon technical work.
                        </p>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-8 sm:grid-cols-4">
                        {navigation.map((group) => (
                            <div key={group.id}>
                                <h4 className="mb-2 text-sm font-medium text-zinc-900">
                                    {group.label}
                                </h4>
                                <ul className="space-y-1">
                                    {group.items.map((item) => (
                                        <li key={item.href}>
                                            <a
                                                href={item.href}
                                                className="text-sm text-zinc-600 hover:text-black"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>

        </body>
        </html>
    );
}
