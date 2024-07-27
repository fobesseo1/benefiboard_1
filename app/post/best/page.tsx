// app/post/best/page.tsx
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchCachedTopPosts } from '../_action/fetchTopPosts';
import SearchBar from '../_component/SearchBar';
import PagedPosts from '../_component/PagedPosts_Router';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '@/types/types';
import Ad_Rectangle_Updown from '@/app/_components/Ad-Rectangle_Updown';
import PagedPostsSkeleton from '../_component/PagedPostsSkeleton';

// 이 시간 동안 페이지를 재검증하지 않습니다.
export const revalidate = 180; // 3분

async function SearchBarWrapper({ page }: { page: number }) {
  const { posts: topPosts } = await fetchCachedTopPosts(page);
  const searchSuggestions = Array.from(new Set(topPosts.map((post) => post.title)));
  return <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />;
}

async function TopPostsContent({ page }: { page: number }) {
  const { posts: topPosts, totalCount } = await fetchCachedTopPosts(page);
  const currentUser: CurrentUserType | null = await getCurrentUser();

  return (
    <PagedPosts
      initialPosts={topPosts}
      userId={currentUser?.id ?? null}
      currentUser={currentUser}
      totalCount={totalCount}
      currentPage={page}
      isBestPosts={true}
    />
  );
}

export default function PostBestPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="pt-2">
      <div className="lg:w-[948px] mx-auto">
        <Ad_Rectangle_Updown />
      </div>
      <h2 className="text-xl text-center font-bold my-4 mx-auto">이번주 인기 포스트</h2>
      <Suspense fallback={<div>검색창 로딩 중...</div>}>
        <SearchBarWrapper page={page} />
      </Suspense>
      <div className="flex flex-col px-4 pt-4">
        <Suspense fallback={<PagedPostsSkeleton />}>
          <TopPostsContent page={page} />
        </Suspense>
      </div>
      <FixedIconGroup />
    </div>
  );
}
