// app/repost/best/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import Repost_list from '../_component/repost_list';
import { fetchLatestBestBatches } from './utils';
import Ad_Rectangle_Updown from '@/app/_components/Ad-Rectangle_Updown';
import Repost_list_Skeleton from '../_component/Repost_list_Skeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 60 minutes cache

async function RepostBestContent({ page }: { page: number }) {
  const limit = 20;
  const { data: repostData, totalCount } = await fetchLatestBestBatches(page, limit);
  const currentUser = await getCurrentUser();

  if (!repostData) {
    return <div>데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  if (repostData.length === 0) {
    return <div>현재 사용 가능한 게시물이 없습니다.</div>;
  }

  const searchSuggestions = Array.from(new Set(repostData.map((post) => post.title)));

  return (
    <>
      <SearchBar searchUrl="/repost/search/best" suggestions={searchSuggestions} />
      <div className="px-6">
        <Repost_list
          initialPosts={repostData}
          currentUser={currentUser}
          isBestPosts={true}
          totalCount={totalCount}
          currentPage={page}
        />
      </div>
    </>
  );
}

export default function RepostBestPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="flex flex-col pt-2 lg:w-[948px] mx-auto">
      <Ad_Rectangle_Updown />
      <div className="flex flex-col text-center font-bold my-4 mx-auto">
        <h2 className="text-xl">오늘의 베스트 포스트</h2>
        <p className="text-sm text-gray-400">(주요 커뮤니티)</p>
      </div>
      <Suspense fallback={<Repost_list_Skeleton />}>
        <RepostBestContent page={page} />
      </Suspense>
    </div>
  );
}
