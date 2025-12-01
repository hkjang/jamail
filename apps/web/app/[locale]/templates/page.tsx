"use client";

import { useEffect, useState } from 'react';
import { fetchTemplates } from '@/lib/api';
import Link from 'next/link';
import { Plus, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function TemplatesPage() {
    const t = useTranslations('Templates');
    const { locale } = useParams();
    const [templates, setTemplates] = useState<any[]>([]);

    useEffect(() => {
        fetchTemplates().then(setTemplates);
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <Link href={`/${locale}/templates/new`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={20} />
                    {t('new')}
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((tItem) => (
                    <Link key={tItem.id} href={`/${locale}/templates/${tItem.id}`} className="block group">
                        <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Mail size={24} />
                                </div>
                                <div className="flex gap-2">
                                    {tItem.type && (
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${tItem.type === 'BUILDER'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {tItem.type === 'BUILDER' ? '🎨 Builder' : '📝 Basic'}
                                        </span>
                                    )}
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                        {tItem.category}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                                {tItem.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {tItem.description || t('noDescription')}
                            </p>
                            <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-400">
                                <span>{t('version', { version: tItem.versions?.[0]?.versionNumber || 0 })}</span>
                                <span>{new Date(tItem.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
