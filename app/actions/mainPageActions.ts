// app/actions/mainPageActions.ts

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { fetchTop10Batches, fetchTop10BestBatches } from '../repost/_actions/fetchRepostData';
import { findCategoryNameById } from '../post/_action/category';
import { PostType, RepostType } from '@/types/types';

dayjs.extend(utc);
dayjs.extend(timezone);

// 캐시를 위한 변수들
let cachedPosts: PostType[] | null = null;
let lastPostsFetch: number = 0;
let cachedBasicReposts: RepostType[] | null = null;
let lastBasicRepostsFetch: number = 0;
let cachedBestReposts: RepostType[] | null = null;
let lastBestRepostsFetch: number = 0;

const CACHE_DURATION = 30 * 1000; // 30초

export const fetchPosts = cache(async (): Promise<PostType[]> => {
  const now = Date.now();
  if (cachedPosts && now - lastPostsFetch < CACHE_DURATION) {
    return cachedPosts;
  }

  const supabase = await createSupabaseServerClient();
  const nowDate = dayjs().tz('Asia/Seoul');
  const sevenDayAgo = nowDate.subtract(21, 'day').format();

  const { data: result, error } = await supabase
    .from('post')
    .select('*')
    .gt('created_at', sevenDayAgo)
    .order('views', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching posts:', error);
    return cachedPosts || []; // 에러 시 캐시된 데이터 반환 또는 빈 배열
  }

  const postsData = result || [];

  const postsWithCategoryNames: PostType[] = await Promise.all(
    postsData.map(async (post): Promise<PostType> => {
      const parentCategoryName = await findCategoryNameById(post.parent_category_id);
      const childCategoryName = await findCategoryNameById(post.child_category_id);

      return {
        ...post,
        parent_category_name: parentCategoryName,
        child_category_name: childCategoryName,
      } as PostType;
    })
  );

  cachedPosts = postsWithCategoryNames;
  lastPostsFetch = now;

  return postsWithCategoryNames;
});

export const fetchBestReposts = cache(async (): Promise<RepostType[]> => {
  const now = Date.now();
  if (cachedBestReposts && now - lastBestRepostsFetch < 12 * 60 * 60 * 1000) {
    // 12시간 캐시
    return cachedBestReposts;
  }

  const { success, data } = await fetchTop10BestBatches();
  if (success && data) {
    cachedBestReposts = data;
    lastBestRepostsFetch = now;
    return data;
  }

  console.error('Error fetching best reposts');
  return [];
});

export const fetchBasicReposts = cache(async (): Promise<RepostType[]> => {
  const now = Date.now();
  if (cachedBasicReposts && now - lastBasicRepostsFetch < 2 * 60 * 60 * 1000) {
    // 2시간 캐시
    return cachedBasicReposts;
  }

  const { success, data } = await fetchTop10Batches();
  if (success && data) {
    cachedBasicReposts = data;
    lastBasicRepostsFetch = now;
    return data;
  }

  console.error('Error fetching basic reposts');
  return [];
});
