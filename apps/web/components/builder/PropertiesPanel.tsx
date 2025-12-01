'use client';

import { BlockSchema } from '@/types/builder';

interface PropertiesPanelProps {
    block: BlockSchema | null;
    onUpdate: (blockId: string, updates: Partial<BlockSchema>) => void;
    onDelete: (blockId: string) => void;
}

export function PropertiesPanel({ block, onUpdate, onDelete }: PropertiesPanelProps) {
    if (!block) {
        return (
            <aside className="w-80 bg-white border-l p-4">
                <p className="text-gray-400 text-sm">Select a block to edit properties</p>
            </aside>
        );
    }

    const handleInputChange = (field: keyof BlockSchema, value: any) => {
        onUpdate(block.id, { [field]: value });
    };

    const handleStyleChange = (styleProp: string, value: string) => {
        onUpdate(block.id, {
            styles: { ...block.styles, [styleProp]: value },
        });
    };

    return (
        <aside className="w-80 bg-white border-l p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4 text-sm uppercase text-gray-600">Properties</h2>

            <div className="space-y-4">
                {/* Content */}
                {(block.type === 'text' || block.type === 'button') && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="w-full border rounded p-2 text-sm"
                            rows={3}
                        />
                    </div>
                )}

                {/* Image Source */}
                {block.type === 'image' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                value={block.src || ''}
                                onChange={(e) => handleInputChange('src', e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Alt Text</label>
                            <input
                                type="text"
                                value={block.alt || ''}
                                onChange={(e) => handleInputChange('alt', e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Button Link */}
                {block.type === 'button' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Link URL</label>
                        <input
                            type="text"
                            value={block.href || ''}
                            onChange={(e) => handleInputChange('href', e.target.value)}
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                )}

                {/* HTML Content */}
                {block.type === 'html' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">HTML Code</label>
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="w-full border rounded p-2 text-sm font-mono"
                            rows={6}
                        />
                    </div>
                )}

                {/* Styles */}
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-sm mb-3">Styles</h3>

                    {block.type !== 'divider' && (
                        <>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Font Size</label>
                                <input
                                    type="text"
                                    value={block.styles?.fontSize || ''}
                                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                    placeholder="16px"
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Color</label>
                                <input
                                    type="color"
                                    value={block.styles?.color || '#000000'}
                                    onChange={(e) => handleStyleChange('color', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Background Color</label>
                                <input
                                    type="color"
                                    value={block.styles?.backgroundColor || '#ffffff'}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Padding</label>
                        <input
                            type="text"
                            value={block.styles?.padding || ''}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                            placeholder="10px"
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Margin</label>
                        <input
                            type="text"
                            value={block.styles?.margin || ''}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                            placeholder="10px 0"
                            className="w-full border rounded p-2 text-sm"
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <button
                        onClick={() => onDelete(block.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                        Delete Block
                    </button>
                </div>
            </div>
        </aside>
    );
}
