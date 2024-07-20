'use client';

import { useEffect, useState } from 'react';
import Ad_Handler from '@/app/_components/Ad_Handler';

interface AdIntermediatePageProps {
  currentUser: any;
  postId: string;
  authorId: string;
  pagePath: string;
  targetLink: string;
}

export default function AdIntermediatePage({
  currentUser,
  postId,
  authorId,
  pagePath,
  targetLink,
}: AdIntermediatePageProps) {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 5000); // 5초 후 리다이렉트

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (redirect) {
      window.location.href = targetLink;
    }
  }, [redirect, targetLink]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">광고를 보는 동안 잠시만 기다려주세요</h2>
      <p className="mb-4">5초 후 자동으로 이동합니다...</p>
      <Ad_Handler
        currentUser={currentUser}
        postId={postId}
        authorId={authorId}
        pagePath={pagePath}
      />
    </div>
  );
}
