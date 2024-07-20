'use server';

import { getCurrentUser } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import { CurrentUserType } from '@/types/types';

export async function recordPostRead(postId: string, ipAddress: string) {
  const supabase = await createSupabaseServerClient();
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const userId = currentUser ? currentUser.id : null;

  const { error } = await supabase
    .from('read_posts')
    .insert([{ user_id: userId, post_id: postId, ip_address: ipAddress }]);

  if (error) {
    console.error('Error recording post read:', error);
  }
}
