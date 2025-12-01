'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockSchema } from '@/types/builder';
import { BlockRenderer } from './BlockRenderer';

interface SortableBlockProps {
    block: BlockSchema;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export function SortableBlock({ block, isSelected, onSelect }: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
            className={`
        relative group cursor-move mb-2
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'}
      `}
        >
            <BlockRenderer block={block} />
        </div>
    );
}
