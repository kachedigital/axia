import * as React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    children: React.ReactNode;
}

export function Icon({ title, children, ...props }: IconProps) {
    return (
        <svg
            role={title ? 'img' : 'presentation'}
            aria-hidden={!title}
            {...props}
        >
            {title && <title>{title}</title>}
            {children}
        </svg>
    );
}
