import { ReactNode } from 'react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Document } from '@contentful/rich-text-types';

interface RichTextRendererProps {
    content: Document;
}

const options: Options = {
    renderNode: {
        [BLOCKS.HEADING_2]: (_node: unknown, children: ReactNode) => (
            <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (_node: unknown, children: ReactNode) => (
            <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
        ),
        [BLOCKS.PARAGRAPH]: (_node: unknown, children: ReactNode) => (
            <p className="mb-4 leading-relaxed">{children}</p>
        ),
        [INLINES.HYPERLINK]: (node, children: ReactNode) => (
            <a
                href={node.data.uri as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-all"
            >
                {children}
            </a>
        ),
    },
};

export function RichTextRenderer({ content }: RichTextRendererProps) {
    if (!content) return null;
    return (
        <div className="prose prose-invert max-w-none">
            {documentToReactComponents(content, options)}
        </div>
    );
}
