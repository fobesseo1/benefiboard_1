// app/actions/mainPageActions.ts

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import { PostType, RepostType } from '@/types/types';
import { findCategoryNameById } from '../post/_action/category';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function getNextUpdateTime(interval: number) {
  const now = dayjs().tz('Asia/Seoul');
  const hour = now.hour();
  const nextUpdateHour = Math.ceil(hour / interval) * interval;
  return now.hour(nextUpdateHour).minute(10).second(0);
}

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
  const supabase = await createSupabaseServerClient();

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_best_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return [];
  }

  if (latestBatches.length === 0) {
    return [];
  }

  const batch = latestBatches[0].batch;

  const { data: posts, error: postsError } = await supabase
    .from('repost_best_data')
    .select('*')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return [];
  }

  return posts;
});

export const fetchBasicReposts = cache(async (): Promise<RepostType[]> => {
  const supabase = await createSupabaseServerClient();

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return [];
  }

  if (latestBatches.length === 0) {
    return [];
  }

  const batch = latestBatches[0].batch;

  const { data: posts, error: postsError } = await supabase
    .from('repost_data')
    .select('*')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return [];
  }

  return posts;
});

export const fetchCachedBestReposts = cache(async (): Promise<RepostType[]> => {
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem('bestReposts');
    const nextUpdateTime = localStorage.getItem('bestRepostsNextUpdate');
    if (cachedData && nextUpdateTime) {
      const now = dayjs().tz('Asia/Seoul');
      if (now.isBefore(dayjs(nextUpdateTime))) {
        return JSON.parse(cachedData);
      }
    }
  }
  const data = await fetchBestReposts();
  if (typeof window !== 'undefined') {
    localStorage.setItem('bestReposts', JSON.stringify(data));
    const nextUpdate = getNextUpdateTime(24).format(); // 24시간 간격
    localStorage.setItem('bestRepostsNextUpdate', nextUpdate);
  }
  return data;
});

export const fetchCachedBasicReposts = cache(async (): Promise<RepostType[]> => {
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem('basicReposts');
    const nextUpdateTime = localStorage.getItem('basicRepostsNextUpdate');
    if (cachedData && nextUpdateTime) {
      const now = dayjs().tz('Asia/Seoul');
      if (now.isBefore(dayjs(nextUpdateTime))) {
        return JSON.parse(cachedData);
      }
    }
  }
  const data = await fetchBasicReposts();
  if (typeof window !== 'undefined') {
    localStorage.setItem('basicReposts', JSON.stringify(data));
    const nextUpdate = getNextUpdateTime(3).format(); // 3시간 간격
    localStorage.setItem('basicRepostsNextUpdate', nextUpdate);
  }
  return data;
});
