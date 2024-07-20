// app/repost/best/utils.ts

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';

export const fetchLatestBestBatches = cache(async (limit = 3) => {
  const supabase = await createSupabaseServerClient();

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_best_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(limit);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return { success: false, error: batchError };
  }

  if (latestBatches.length === 0) {
    return { success: true, data: [] };
  }

  const batches = latestBatches.map((batch) => batch.batch);

  const { data: posts, error: postsError } = await supabase
    .from('repost_best_data')
    .select('*')
    .in('batch', batches)
    .order('batch', { ascending: false })
    .order('order', { ascending: true });

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return { success: false, error: postsError };
  }

  return { success: true, data: posts };
});
