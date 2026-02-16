'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Cpu, User, Send } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DOCK_ITEMS = [
    { label: 'Work', href: '/', icon: LayoutGrid, ariaLabel: 'View Projects' },
    { label: 'Services', href: '/services', icon: Cpu, ariaLabel: 'View Services' },
    { label: 'About', href: '/about', icon: User, ariaLabel: 'View About' },
    { label: 'Contact', href: '/contact', icon: Send, ariaLabel: 'Send Message' },
];

const SPRING_TRANSITION = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 1,
};

export function MobileDock() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 md:hidden">
            <nav
                className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 p-2 backdrop-blur-xl backdrop-saturate-150"
                aria-label="Mobile Navigation Dock"
            >
                {DOCK_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex h-12 w-12 items-center justify-center rounded-full transition-colors"
                            aria-label={item.ariaLabel}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 40,
                                    }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <Icon
                                    size={20}
                                    className={`transition-colors duration-300 ${isActive ? 'text-brand' : 'text-white/50'}`}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="mint-dot"
                                        className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-brand"
                                        transition={SPRING_TRANSITION}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
