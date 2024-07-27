//app>auth>page.tsx

import React from 'react';
import Image from 'next/image';
import { AuthForm } from './components/AuthForm';
import SignOut from './components/SignOut';
import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from '@/types/types';

export default async function page() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  return (
    <div className="flex justify-center mt-16 lg:w-[474px] mx-auto">
      <div className="w-full mx-6 flex flex-col items-center gap-16">
        <img src="/logo-benefiboard.svg" alt="logo" />
        <AuthForm />
        <SignOut />
      </div>
    </div>
  );
}
