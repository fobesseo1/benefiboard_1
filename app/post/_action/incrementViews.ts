'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export async function incrementViews(postId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('post').select('views').eq('id', postId).single();

  if (error) {
    throw new Error('Failed to fetch post views');
  }

  const newViews = (data.views || 0) + 1;

  const { error: updateError } = await supabase
    .from('post')
    .update({ views: newViews })
    .eq('id', postId);

  if (updateError) {
    throw new Error('Failed to update post views');
  }

  return newViews;
}
