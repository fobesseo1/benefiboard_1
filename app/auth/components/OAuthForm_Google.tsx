'use client';

import { createBrowserClient } from '@supabase/ssr';
import React from 'react';
import { redirect } from 'next/navigation';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function GoogleButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={loginWithGoogle} className="w-full flex gap-2">
      <FaGoogle size="1.6rem" fill="#eee" />
      Google with SignIn
    </Button>
  );
}
