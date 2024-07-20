'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export const getUserViewedPosts = async (userId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('views').select('post_id').eq('user_id', userId);

  if (error) {
    console.error('Error fetching viewed posts:', error);
    return [];
  }

  return data.map((view: { post_id: string }) => view.post_id);
};

export const getPostsData = async (limit: number = 10) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('post').select('*').limit(limit);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data.map((post: any) => ({
    ...post,
    created_at: post.created_at ? new Date(post.created_at).toISOString() : null,
  }));
};
