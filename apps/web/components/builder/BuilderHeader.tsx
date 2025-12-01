'use client';

interface BuilderHeaderProps {
    onSave: () => void;
}

export function BuilderHeader({ onSave }: BuilderHeaderProps) {
    return (
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Template Builder</h1>
            <button
                onClick={onSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save
            </button>
        </header>
    );
}
