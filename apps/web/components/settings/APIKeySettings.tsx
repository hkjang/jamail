'use client';

export default function APIKeySettings() {
    const onGenerateAPIKey = () => {
        const newKey = 'sk_' + Math.random().toString(36).substring(2, 15);
        alert(`새 API 키가 생성되었습니다:\n\n${newKey}\n\n이 키는 다시 표시되지 않으니 안전한 곳에 보관하세요.`);
    };

    return (
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
    );
}
