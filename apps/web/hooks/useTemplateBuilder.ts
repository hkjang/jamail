'use client';

import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { BlockSchema, TemplateSchema } from '@/types/builder';
import { getDefaultContent, getDefaultStyles } from '@/utils/blockDefaults';
import { fetchTemplate, updateTemplate } from '@/lib/api';

export function useTemplateBuilder(templateId: string) {
    const [schema, setSchema] = useState<TemplateSchema>({
        sections: [],
        globalStyles: {
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f4f4',
        },
    });

    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // Create a new block from the sidebar
        if (active.id.toString().startsWith('block-type-')) {
            const blockType = active.id.toString().replace('block-type-', '') as BlockSchema['type'];
            const newBlock: BlockSchema = {
                id: `block-${Date.now()}`,
                type: blockType,
                content: getDefaultContent(blockType),
                styles: getDefaultStyles(blockType),
            };

            // Add to the first section, first column (or create if doesn't exist)
            setSchema(prev => {
                // Deep clone to avoid mutation
                const updated = JSON.parse(JSON.stringify(prev));

                if (updated.sections.length === 0) {
                    updated.sections = [{
                        id: `section-${Date.now()}`,
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        columns: [{
                            id: `column-${Date.now()}`,
                            width: '100%',
                            blocks: [newBlock],
                        }],
                    }];
                } else {
                    if (updated.sections[0].columns.length === 0) {
                        updated.sections[0].columns = [{
                            id: `column-${Date.now()}`,
                            width: '100%',
                            blocks: [newBlock],
                        }];
                    } else {
                        updated.sections[0].columns[0].blocks.push(newBlock);
                    }
                }
                return updated;
            });
            return;
        }

        // Handle reordering
        if (active.id !== over.id) {
            setSchema((prev) => {
                const updated = { ...prev }; // Shallow copy is not enough for nested updates, but we'll mutate deep properties carefully or clone
                // Deep clone to be safe
                const newSchema = JSON.parse(JSON.stringify(updated));

                const findBlockCoords = (id: string) => {
                    for (let sIdx = 0; sIdx < newSchema.sections.length; sIdx++) {
                        for (let cIdx = 0; cIdx < newSchema.sections[sIdx].columns.length; cIdx++) {
                            const bIdx = newSchema.sections[sIdx].columns[cIdx].blocks.findIndex((b: BlockSchema) => b.id === id);
                            if (bIdx !== -1) {
                                return { sIdx, cIdx, bIdx };
                            }
                        }
                    }
                    return null;
                };

                const activeCoords = findBlockCoords(active.id.toString());
                const overCoords = findBlockCoords(over.id.toString());

                if (activeCoords && overCoords) {
                    // Same column reordering
                    if (activeCoords.sIdx === overCoords.sIdx && activeCoords.cIdx === overCoords.cIdx) {
                        const column = newSchema.sections[activeCoords.sIdx].columns[activeCoords.cIdx];
                        column.blocks = arrayMove(column.blocks, activeCoords.bIdx, overCoords.bIdx);
                    }
                }

                return newSchema;
            });
        }
    };

    const handleUpdateBlock = (blockId: string, updates: Partial<BlockSchema>) => {
        setSchema(prev => {
            const updated = JSON.parse(JSON.stringify(prev));

            // Find and update the block
            for (const section of updated.sections) {
                for (const column of section.columns) {
                    const blockIndex = column.blocks.findIndex((b: BlockSchema) => b.id === blockId);
                    if (blockIndex !== -1) {
                        column.blocks[blockIndex] = { ...column.blocks[blockIndex], ...updates };
                        break;
                    }
                }
            }

            return updated;
        });
    };

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const data = await fetchTemplate(templateId);
                if (data.schema && typeof data.schema === 'object' && data.schema.sections) {
                    setSchema(data.schema);
                }
            } catch (error) {
                console.error('Failed to load template:', error);
            }
        };

        if (templateId) {
            loadTemplate();
        }
    }, [templateId]);

    const handleDeleteBlock = (blockId: string) => {
        setSchema(prev => {
            const updated = JSON.parse(JSON.stringify(prev));

            for (const section of updated.sections) {
                for (const column of section.columns) {
                    const blockIndex = column.blocks.findIndex((b: BlockSchema) => b.id === blockId);
                    if (blockIndex !== -1) {
                        column.blocks.splice(blockIndex, 1);
                        break;
                    }
                }
            }

            return updated;
        });
        setSelectedBlockId(null);
    };

    const handleSave = async () => {
        try {
            await updateTemplate(templateId, { schema });
            alert('Template saved successfully!');
        } catch (error) {
            console.error('Failed to save template:', error);
            alert('Failed to save template');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedBlockId) return;

            // Don't delete if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                handleDeleteBlock(selectedBlockId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedBlockId]);

    const selectedBlock = schema.sections
        .flatMap(s => s.columns)
        .flatMap(c => c.blocks)
        .find(b => b.id === selectedBlockId);

    return {
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
    };
}
