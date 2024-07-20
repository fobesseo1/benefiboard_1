//app/_components/AuthManager.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabse/client';

export default function AuthManager() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000); // convert to milliseconds
        const now = new Date();
        const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 3600 * 24);

        // 만료 7일 전에 경고
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          const lastWarningDate = localStorage.getItem('lastSessionWarning');
          const today = new Date().toDateString();

          if (lastWarningDate !== today) {
            setShowWarning(true);
            localStorage.setItem('lastSessionWarning', today);
          }
        }
      }
    };

    // 하루에 한 번 세션 체크
    const checkInterval = 24 * 60 * 60 * 1000; // 24 hours
    const interval = setInterval(checkSession, checkInterval);
    checkSession(); // 초기 체크

    return () => clearInterval(interval);
  }, [supabase]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
        router.push('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleRefreshSession = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      alert('세션 갱신에 실패했습니다. 다시 로그인해 주세요.');
      router.push('/auth');
    } else {
      setShowWarning(false);
      localStorage.removeItem('lastSessionWarning');
    }
  };

  if (showWarning) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">알림:</strong>
        <span className="block sm:inline"> 세션이 7일 이내에 만료됩니다. </span>
        <button onClick={handleRefreshSession} className="underline">
          지금 세션 갱신하기
        </button>
      </div>
    );
  }

  return null;
}
