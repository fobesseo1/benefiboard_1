'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export async function batchLogReadPosts(readPosts: any[]) {
  console.log('batchLogReadPosts', readPosts);
  const supabase = await createSupabaseServerClient();

  const formattedReadPosts = readPosts.map((post) => ({
    user_id: post.userId,
    post_id: post.postId,
    ip_address: post.ipAddress,
    timestamp: post.timestamp, // assuming this field exists in your table schema
  }));

  const { data, error } = await supabase.from('read_posts').insert(formattedReadPosts);

  if (error) {
    console.error('Error logging read posts:', error);
  }
}
