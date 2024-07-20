//app/datafetch/page.tsx

import { getCurrentUser } from '@/lib/cookies';
import { redirect } from 'next/navigation';
import DataFetchClient from './DataFetchClient';

export default async function DataFetchPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.id !== '5f8ea3c2-051a-4478-91c0-79df6e7576bc') {
    redirect('/');
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <DataFetchClient />
    </div>
  );
}
