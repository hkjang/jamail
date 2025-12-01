'use client';

import { useState } from 'react';
import SmtpSettings from '@/components/settings/SmtpSettings';
import WebhookSettings from '@/components/settings/WebhookSettings';
import APIKeySettings from '@/components/settings/APIKeySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import UserSettings from '@/components/settings/UserSettings';
import NoticeSettings from '@/components/settings/NoticeSettings';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'smtp' | 'webhooks' | 'apikeys' | 'notifications' | 'users' | 'notices'>('smtp');

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
                        onClick={() => setActiveTab('webhooks')}
                        className={`${activeTab === 'webhooks'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        🔔 웹훅 관리
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
                    <button
                        onClick={() => setActiveTab('notices')}
                        className={`${activeTab === 'notices'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        📢 공지사항 관리
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow rounded-lg p-6">
                {activeTab === 'smtp' && <SmtpSettings />}
                {activeTab === 'webhooks' && <WebhookSettings />}
                {activeTab === 'apikeys' && <APIKeySettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'users' && <UserSettings />}
                {activeTab === 'notices' && <NoticeSettings />}
            </div>
        </div>
    );
}
