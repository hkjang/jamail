'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchSmtpConfigs, createSmtpConfig, updateSmtpConfig, deleteSmtpConfig, testSmtpConnection } from '@/lib/api';

export default function SmtpSettings() {
    const [smtpConfigs, setSmtpConfigs] = useState<any[]>([]);
    const [editingSmtp, setEditingSmtp] = useState<any>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        loadSmtpConfigs();
    }, []);

    const loadSmtpConfigs = async () => {
        try {
            const configs = await fetchSmtpConfigs();
            setSmtpConfigs(configs);
        } catch (error) {
            console.error('Failed to load SMTP configs:', error);
        }
    };

    const onSaveSMTP = async (data: any) => {
        try {
            const smtpData = {
                ...data,
                port: parseInt(data.port),
                secure: data.secure === 'true' || data.secure === true,
                isDefault: data.isDefault === 'true' || data.isDefault === true,
                categories: data.categories ? data.categories.split(',').map((c: string) => c.trim()) : [],
            };

            if (editingSmtp) {
                await updateSmtpConfig(editingSmtp.id, smtpData);
                alert('SMTP 설정이 업데이트되었습니다!');
            } else {
                await createSmtpConfig(smtpData);
                alert('SMTP 설정이 저장되었습니다!');
            }

            reset();
            setEditingSmtp(null);
            loadSmtpConfigs();
        } catch (error: any) {
            alert('SMTP 설정 저장에 실패했습니다: ' + error.message);
        }
    };

    const onEditSmtp = (config: any) => {
        setEditingSmtp(config);
        setValue('name', config.name);
        setValue('host', config.host);
        setValue('port', config.port);
        setValue('username', config.username);
        setValue('password', config.password);
        setValue('secure', config.secure);
        setValue('isDefault', config.isDefault);
        setValue('categories', config.categories.join(', '));
    };

    const onDeleteSmtp = async (id: string) => {
        if (!confirm('이 SMTP 설정을 삭제하시겠습니까?')) return;

        try {
            await deleteSmtpConfig(id);
            alert('SMTP 설정이 삭제되었습니다!');
            loadSmtpConfigs();
        } catch (error: any) {
            alert('삭제 실패: ' + error.message);
        }
    };

    const onTestSmtp = async (id: string) => {
        try {
            const result = await testSmtpConnection(id);
            if (result.success) {
                alert('✅ 연결 성공!\n\n' + result.message);
            } else {
                alert('❌ 연결 실패\n\n' + result.message);
            }
        } catch (error: any) {
            alert('테스트 실패: ' + error.message);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">SMTP 서버 설정</h2>

            {/* SMTP Form */}
            <form onSubmit={handleSubmit(onSaveSMTP)} className="mb-8 border-b pb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                        <input
                            {...register('name', { required: true })}
                            type="text"
                            placeholder="Gmail SMTP"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">호스트 *</label>
                        <input
                            {...register('host', { required: true })}
                            type="text"
                            placeholder="smtp.gmail.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">포트 *</label>
                        <input
                            {...register('port', { required: true })}
                            type="number"
                            placeholder="587"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="your-email@gmail.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder={editingSmtp ? "변경하려면 입력" : ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 (쉼표로 구분)</label>
                        <input
                            {...register('categories')}
                            type="text"
                            placeholder="MARKETING, NOTIFICATION"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center">
                            <input {...register('secure')} type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">보안 연결 (SSL/TLS)</span>
                        </label>
                        <label className="flex items-center">
                            <input {...register('isDefault')} type="checkbox" className="mr-2" />
                            <span className="text-sm">기본 SMTP로 설정</span>
                        </label>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        {editingSmtp ? '업데이트' : '저장'}
                    </button>
                    {editingSmtp && (
                        <button
                            type="button"
                            onClick={() => { reset(); setEditingSmtp(null); }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            취소
                        </button>
                    )}
                </div>
            </form>

            {/* SMTP List */}
            <div className="space-y-3">
                {smtpConfigs.map((config) => (
                    <div key={config.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    {config.name}
                                    {config.isDefault && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">기본</span>}
                                </h3>
                                <p className="text-sm text-gray-600">{config.host}:{config.port}</p>
                                <p className="text-sm text-gray-500">사용자: {config.username}</p>
                                {config.categories.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">카테고리: {config.categories.join(', ')}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onTestSmtp(config.id)}
                                    className="text-green-600 hover:text-green-700 text-sm"
                                >
                                    테스트
                                </button>
                                <button
                                    onClick={() => onEditSmtp(config)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => onDeleteSmtp(config.id)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {smtpConfigs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">등록된 SMTP 설정이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
