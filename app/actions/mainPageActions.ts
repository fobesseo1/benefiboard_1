// app/actions/mainPageActions.ts

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { fetchTop10Batches, fetchTop10BestBatches } from '../repost/_actions/fetchRepostData';
import { PostType, RepostType } from '@/types/types';
import { findCategoryNameById } from '../post/_action/category';

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchPosts = cache(async (): Promise<PostType[]> => {
  const supabase = await createSupabaseServerClient();
  const nowDate = dayjs().tz('Asia/Seoul');
  const twentyOneDaysAgo = nowDate.subtract(21, 'day').format();

  const { data: result, error } = await supabase
    .from('post')
    .select('*')
    .gt('created_at', twentyOneDaysAgo)
    .order('views', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return result.map(
    (post): PostType => ({
      ...post,
      parent_category_name: findCategoryNameById(post.parent_category_id),
      child_category_name: findCategoryNameById(post.child_category_id),
    })
  );
});

export const fetchBestReposts = cache(async (): Promise<RepostType[]> => {
  const { success, data } = await fetchTop10BestBatches();
  if (success && data) {
    return data;
  }
  console.error('Error fetching best reposts');
  return [];
});

export const fetchBasicReposts = cache(async (): Promise<RepostType[]> => {
  const { success, data } = await fetchTop10Batches();
  if (success && data) {
    return data;
  }
  console.error('Error fetching basic reposts');
  return [];
});
