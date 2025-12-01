'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TemplateSchema } from '@/types/builder';
import { SortableBlock } from './SortableBlock';

interface CanvasProps {
    schema: TemplateSchema;
    onSelectBlock: (blockId: string) => void;
    selectedBlockId: string | null;
}

export function Canvas({ schema, onSelectBlock, selectedBlockId }: CanvasProps) {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <main className="flex-1 bg-gray-100 p-8 overflow-y-auto" ref={setNodeRef}>
            <div className="max-w-2xl mx-auto bg-white shadow-lg min-h-[600px] p-6">
                {schema.sections.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <p>Drag blocks here to start building your template</p>
                    </div>
                ) : (
                    schema.sections.map((section) => (
                        <div
                            key={section.id}
                            className="mb-4"
                            style={{
                                backgroundColor: section.backgroundColor,
                                padding: section.padding,
                            }}
                        >
                            {section.columns.map((column) => (
                                <div key={column.id} style={{ width: column.width }}>
                                    <SortableContext
                                        items={column.blocks.map(b => b.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {column.blocks.map((block) => (
                                            <SortableBlock
                                                key={block.id}
                                                block={block}
                                                isSelected={selectedBlockId === block.id}
                                                onSelect={onSelectBlock}
                                            />
                                        ))}
                                    </SortableContext>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
