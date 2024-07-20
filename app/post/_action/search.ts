'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export async function searchPosts(searchTerm: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('post')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
