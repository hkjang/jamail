'use client';

import { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
    createdAt: string;
    lastLoginAt?: string;
}

export default function UserSettings() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('VIEWER');
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await createUser({
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });
            setIsCreating(false);
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('VIEWER');
            loadUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || '사용자 생성 실패');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

        try {
            await deleteUser(id);
            loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || '사용자 삭제 실패');
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await updateUser(id, { role: newRole });
            loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || '권한 수정 실패');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">사용자 관리</h2>
                    <p className="text-sm text-gray-500">시스템 사용자 계정과 권한을 관리합니다.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                    {isCreating ? '취소' : '새 사용자 추가'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">새 사용자 정보 입력</h3>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">이메일</label>
                                <input
                                    type="email"
                                    required
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">비밀번호</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">권한</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="VIEWER">Viewer (읽기 전용)</option>
                                    <option value="OPERATOR">Operator (쓰기 가능)</option>
                                    <option value="ADMIN">Admin (전체 권한)</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                            >
                                생성
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                사용자
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                권한
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                등록일 / 마지막 로그인
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                    {currentUser?.id === user.id && (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            나
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={currentUser?.role !== 'ADMIN' || user.id === currentUser?.id}
                                        className={`text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${user.role === 'ADMIN' ? 'text-purple-600 font-bold' :
                                            user.role === 'OPERATOR' ? 'text-blue-600' : 'text-gray-600'
                                            }`}
                                    >
                                        <option value="VIEWER">VIEWER</option>
                                        <option value="OPERATOR">OPERATOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>등록: {new Date(user.createdAt).toLocaleDateString()}</div>
                                    {user.lastLoginAt && (
                                        <div className="text-xs text-gray-400">
                                            접속: {new Date(user.lastLoginAt).toLocaleString()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {currentUser?.role === 'ADMIN' && user.id !== currentUser?.id && (
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
