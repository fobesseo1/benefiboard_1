// app/actions/mainPageActions.ts

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
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
  console.log('Fetching best reposts');
  const supabase = await createSupabaseServerClient();
  const cacheKey = getCacheKey('bestReposts');

  const { data: cachedData } = await supabase
    .from('cache')
    .select('data, created_at')
    .eq('key', cacheKey)
    .single();

  if (cachedData) {
    console.log('Found cached data');
    const cacheAge = dayjs().diff(dayjs(cachedData.created_at), 'second');
    if (cacheAge < 3600) {
      console.log('Using cached data');
      return JSON.parse(cachedData.data);
    }
  }

  console.log('Fetching latest batch');
  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_best_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  if (latestBatches.length === 0) {
    console.log('No latest batches found');
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  const batch = latestBatches[0].batch;
  console.log('Fetching posts for batch:', batch);

  const { data: posts, error: postsError } = await supabase
    .from('repost_best_data')
    .select('id, title,  created_at, site, order, link, batch')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  console.log('Fetched posts:', posts?.length);

  if (posts && posts.length > 0) {
    await supabase.from('cache').upsert(
      {
        key: cacheKey,
        data: JSON.stringify(posts),
        created_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
  } else {
    console.log('No posts found');
  }

  return posts || [];
});

export const fetchBasicReposts = cache(async (): Promise<RepostType[]> => {
  const supabase = await createSupabaseServerClient();
  const cacheKey = getCacheKey('basicReposts');

  const { data: cachedData } = await supabase
    .from('cache')
    .select('data, created_at')
    .eq('key', cacheKey)
    .single();

  if (cachedData) {
    const cacheAge = dayjs().diff(dayjs(cachedData.created_at), 'second');
    if (cacheAge < 900) {
      // 15분 캐시
      return JSON.parse(cachedData.data);
    }
  }

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  if (latestBatches.length === 0) {
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  const batch = latestBatches[0].batch;

  const { data: posts, error: postsError } = await supabase
    .from('repost_data')
    .select('id, title, created_at, site, order, link, batch')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return cachedData ? JSON.parse(cachedData.data) : [];
  }

  await supabase.from('cache').upsert(
    {
      key: cacheKey,
      data: JSON.stringify(posts),
      created_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );

  return posts;
});

export async function refreshReposts(type: 'best' | 'basic'): Promise<RepostType[]> {
  const fetchFunction = type === 'best' ? fetchBestReposts : fetchBasicReposts;
  return await fetchFunction();
}
