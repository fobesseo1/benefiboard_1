// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from '@/lib/cookies';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from './_components/LoadingSpinner';
import { CurrentUserType } from '@/types/types';
import { cache } from 'react';

const Header = dynamic(() => import('./_components/Header'), { ssr: true });
const Footer = dynamic(() => import('./_components/Footer'), { ssr: true });
const AuthManager = dynamic(() => import('./_components/AuthManager'), { ssr: false });

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
});
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
});

export const cls = (...classnames: string[]) => {
  return classnames.join(' ');
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Benefiboard',
  description: 'Your benefiboard application description',
  icons: {
    icon: '/logo-square.svg',
  },
};

const getCurrentUserCached = cache(async () => {
  return await getCurrentUser();
});

function UserAwareLayout({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: CurrentUserType | null;
}) {
  return (
    <>
      {/* <Header currentUser={currentUser} />
      <AuthManager /> */}
      <main className="flex-1 tracking-tight text-gray-800 leading-tight lg:pt-32 pt-16 pb-16 lg:pb-4">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
      {/* <Footer currentUser={currentUser} /> */}
    </>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser: CurrentUserType | null = await getCurrentUserCached();

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/logo-benefiboard.svg" />
      </head>
      <body
        className={`${notoSansKR.className} ${inter.className} ${poppins.className} flex flex-col min-h-screen`}
      >
        <UserAwareLayout currentUser={currentUser}>{children}</UserAwareLayout>
      </body>
    </html>
  );
}
