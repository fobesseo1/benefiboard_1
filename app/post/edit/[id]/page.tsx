import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/cookies';
import EditForm from '../../_component/EditForm';
import { CurrentUserType } from '@/types/types';

export default async function PostEditPage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  if (!currentUser) {
    console.log('nonono');
    return redirect('post');
  }

  return (
    <div>
      <EditForm
        user_id={currentUser.id}
        user_name={currentUser.username || ''}
        user_avatar_url={currentUser.avatar_url || ''}
      />
    </div>
  );
}
