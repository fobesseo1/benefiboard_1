// app/repost/best/utils.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { RepostType } from '@/types/types';

export async function fetchLatestBestBatches(
  page: number = 1,
  limit: number = 20
): Promise<{ success: boolean; data: RepostType[] | null; error?: any; totalCount: number }> {
  const supabase = await createSupabaseServerClient();
  const offset = (page - 1) * limit;

  try {
    // 총 게시물 수 조회
    const { count, error: countError } = await supabase
      .from('repost_best_data')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 페이지네이션된 데이터 조회
    const { data: posts, error: postsError } = await supabase
      .from('repost_best_data')
      .select('*')
      .order('batch', { ascending: false })
      .order('order', { ascending: true })
      .range(offset, offset + limit - 1);

    if (postsError) throw postsError;

    return {
      success: true,
      data: posts,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('Error fetching latest best batches:', error);
    return { success: false, data: null, error, totalCount: 0 };
  }
}
