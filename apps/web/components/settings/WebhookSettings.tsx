'use client';

import { useState, useEffect } from 'react';
import { fetchWebhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook, fetchWebhookDeliveries } from '@/lib/api';

export default function WebhookSettings() {
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [showWebhookForm, setShowWebhookForm] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<any>(null);
    const [webhookForm, setWebhookForm] = useState({ url: '', events: [] as string[], isActive: true });
    const [selectedWebhook, setSelectedWebhook] = useState<any>(null);
    const [deliveries, setDeliveries] = useState<any[]>([]);

    const eventTypes = [
        'email.sent',
        'email.delivered',
        'email.opened',
        'email.clicked',
        'email.failed'
    ];

    useEffect(() => {
        loadWebhooks();
    }, []);

    const loadWebhooks = async () => {
        try {
            const data = await fetchWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error('Failed to load webhooks:', error);
        }
    };

    const loadDeliveries = async (webhookId: string) => {
        try {
            const data = await fetchWebhookDeliveries(webhookId);
            setDeliveries(data);
        } catch (error) {
            console.error('Failed to load deliveries:', error);
        }
    };

    const handleCreateWebhook = async () => {
        try {
            await createWebhook(webhookForm);
            alert('웹훅이 생성되었습니다!');
            setShowWebhookForm(false);
            setWebhookForm({ url: '', events: [], isActive: true });
            loadWebhooks();
        } catch (error: any) {
            alert('웹훅 생성 실패: ' + error.message);
        }
    };

    const handleUpdateWebhook = async (id: string) => {
        try {
            await updateWebhook(id, webhookForm);
            alert('웹훅이 업데이트되었습니다!');
            setShowWebhookForm(false);
            setEditingWebhook(null);
            loadWebhooks();
        } catch (error: any) {
            alert('웹훅 업데이트 실패: ' + error.message);
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        if (!confirm('정말 이 웹훅을 삭제하시겠습니까?')) return;
        try {
            await deleteWebhook(id);
            alert('웹훅이 삭제되었습니다!');
            loadWebhooks();
        } catch (error: any) {
            alert('웹훅 삭제 실패: ' + error.message);
        }
    };

    const handleTestWebhook = async (id: string) => {
        try {
            await testWebhook(id);
            alert('테스트 웹훅이 큐에 추가되었습니다!');
        } catch (error: any) {
            alert('테스트 실패: ' + error.message);
        }
    };

    const toggleEvent = (event: string) => {
        setWebhookForm(prev => ({
            ...prev,
            events: prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event]
        }));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">웹훅 관리</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                        setShowWebhookForm(true);
                        setEditingWebhook(null);
                        setWebhookForm({ url: '', events: [], isActive: true });
                    }}
                >
                    웹훅 추가
                </button>
            </div>

            {showWebhookForm && (
                <div className="border p-6 rounded bg-gray-50 mb-4">
                    <h3 className="font-semibold mb-4">{editingWebhook ? '웹훅 수정' : '새 웹훅'}</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">엔드포인트 URL</label>
                            <input
                                type="url"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="https://your-domain.com/webhook"
                                value={webhookForm.url}
                                onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">이벤트 선택</label>
                            <div className="space-y-2">
                                {eventTypes.map(event => (
                                    <label key={event} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={webhookForm.events.includes(event)}
                                            onChange={() => toggleEvent(event)}
                                            className="mr-2"
                                        />
                                        <span>{event}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={webhookForm.isActive}
                                onChange={(e) => setWebhookForm({ ...webhookForm, isActive: e.target.checked })}
                                className="mr-2"
                            />
                            <label>활성화</label>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => editingWebhook ? handleUpdateWebhook(editingWebhook.id) : handleCreateWebhook()}
                            >
                                {editingWebhook ? '업데이트' : '생성'}
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setShowWebhookForm(false);
                                    setEditingWebhook(null);
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Webhook List */}
            <div className="space-y-4">
                {webhooks.map((webhook) => (
                    <div key={webhook.id} className="border p-4 rounded">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{webhook.url}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {webhook.isActive ? '활성' : '비활성'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">이벤트: {webhook.events.join(', ')}</p>
                                <p className="text-xs text-gray-500 mt-1">생성일: {new Date(webhook.createdAt).toLocaleString('ko-KR')}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="text-blue-500 text-sm hover:text-blue-700"
                                    onClick={() => {
                                        setEditingWebhook(webhook);
                                        setWebhookForm({
                                            url: webhook.url,
                                            events: webhook.events,
                                            isActive: webhook.isActive
                                        });
                                        setShowWebhookForm(true);
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    className="text-green-500 text-sm hover:text-green-700"
                                    onClick={() => handleTestWebhook(webhook.id)}
                                >
                                    테스트
                                </button>
                                <button
                                    className="text-purple-500 text-sm hover:text-purple-700"
                                    onClick={() => {
                                        setSelectedWebhook(webhook);
                                        loadDeliveries(webhook.id);
                                    }}
                                >
                                    로그
                                </button>
                                <button
                                    className="text-red-500 text-sm hover:text-red-700"
                                    onClick={() => handleDeleteWebhook(webhook.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        {/* Delivery Logs */}
                        {selectedWebhook?.id === webhook.id && deliveries.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="font-semibold mb-2">전송 로그</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {deliveries.map((delivery) => (
                                        <div key={delivery.id} className="text-sm border-l-2 pl-3 py-1" style={{
                                            borderColor: delivery.status === 'success' ? '#10b981' : delivery.status === 'failed' ? '#ef4444' : '#6b7280'
                                        }}>
                                            <div className="flex justify-between">
                                                <span className="font-medium">{delivery.event}</span>
                                                <span className={`text-xs ${delivery.status === 'success' ? 'text-green-600' : delivery.status === 'failed' ? 'text-red-600' : 'text-gray-600'}`}>
                                                    {delivery.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(delivery.createdAt).toLocaleString('ko-KR')} | 시도: {delivery.attempts}회
                                                {delivery.responseCode && ` | 응답: ${delivery.responseCode}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {webhooks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">등록된 웹훅이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
