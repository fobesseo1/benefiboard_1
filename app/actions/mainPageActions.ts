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

function getCacheKey(prefix: string) {
  const now = dayjs().tz('Asia/Seoul');
  return `${prefix}_${now.format('YYYY-MM-DD_HH')}`;
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
  const cacheKey = getCacheKey('bestReposts');

  const { data: cachedData } = await supabase
    .from('cache')
    .select('data')
    .eq('key', cacheKey)
    .single();

  if (cachedData) {
    return JSON.parse(cachedData.data);
  }

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

  await supabase
    .from('cache')
    .upsert({ key: cacheKey, data: JSON.stringify(posts) }, { onConflict: 'key' });

  return posts;
});

export const fetchBasicReposts = cache(async (): Promise<RepostType[]> => {
  const supabase = await createSupabaseServerClient();
  const cacheKey = getCacheKey('basicReposts');

  const { data: cachedData } = await supabase
    .from('cache')
    .select('data')
    .eq('key', cacheKey)
    .single();

  if (cachedData) {
    return JSON.parse(cachedData.data);
  }

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

  await supabase
    .from('cache')
    .upsert({ key: cacheKey, data: JSON.stringify(posts) }, { onConflict: 'key' });

  return posts;
});

export async function refreshReposts(type: 'best' | 'basic'): Promise<RepostType[]> {
  const fetchFunction = type === 'best' ? fetchBestReposts : fetchBasicReposts;
  return await fetchFunction();
}
