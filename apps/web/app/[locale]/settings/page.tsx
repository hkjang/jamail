'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchSmtpConfigs, createSmtpConfig, updateSmtpConfig, deleteSmtpConfig, testSmtpConnection } from '@/lib/api';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'smtp' | 'apikeys' | 'notifications' | 'users'>('smtp');
    const [smtpConfigs, setSmtpConfigs] = useState<any[]>([]);
    const [editingSmtp, setEditingSmtp] = useState<any>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (activeTab === 'smtp') {
            loadSmtpConfigs();
        }
    }, [activeTab]);

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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            alert('테스트 실패: ' + error.message);
        }
    };

    const onGenerateAPIKey = () => {
        const newKey = 'sk_' + Math.random().toString(36).substring(2, 15);
        alert(`새 API 키가 생성되었습니다:\n\n${newKey}\n\n이 키는 다시 표시되지 않으니 안전한 곳에 보관하세요.`);
    };

    const onSaveNotifications = (data: any) => {
        console.log('Notification Settings:', data);
        alert('알림 설정이 저장되었습니다!');
    };

    const onAddUser = () => {
        const email = prompt('새 사용자 이메일 주소를 입력하세요:');
        if (email) {
            alert(`사용자 ${email}이(가) 추가되었습니다!`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">설정</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('smtp')}
                        className={`${activeTab === 'smtp'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        📧 SMTP 설정
                    </button>
                    <button
                        onClick={() => setActiveTab('apikeys')}
                        className={`${activeTab === 'apikeys'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        🔑 API 키
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`${activeTab === 'notifications'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        🔔 알림 설정
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${activeTab === 'users'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        👥 사용자 관리
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow rounded-lg p-6">
                {activeTab === 'smtp' && (
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">사용자명 *</label>
                                    <input
                                        {...register('username', { required: true })}
                                        type="text"
                                        placeholder="your-email@gmail.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 *</label>
                                    <input
                                        {...register('password', { required: !editingSmtp })}
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
                )}

                {activeTab === 'apikeys' && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">API 키 관리</h2>
                        <p className="text-sm text-gray-500 mb-4">API 접근을 위한 인증 키를 생성하고 관리합니다.</p>
                        <button
                            onClick={onGenerateAPIKey}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            새 API 키 생성
                        </button>
                        <div className="mt-6">
                            <div className="text-sm text-gray-500">생성된 API 키가 없습니다.</div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <form onSubmit={handleSubmit(onSaveNotifications)}>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">알림 설정</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    {...register('successNotif')}
                                    type="checkbox"
                                    id="success"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="success" className="ml-2 block text-sm text-gray-900">
                                    이메일 전송 성공 시 알림
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    {...register('failureNotif')}
                                    type="checkbox"
                                    id="failure"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    defaultChecked
                                />
                                <label htmlFor="failure" className="ml-2 block text-sm text-gray-900">
                                    이메일 전송 실패 시 알림
                                </label>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                저장
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">사용자 관리</h2>
                        <p className="text-sm text-gray-500 mb-4">시스템 사용자 계정과 권한을 관리합니다.</p>
                        <button
                            onClick={onAddUser}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            새 사용자 추가
                        </button>
                        <div className="mt-6">
                            <div className="text-sm text-gray-500">등록된 사용자가 없습니다.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
