'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@repo/ui/components/brand-logo';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

export function Header() {
    const scrollDirection = useScrollDirection();
    const isHidden = scrollDirection === 'down';

    return (
        <header
            className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/10 bg-background/60 transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group" aria-label="Go to Home">
                            <BrandLogo className="h-8 w-auto text-primary transition-transform group-hover:scale-110" title="Kache Digital Logo" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">
                                KACHE <span className="text-primary">DIGITAL</span>
                            </span>
                        </Link>
                    </div>

                    <nav aria-label="Main Portfolio" className="hidden md:flex items-center gap-8">
                        <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
                            Projects
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
                            Services
                        </Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/resume"
                            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Get Resume
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
