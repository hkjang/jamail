'use client';

import { useState, useEffect } from 'react';
import { fetchApiKeys, createApiKey, deleteApiKey } from '@/lib/api';

interface ApiKey {
    id: string;
    name: string;
    scopes: string[];
    createdAt: string;
    lastUsedAt?: string;
    expiresAt?: string;
}

const AVAILABLE_SCOPES = [
    { id: 'read_templates', label: '템플릿 조회' },
    { id: 'write_templates', label: '템플릿 관리 (생성/수정)' },
    { id: 'delete_templates', label: '템플릿 삭제' },
    { id: 'send_email', label: '이메일 발송' },
    { id: 'read_settings', label: '설정 조회' },
    { id: 'manage_settings', label: '설정 관리' },
    { id: 'read_webhooks', label: '웹훅 조회' },
    { id: 'manage_webhooks', label: '웹훅 관리' },
];

export default function APIKeySettings() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['read_templates', 'send_email']);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadApiKeys();
    }, []);

    const loadApiKeys = async () => {
        try {
            setIsLoading(true);
            const data = await fetchApiKeys();
            setApiKeys(data);
        } catch (err) {
            console.error('Failed to load API keys', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setGeneratedKey(null);

        try {
            const res = await createApiKey({
                name: newKeyName,
                scopes: selectedScopes,
            });
            setGeneratedKey(res.key);
            setNewKeyName('');
            setSelectedScopes(['read_templates', 'send_email']);
            setIsCreating(false);
            loadApiKeys();
        } catch (err: any) {
            setError(err.response?.data?.message || 'API 키 생성 실패');
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('정말로 이 API 키를 삭제하시겠습니까? 이 키를 사용하는 모든 애플리케이션이 작동을 멈춥니다.')) return;

        try {
            await deleteApiKey(id);
            loadApiKeys();
        } catch (err: any) {
            alert(err.response?.data?.message || 'API 키 삭제 실패');
        }
    };

    const toggleScope = (scopeId: string) => {
        setSelectedScopes(prev =>
            prev.includes(scopeId)
                ? prev.filter(id => id !== scopeId)
                : [...prev, scopeId]
        );
    };

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">API 키 관리</h2>
                    <p className="text-sm text-gray-500">외부 애플리케이션 연동을 위한 API 키를 관리합니다.</p>
                </div>
                <button
                    onClick={() => { setIsCreating(!isCreating); setGeneratedKey(null); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                    {isCreating ? '취소' : '새 API 키 생성'}
                </button>
            </div>

            {generatedKey && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm leading-5 font-medium text-green-800">
                                API 키가 생성되었습니다
                            </h3>
                            <div className="mt-2 text-sm leading-5 text-green-700">
                                <p className="mb-2">이 키는 다시 표시되지 않으니 안전한 곳에 복사해 두세요:</p>
                                <div className="bg-white p-2 rounded border border-green-300 font-mono break-all select-all">
                                    {generatedKey}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isCreating && (
                <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">새 API 키 설정</h3>
                    <form onSubmit={handleCreateKey} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">키 이름 (식별용)</label>
                            <input
                                type="text"
                                required
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="예: 마케팅 서버, 결제 시스템"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">권한 (Scopes)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {AVAILABLE_SCOPES.map((scope) => (
                                    <div key={scope.id} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={`scope-${scope.id}`}
                                                type="checkbox"
                                                checked={selectedScopes.includes(scope.id)}
                                                onChange={() => toggleScope(scope.id)}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`scope-${scope.id}`} className="font-medium text-gray-700">
                                                {scope.id}
                                            </label>
                                            <p className="text-gray-500 text-xs">{scope.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                            >
                                생성하기
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                이름 / 스코프
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                상태
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                생성일 / 마지막 사용
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {apiKeys.map((key) => (
                            <tr key={key.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{key.name}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {key.scopes.map(scope => (
                                            <span key={scope} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {scope}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{new Date(key.createdAt).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-400">
                                        {key.lastUsedAt ? `마지막 사용: ${new Date(key.lastUsedAt).toLocaleString()}` : '사용 이력 없음'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteKey(key.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {apiKeys.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                    생성된 API 키가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
