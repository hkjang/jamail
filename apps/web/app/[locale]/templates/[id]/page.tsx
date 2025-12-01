"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchTemplate, createVersion, previewTemplate, sendEmail } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Save, Play, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import VersionHistory from '@/components/VersionHistory';

export default function TemplateDetailPage() {
    const t = useTranslations('Editor');
    const { id, locale } = useParams();
    const [template, setTemplate] = useState<any>(null);
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            subject: '',
            htmlContent: '',
            variables: '{}',
            recipient: '',
        }
    });

    const htmlContent = watch('htmlContent');
    const variablesStr = watch('variables');

    useEffect(() => {
        if (id) {
            fetchTemplate(id as string).then(data => {
                setTemplate(data);
                if (data.currentVersionId) {
                    const version = data.versions.find((v: any) => v.id === data.currentVersionId);
                    if (version) {
                        setValue('subject', version.subject);
                        setValue('htmlContent', version.htmlContent);
                    }
                }
            });
        }
    }, [id, setValue]);

    const onSave = async (data: any) => {
        try {
            await createVersion(id as string, {
                subject: data.subject,
                htmlContent: data.htmlContent,
            });
            alert('Version saved!');
            const updated = await fetchTemplate(id as string);
            setTemplate(updated);
        } catch (e) {
            alert('Failed to save version');
            console.error(e);
        }
    };

    const onPreview = async () => {
        try {
            const vars = JSON.parse(variablesStr || '{}');
            const res = await previewTemplate({
                htmlContent,
                variables: vars,
            });
            setPreviewHtml(res.html);
            setActiveTab('preview');
        } catch (e) {
            alert('Invalid JSON variables or preview failed');
            console.error(e);
        }
    };

    const onSend = async (data: any) => {
        try {
            const vars = JSON.parse(data.variables || '{}');
            await sendEmail(id as string, {
                recipient: data.recipient,
                variables: vars,
            });
            alert('Email sent successfully!');
        } catch (e) {
            alert('Failed to send email');
            console.error(e);
        }
    };

    if (!template) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{template.name}</h1>
                        {template.type && (
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${template.type === 'BUILDER'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {template.type === 'BUILDER' ? '🎨 Builder' : '📝 Basic'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">v{template.versions?.[0]?.versionNumber || 0}</p>
                </div>
                <div className="flex gap-2">
                    <a
                        href={`/${locale}/templates/${id}/builder`}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        🎨 Builder
                    </a>
                    <button onClick={handleSubmit(onSave)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                        <Save size={18} /> {t('save')}
                    </button>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Left: Editor */}
                <div className="flex-1 flex flex-col gap-4">
                    <input
                        {...register('subject')}
                        placeholder={t('subject')}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
                        <div className="bg-gray-50 border-b px-4 py-2 flex gap-4 text-sm font-medium text-gray-600">
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`pb-1 ${activeTab === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                            >
                                {t('htmlCode')}
                            </button>
                            <button
                                onClick={onPreview}
                                className={`pb-1 ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                            >
                                {t('preview')}
                            </button>
                        </div>

                        {activeTab === 'edit' ? (
                            <textarea
                                {...register('htmlContent')}
                                className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none"
                                placeholder="<html>...</html>"
                            />
                        ) : (
                            <div className="flex-1 bg-white p-4 overflow-auto">
                                <iframe
                                    srcDoc={previewHtml}
                                    className="w-full h-full border-none"
                                    title="Preview"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Tools */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white border rounded-xl p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Play size={18} /> {t('testVariables')}
                        </h3>
                        <textarea
                            {...register('variables')}
                            className="w-full h-40 p-3 border rounded-lg font-mono text-xs mb-2"
                            placeholder='{"name": "John"}'
                        />
                        <button onClick={onPreview} className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                            {t('updatePreview')}
                        </button>
                    </div>

                    <div className="bg-white border rounded-xl p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Send size={18} /> {t('testSend')}
                        </h3>
                        <input
                            {...register('recipient')}
                            placeholder="recipient@example.com"
                            className="w-full p-2 border rounded-lg mb-3 text-sm"
                        />
                        <button onClick={handleSubmit(onSend)} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                            {t('send')}
                        </button>
                    </div>

                    {/* Version History */}
                    {template && template.currentVersionId && (
                        <div className="flex-1 min-h-0">
                            <VersionHistory templateId={template.id} currentVersionId={template.currentVersionId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
