// app/actions/mainPageActions.ts

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { fetchTop10Batches, fetchTop10BestBatches } from '../repost/_actions/fetchRepostData';
import { PostType, RepostType } from '@/types/types';

dayjs.extend(utc);
dayjs.extend(timezone);

const REPOST_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2시간
const POST_CACHE_DURATION = 5 * 60 * 1000; // 5분

let cachedBestReposts: RepostType[] | null = null;
let lastBestRepostsFetch: number = 0;
let cachedBasicReposts: RepostType[] | null = null;
let lastBasicRepostsFetch: number = 0;

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

  // 카테고리 이름을 별도로 가져옵니다.
  const categoryIds = new Set(
    [
      ...result.map((post) => post.parent_category_id),
      ...result.map((post) => post.child_category_id),
    ].filter((id) => id != null)
  );

  const { data: categories, error: categoryError } = await supabase
    .from('categories') // 실제 카테고리 테이블 이름으로 변경해주세요
    .select('id, name')
    .in('id', Array.from(categoryIds));

  if (categoryError) {
    console.error('Error fetching categories:', categoryError);
    return [];
  }

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  return result.map(
    (post): PostType => ({
      ...post,
      parent_category_name: categoryMap.get(post.parent_category_id) || '',
      child_category_name: categoryMap.get(post.child_category_id) || '',
    })
  );
});

export const fetchBestReposts = cache(async (): Promise<RepostType[]> => {
  const now = Date.now();
  if (cachedBestReposts && now - lastBestRepostsFetch < REPOST_CACHE_DURATION) {
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
  if (cachedBasicReposts && now - lastBasicRepostsFetch < REPOST_CACHE_DURATION) {
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
