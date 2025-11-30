'use client';

import { useForm } from 'react-hook-form';

export default function NotificationSettings() {
    const { register, handleSubmit } = useForm();

    const onSaveNotifications = (data: any) => {
        console.log('Notification Settings:', data);
        alert('알림 설정이 저장되었습니다!');
    };

    return (
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
    );
}
