'use client';

import { BlockSchema } from '@/types/builder';

interface BlockRendererProps {
    block: BlockSchema;
}

export function BlockRenderer({ block }: BlockRendererProps) {
    const styles = block.styles || {};

    switch (block.type) {
        case 'text':
            return (
                <div style={styles}>
                    {block.content || 'Your text here'}
                </div>
            );

        case 'image':
            return (
                <img
                    src={block.src || '/placeholder.png'}
                    alt={block.alt || 'Image'}
                    style={styles}
                />
            );

        case 'button':
            return (
                <a
                    href={block.href || '#'}
                    style={{ ...styles, display: 'inline-block', textDecoration: 'none' }}
                >
                    {block.content || 'Button'}
                </a>
            );

        case 'divider':
            return <hr style={{ ...styles, border: 'none', borderTop: '1px solid #ddd' }} />;

        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />;

        default:
            return null;
    }
}
