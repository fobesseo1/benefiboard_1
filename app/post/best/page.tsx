// app/post/best/page.tsx
import { cache } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchCachedTopPosts, fetchTopPosts } from '../_action/fetchTopPosts';
import SearchBar from '../_component/SearchBar';
import PagedPosts from '../_component/PagedPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '@/types/types';

const CACHE_DURATION = 3 * 60 * 1000; // 3분 캐시

export default async function PostBestPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { posts: topPosts, totalCount } = await fetchCachedTopPosts(page);
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(topPosts.map((post) => post.title)));

  return (
    <div className="pt-4">
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
      <FixedIconGroup />
    </div>
  );
}
