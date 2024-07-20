// app/repost/best/page.tsx

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import Repost_list from '../_component/repost_list';
import { CurrentUserType } from '@/types/types';

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12시간 캐시

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

export default async function RepostBestPage() {
  const { success, data: repostData, error } = await fetchLatestBestBatches();

  if (!success || !repostData) {
    console.error('Failed to fetch data:', error);
    return <div>Loading...</div>;
  }

  if (repostData.length === 0) {
    return <div>No posts available</div>;
  }

  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(repostData.map((post) => post.title)));

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[948px] mx-auto">
        <h1 className="text-2xl font-semibold mt-4 mb-8 text-center">
          인기 커뮤니티 오늘의 베스트
        </h1>
        <SearchBar searchUrl="/repost/search/best" suggestions={searchSuggestions} />
        <Repost_list
          initialPosts={repostData}
          currentUser={currentUser ?? null}
          isBestPosts={true}
        />
      </div>
    </div>
  );
}
