// lib/actions/view.ts

import createSupabaseServerClient from '@/lib/supabse/server';

export const incrementViewCount = async (postId: string, userId: string | null) => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('views').insert({ post_id: postId, user_id: userId });

  if (error) {
    console.error('Error incrementing view count:', error);
  }

  return data;
};

export const getViewCount = async (postId: string) => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('views')
    .select('id', { count: 'exact' })
    .eq('post_id', postId);

  if (error) {
    console.error('Error fetching view count:', error);
  }

  return data ? data.length : 0;
};
