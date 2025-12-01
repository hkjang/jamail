'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { format } from 'date-fns';

interface Notice {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        email: string;
    };
}

export default function NoticeSettings() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotices = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/notices?limit=100`);
            if (res.ok) {
                const data = await res.json();
                setNotices(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notices:', error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSave = async () => {
        if (!currentNotice.title || !currentNotice.content) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const url = currentNotice.id
                ? `${apiUrl}/notices/${currentNotice.id}`
                : `${apiUrl}/notices`;

            const method = currentNotice.id ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: currentNotice.title,
                    content: currentNotice.content,
                }),
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentNotice({});
                fetchNotices();
            } else {
                alert('Failed to save notice');
            }
        } catch (error) {
            console.error('Error saving notice:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;

        try {
            const token = localStorage.getItem('access_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/notices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                fetchNotices();
            } else {
                alert('Failed to delete notice');
            }
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">공지사항 관리</h2>
                <button
                    onClick={() => {
                        setCurrentNotice({});
                        setIsEditing(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                >
                    <Plus size={16} /> 공지사항 등록
                </button>
            </div>

            {isEditing && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-md font-medium mb-4">{currentNotice.id ? '공지사항 수정' : '새 공지사항'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input
                                type="text"
                                value={currentNotice.title || ''}
                                onChange={(e) => setCurrentNotice({ ...currentNotice, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="공지사항 제목을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                            <textarea
                                value={currentNotice.content || ''}
                                onChange={(e) => setCurrentNotice({ ...currentNotice, content: e.target.value })}
                                rows={5}
                                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="공지사항 내용을 입력하세요"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notices.map((notice) => (
                            <tr key={notice.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {notice.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {notice.author.email.split('@')[0]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(notice.createdAt), 'yyyy-MM-dd')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setCurrentNotice(notice);
                                            setIsEditing(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(notice.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {notices.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    등록된 공지사항이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
