import * as React from 'react';
import { Icon } from '../icon';

export interface BrandLogoProps {
    title?: string;
    className?: string;
}

/**
 * Kache Digital Brand Logo
 * Implements strict accessibility: hides from screen readers if no title is provided.
 */
export const BrandLogo = ({ title, className }: BrandLogoProps) => (
    <Icon
        title={title}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Sleek Geometric 'K' for Kache Digital */}
        <path d="M4 4v16" />
        <path d="m16 4-12 8 12 8" />
        <path d="m12 12 8-8" />
        <path d="m12 12 8 8" />
    </Icon>
);
