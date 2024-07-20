// app/repost/page.tsx

import { cache } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '../post/_component/SearchBar';
import { fetchLatestBatches } from './_actions/fetchRepostData';
import { CurrentUserType } from '@/types/types';
import Repost_list from './_component/repost_list';

const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3시간 캐시

const fetchCachedRepostData = cache(async () => {
  const { success, data: repostData, error } = await fetchLatestBatches();
  if (!success || !repostData) {
    console.error('Failed to fetch data:', error);
    return null;
  }
  return repostData;
});

export default async function RepostPage() {
  const repostData = await fetchCachedRepostData();

  if (!repostData) {
    return <div>데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  if (repostData.length === 0) {
    return <div>현재 사용 가능한 게시물이 없습니다.</div>;
  }

  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(repostData.map((post) => post.title)));

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[948px] mx-auto">
        <h1 className="text-2xl font-semibold mt-4 mb-8 text-center">
          인기 커뮤니티 실시간 베스트
        </h1>
        <SearchBar searchUrl="/repost/search" suggestions={searchSuggestions} />
        <Repost_list
          initialPosts={repostData}
          currentUser={currentUser ?? null}
          isBestPosts={false}
        />
      </div>
    </div>
  );
}
