//lib>>utils>cookies.ts

import { getCurrentUser } from './actions/auth';
import { CurrentUserType } from '@/types/types';

export { getCurrentUser };

export async function getCurrentUserInfo(): Promise<Partial<CurrentUserType> | null> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id ?? '',
    username: currentUser.username ?? '',
    email: currentUser.email ?? '',
    avatar_url: currentUser.avatar_url ?? '',
    current_points: currentUser.current_points ?? 0,
    donation_id: currentUser.donation_id ?? '',
    partner_name: currentUser.partner_name ?? '',
  };
}
