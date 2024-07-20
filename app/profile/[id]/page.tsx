//app>profile>[id]>page.tsx

import { Suspense } from 'react';
import { getcurrentUserBrowserFromCookie } from '@/lib/cookiesBrowser';
import { fetchProfileById } from '../_actions/profile';
import ProfileForm from '../_components/ProfileForm';

export default async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  const profile = await fetchProfileById(id);
  const currentUser = await getcurrentUserBrowserFromCookie();
  const isEditable = profile.id === currentUser?.id;

  console.log('profile', profile);

  return (
    <div className="mt-8 mx-auto px-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {profile.username || profile.email || 'unknown'}
        <span className="text-base text-gray-600"> 님의 프로필</span>
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileForm profile={profile} isEditable={isEditable} />
      </Suspense>
    </div>
  );
}
