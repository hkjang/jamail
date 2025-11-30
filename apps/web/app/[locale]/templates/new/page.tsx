'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createTemplate, createVersion } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';

export default function NewTemplatePage() {
    const router = useRouter();
    const { locale } = useParams();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Create template
            const template = await createTemplate({
                name: data.name,
                description: data.description,
                category: data.category || 'OTHER',
            });

            // Create first version
            await createVersion(template.id, {
                subject: data.subject,
                htmlContent: data.htmlContent || '<p>Start editing...</p>',
                textContent: '',
            });

            // Navigate to the template detail page
            router.push(`/${locale}/templates/${template.id}`);
        } catch (error) {
            console.error('Failed to create template:', error);
            alert('Failed to create template. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {locale === 'ko' ? '새 템플릿 만들기' : 'Create New Template'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ko' ? '템플릿 이름' : 'Template Name'}
                    </label>
                    <input
                        {...register('name', { required: true })}
                        type="text"
                        placeholder={locale === 'ko' ? '환영 이메일' : 'Welcome Email'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ko' ? '설명' : 'Description'}
                    </label>
                    <textarea
                        {...register('description')}
                        placeholder={locale === 'ko' ? '이 템플릿에 대한 설명...' : 'Description for this template...'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ko' ? '카테고리' : 'Category'}
                    </label>
                    <select
                        {...register('category')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="NOTIFICATION">{locale === 'ko' ? '알림' : 'Notification'}</option>
                        <option value="MARKETING">{locale === 'ko' ? '마케팅' : 'Marketing'}</option>
                        <option value="SECURITY">{locale === 'ko' ? '보안' : 'Security'}</option>
                        <option value="OTHER">{locale === 'ko' ? '기타' : 'Other'}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ko' ? '제목' : 'Subject'}
                    </label>
                    <input
                        {...register('subject', { required: true })}
                        type="text"
                        placeholder={locale === 'ko' ? '{{name}}님, 환영합니다!' : 'Welcome, {{name}}!'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ko' ? 'HTML 내용' : 'HTML Content'}
                    </label>
                    <textarea
                        {...register('htmlContent')}
                        placeholder="<h1>Hello {{name}}!</h1>"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        rows={10}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? (locale === 'ko' ? '생성 중...' : 'Creating...') : (locale === 'ko' ? '템플릿 생성' : 'Create Template')}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        {locale === 'ko' ? '취소' : 'Cancel'}
                    </button>
                </div>
            </form>
        </div>
    );
}
