'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BackButtonHandler() {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      router.replace('/post');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return null;
}
