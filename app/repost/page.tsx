// app/repost/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '../post/_component/SearchBar';
import { fetchLatestBatches } from './_actions/fetchRepostData';
import { CurrentUserType } from '@/types/types';
import Repost_list from './_component/repost_list';
import Loading from '../loading';
import Ad_Rectangle_Updown from '../_components/Ad-Rectangle_Updown';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function RepostContent({ page }: { page: number }) {
  const limit = 20;
  const { data: repostData, totalCount } = await fetchLatestBatches(page, limit);

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
      <SearchBar searchUrl="/repost/search" suggestions={searchSuggestions} />
      <div className="px-6">
        <Repost_list
          initialPosts={repostData}
          currentUser={currentUser ?? null}
          isBestPosts={false}
          totalCount={totalCount}
        />
      </div>
    </>
  );
}

export default function RepostPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="flex flex-col pt-2 lg:w-[948px] mx-auto">
      <Ad_Rectangle_Updown />
      <div className="flex flex-col text-center font-bold my-4 mx-auto">
        <h2 className="text-xl  ">실시간 인기 포스트</h2>
        <p className="text-sm text-gray-400">(주요 커뮤니티)</p>
      </div>
      <Suspense fallback={<Loading />}>
        <RepostContent page={page} />
      </Suspense>
    </div>
  );
}
