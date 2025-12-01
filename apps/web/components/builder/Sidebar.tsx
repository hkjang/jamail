'use client';

import { useDraggable } from '@dnd-kit/core';

import { Type, Image, Square, Minus, Code } from 'lucide-react';

const blockTypes = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'button', label: 'Button', icon: Square },
    { id: 'divider', label: 'Divider', icon: Minus },
    { id: 'html', label: 'HTML', icon: Code },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4 text-sm uppercase text-gray-600">Blocks</h2>
            <div className="space-y-2">
                {blockTypes.map((blockType) => (
                    <DraggableBlock key={blockType.id} {...blockType} />
                ))}
            </div>
        </aside>
    );
}



function DraggableBlock({ id, label, icon: Icon }: { id: string; label: string; icon: any }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `block-type-${id}`,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
        flex items-center gap-3 p-3 border rounded cursor-move
        hover:bg-gray-50 hover:border-blue-400 transition-colors
        ${isDragging ? 'opacity-50' : ''}
      `}
        >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}
