import Link from 'next/link';
import NoticeList from '@/components/dashboard/NoticeList';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {locale === 'ko' ? '이메일 템플릿 관리 시스템' : 'Email Template Management System'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {locale === 'ko'
            ? '강력하고 유연한 이메일 템플릿 솔루션'
            : 'Powerful and flexible email template solution'}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href={`/${locale}/templates`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            {locale === 'ko' ? '템플릿 보기' : 'View Templates'}
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <NoticeList />
      </div>
    </div>
  );
}
