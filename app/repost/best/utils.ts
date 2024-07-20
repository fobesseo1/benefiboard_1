import createSupabaseServerClient from '@/lib/supabse/server';
import { RepostType } from '@/types/types';

export async function fetchLatestBestBatches(
  limit = 3
): Promise<{ success: boolean; data: RepostType[] | null; error?: any }> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: latestBatches, error: batchError } = await supabase
      .from('repost_best_data')
      .select('batch')
      .order('batch', { ascending: false })
      .limit(limit);

    if (batchError) throw batchError;

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

    if (postsError) throw postsError;

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching latest best batches:', error);
    return { success: false, data: null, error };
  }
}
