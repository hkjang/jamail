'use client';

import { use, useEffect, useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { Sidebar } from '@/components/builder/Sidebar';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { createPortal } from 'react-dom';

export default function BuilderPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const { id } = use(params);
    const [isMounted, setIsMounted] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const {
        schema,
        selectedBlockId,
        setSelectedBlockId,
        selectedBlock,
        activeId,
        handleDragStart,
        handleDragCancel,
        handleDragEnd,
        handleUpdateBlock,
        handleDeleteBlock,
        handleSave,
    } = useTemplateBuilder(id);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading builder...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <BuilderHeader onSave={handleSave} />

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <Canvas
                        schema={schema}
                        onSelectBlock={setSelectedBlockId}
                        selectedBlockId={selectedBlockId}
                    />
                    <PropertiesPanel
                        block={selectedBlock || null}
                        onUpdate={handleUpdateBlock}
                        onDelete={handleDeleteBlock}
                    />
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeId ? (
                            <div className="p-3 bg-white border rounded shadow-lg opacity-80 w-40">
                                <span className="text-sm font-medium">
                                    {activeId.toString().replace('block-type-', '')}
                                </span>
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
