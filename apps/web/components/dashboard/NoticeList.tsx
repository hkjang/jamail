'use client';

import { useEffect, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function NoticeList() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotices = async (page: number) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/notices?page=${page}&limit=5`);
            if (res.ok) {
                const data = await res.json();
                setNotices(data.data);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch notices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices(page);
    }, [page]);

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell size={20} /> Notices
            </h2>

            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading notices...</div>
            ) : notices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No notices found.</div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div key={notice.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium text-gray-900">{notice.title}</h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {format(new Date(notice.createdAt), 'yyyy-MM-dd')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                            <div className="mt-2 text-xs text-gray-400">
                                Posted by {notice.author.email.split('@')[0]}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
