// app/repost/best/page.tsx

import { cache } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import Repost_list from '../_component/repost_list';
import { CurrentUserType } from '@/types/types';
import { fetchLatestBestBatches } from '../_actions/fetchRepostData';

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12시간 캐시

const fetchCachedBestRepostData = cache(async () => {
  const { success, data: repostData, error } = await fetchLatestBestBatches();
  if (!success || !repostData) {
    console.error('Failed to fetch data:', error);
    return null;
  }
  return repostData;
});

export default async function RepostBestPage() {
  const repostData = await fetchCachedBestRepostData();

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
