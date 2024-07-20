//lib>cookies.ts

'use server';

import { cache } from 'react';
import createSupabaseServerClient from './supabse/server';
import { CurrentUserType } from '@/types/types';

export const getCurrentUser = cache(async (): Promise<CurrentUserType | null> => {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('No authenticated user');
      return null;
    }

    const { data: userData, error: dataError } = await supabase
      .from('userdata')
      .select(
        'id, username, email, avatar_url, current_points, donation_id, partner_name, unread_messages_count'
      )
      .eq('id', user.id)
      .single();

    if (dataError || !userData) {
      console.log('User data not found in database');
      return null;
    }

    return userData as CurrentUserType;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
});

export async function getCurrentUserInfo() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id ?? '',
    username: currentUser.username ?? '',
    email: currentUser.email ?? '',
    avatar_url: currentUser.avatar_url ?? '',
    point: currentUser.current_points ?? 0,
    current_points: currentUser.current_points ?? 0,
    donation_id: currentUser.donation_id ?? '',
    partner_name: currentUser.partner_name ?? '',
  };
}
