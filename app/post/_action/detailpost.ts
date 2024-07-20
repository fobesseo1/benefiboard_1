/* 'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export async function fetchPostById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('post').select('*').eq('id', id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
 */
