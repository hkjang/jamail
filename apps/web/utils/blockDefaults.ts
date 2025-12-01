import { BlockSchema } from '@/types/builder';

export function getDefaultContent(type: BlockSchema['type']): string {
    switch (type) {
        case 'text':
            return 'Your text here';
        case 'button':
            return 'Click Me';
        case 'html':
            return '<div>Custom HTML</div>';
        default:
            return '';
    }
}

export function getDefaultStyles(type: BlockSchema['type']) {
    switch (type) {
        case 'text':
            return {
                fontSize: '16px',
                color: '#333333',
                padding: '10px',
            };
        case 'button':
            return {
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#007bff',
                padding: '10px 20px',
                borderRadius: '4px',
                textAlign: 'center' as const,
            };
        case 'divider':
            return {
                margin: '20px 0',
            };
        default:
            return {};
    }
}
