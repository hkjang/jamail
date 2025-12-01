import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
    // Get the Accept-Language header
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';

    // Detect if Korean is preferred
    const preferredLocale = acceptLanguage.toLowerCase().includes('ko') ? 'ko' : 'en';

    // Redirect to the appropriate locale
    redirect(`/${preferredLocale}`);
}
