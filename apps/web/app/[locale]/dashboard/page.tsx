'use client';

import { useEffect, useState } from 'react';
import { fetchStats } from '@/lib/api';
import { BarChart, Activity, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchStats().then(setStats);
    }, []);

    if (!stats) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <BarChart size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Templates</p>
                        <p className="text-2xl font-bold">{stats.totalTemplates}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Sent</p>
                        <p className="text-2xl font-bold">{stats.totalSent}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Failed</p>
                        <p className="text-2xl font-bold">{stats.totalFailed}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity size={20} /> Recent Activity
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentLogs.map((log: any) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.recipient}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.status === 'SENT' ? 'bg-green-100 text-green-800' :
                                                log.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.sentAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
