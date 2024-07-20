// app/post/search/utils.ts
import createSupabaseServerClient from '@/lib/supabse/server';
import { PostType } from '../../../types/types';

export type SearchPostsType = (
  query: string,
  page?: number,
  limit?: number
) => Promise<{ posts: PostType[]; totalCount: number }>;

export const searchPosts: SearchPostsType = async (query, page = 1, limit = 20) => {
  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from('post')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error searching posts:', error);
    return { posts: [], totalCount: 0 };
  }

  return { posts: data || [], totalCount: count || 0 };
};
