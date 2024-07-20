//app>auth>page.tsx

import React from 'react';
import { AuthForm } from './components/AuthForm';
import SignOut from './components/SignOut';
import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from '@/types/types';

export default async function page() {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  /* if (currentUser) {
    revalidatePath('/post');
    redirect('/post');
  } */
  return (
    <div className="flex justify-center mt-16 lg:w-[474px] mx-auto">
      <div className="w-full mx-6 flex flex-col items-center gap-16">
        <img src="/logo-benefiboard.svg" alt="" />
        <AuthForm />
        <SignOut />
      </div>
    </div>
  );
}
