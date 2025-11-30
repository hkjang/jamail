import { useState, useEffect } from 'react';
import { fetchTemplate } from '@/lib/api';
import { diffLines } from 'diff';
import { useTranslations } from 'next-intl';

interface VersionHistoryProps {
    templateId: string;
    currentVersionId: string;
}

export default function VersionHistory({ templateId, currentVersionId }: VersionHistoryProps) {
    const t = useTranslations('Editor');
    const [versions, setVersions] = useState<any[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [diffResult, setDiffResult] = useState<any[]>([]);

    useEffect(() => {
        fetchTemplate(templateId).then(data => {
            setVersions(data.versions);
        });
    }, [templateId]);

    useEffect(() => {
        if (selectedVersion && versions.length > 0) {
            const current = versions.find(v => v.id === currentVersionId);
            const selected = versions.find(v => v.id === selectedVersion);

            if (current && selected) {
                const diff = diffLines(selected.htmlContent, current.htmlContent);
                setDiffResult(diff);
            }
        }
    }, [selectedVersion, currentVersionId, versions]);

    return (
        <div className="bg-white border rounded-xl p-4 h-full flex flex-col">
            <h3 className="font-semibold mb-4">Version History</h3>

            <div className="flex-1 overflow-auto mb-4">
                {versions.map((v) => (
                    <div
                        key={v.id}
                        onClick={() => setSelectedVersion(v.id)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedVersion === v.id ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">v{v.versionNumber}</span>
                            <span className="text-xs text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate">{v.subject}</div>
                    </div>
                ))}
            </div>

            {selectedVersion && (
                <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Changes (vs Current)</h4>
                    <div className="bg-gray-50 p-2 rounded text-xs font-mono h-40 overflow-auto">
                        {diffResult.map((part, index) => (
                            <span
                                key={index}
                                className={part.added ? 'text-green-600 bg-green-50 block' : part.removed ? 'text-red-600 bg-red-50 block' : 'text-gray-500 block'}
                            >
                                {part.value}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
