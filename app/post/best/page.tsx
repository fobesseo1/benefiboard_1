// app/post/best/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchCachedTopPosts } from '../_action/fetchTopPosts';
import SearchBar from '../_component/SearchBar';
import PagedPosts from '../_component/PagedPosts_Router';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '@/types/types';

// 이 시간 동안 페이지를 재검증하지 않습니다.
export const revalidate = 180; // 3분

async function TopPostsContent({ page }: { page: number }) {
  const { posts: topPosts, totalCount } = await fetchCachedTopPosts(page);
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(topPosts.map((post) => post.title)));

  return (
    <>
      <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />
      <div className="flex flex-col px-4 pt-4">
        <h2 className="text-xl font-bold my-4 mx-auto">이번주 인기 게시물</h2>
        <PagedPosts
          initialPosts={topPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
          totalCount={totalCount}
          currentPage={page}
          isBestPosts={true}
        />
      </div>
    </>
  );
}

export default function PostBestPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="pt-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TopPostsContent page={page} />
      </Suspense>
      <FixedIconGroup />
    </div>
  );
}
