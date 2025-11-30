'use client';

export default function UserSettings() {
    const onAddUser = () => {
        const email = prompt('새 사용자 이메일 주소를 입력하세요:');
        if (email) {
            alert(`사용자 ${email}이(가) 추가되었습니다!`);
        }
    };

    return (
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
    );
}
