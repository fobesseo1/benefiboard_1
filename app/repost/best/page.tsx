// app/repost/best/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import Repost_list from '../_component/repost_list';
import { CurrentUserType } from '@/types/types';
import { fetchLatestBestBatches } from './utils';
import Loading from '@/app/loading';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function RepostBestContent({ page }: { page: number }) {
  const limit = 20;
  const { data: repostData, totalCount } = await fetchLatestBestBatches(page, limit);

  if (!repostData) {
    return <div>데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  if (repostData.length === 0) {
    return <div>현재 사용 가능한 게시물이 없습니다.</div>;
  }

  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(repostData.map((post) => post.title)));

  return (
    <>
      <SearchBar searchUrl="/repost/search/best" suggestions={searchSuggestions} />
      <Repost_list
        initialPosts={repostData}
        currentUser={currentUser ?? null}
        isBestPosts={true}
        totalCount={totalCount}
      />
    </>
  );
}

export default function RepostBestPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[948px] mx-auto">
        <h1 className="text-2xl font-semibold mt-4 mb-8 text-center">
          인기 커뮤니티 오늘의 베스트
        </h1>
        <Suspense fallback={<Loading />}>
          <RepostBestContent page={page} />
        </Suspense>
      </div>
    </div>
  );
}
