// app/post/_action/fetchTopPosts.ts
import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { findCategoryNameById } from './category';
import { PostType } from '@/types/types';

dayjs.extend(utc);
dayjs.extend(timezone);

const CACHE_DURATION = 3 * 60 * 1000; // 3분 캐시

export const fetchTopPosts = cache(
  async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: PostType[]; totalCount: number }> => {
    const supabase = await createSupabaseServerClient();

    const now = dayjs().tz('Asia/Seoul');
    const sevenDaysAgo = now.subtract(28, 'day').tz('Asia/Seoul').format();

    const { data, error, count } = await supabase
      .from('post')
      .select(
        'id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, parent_category_id, child_category_id, likes, dislikes',
        { count: 'exact' }
      )
      .gt('created_at', sevenDaysAgo)
      .order('views', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching top posts:', error);
      return { posts: [], totalCount: 0 };
    }

    const postsWithCategoryNames = await Promise.all(
      data.map(
        async (post): Promise<PostType> => ({
          ...post,
          parent_category_name: await findCategoryNameById(post.parent_category_id),
          child_category_name: await findCategoryNameById(post.child_category_id),
        })
      )
    );

    return { posts: postsWithCategoryNames, totalCount: count || 0 };
  }
);

export const fetchCachedTopPosts = cache(
  async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: PostType[]; totalCount: number }> => {
    return await fetchTopPosts(page, limit);
  }
);
