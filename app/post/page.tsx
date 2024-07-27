// app/post/page.tsx
import { Suspense } from 'react';
import PagedPosts from './_component/PagedPosts';
import PagedPostsSkeleton from './_component/PagedPostsSkeleton';
import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from './_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import FixedIconGroup from './_component/FixedIconGroup';
import { findCategoryNameById } from './_action/category';
import { CurrentUserType, PostType } from '@/types/types';
import Ad_Rectangle_Updown from '../_components/Ad-Rectangle_Updown';

const CACHE_DURATION = 1 * 60 * 1000; // 1분 캐시

const fetchInitialPosts = cache(
  async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: PostType[]; totalCount: number }> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: postsData,
      error,
      count,
    } = await supabase
      .from('post')
      .select(
        'id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, parent_category_id, child_category_id, likes, dislikes',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], totalCount: 0 };
    }

    const initialPosts = await Promise.all(
      postsData.map(
        async (post): Promise<PostType> => ({
          ...post,
          parent_category_name: await findCategoryNameById(post.parent_category_id),
          child_category_name: await findCategoryNameById(post.child_category_id),
        })
      )
    );

    return { posts: initialPosts, totalCount: count || 0 };
  }
);

export default function PostPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="pt-2">
      <div className="lg:w-[948px] mx-auto">
        <Ad_Rectangle_Updown />
      </div>
      <h2 className="text-xl text-center font-bold my-4 mx-auto">전체 포스트</h2>
      <Suspense fallback={<div>검색창 로딩 중...</div>}>
        <SearchBarWrapper page={page} />
      </Suspense>
      <div className="flex flex-col px-4 pt-4">
        <Suspense fallback={<PagedPostsSkeleton />}>
          <PostsContent page={page} />
        </Suspense>
      </div>
      <FixedIconGroup />
    </div>
  );
}

// 새로운 컴포넌트: SearchBarWrapper
async function SearchBarWrapper({ page }: { page: number }) {
  const { posts: initialPosts } = await fetchInitialPosts(page);
  const searchSuggestions = Array.from(new Set(initialPosts.map((post) => post.title)));
  return <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />;
}

// 새로운 컴포넌트: PostsContent
async function PostsContent({ page }: { page: number }) {
  const { posts: initialPosts, totalCount } = await fetchInitialPosts(page);
  const currentUser = await getCurrentUser();

  return (
    <PagedPosts
      initialPosts={initialPosts}
      userId={currentUser?.id ?? null}
      currentUser={currentUser}
      totalCount={totalCount}
      currentPage={page}
    />
  );
}
