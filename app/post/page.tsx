// app/post/page.tsx
import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from './_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import FixedIconGroup from './_component/FixedIconGroup';
import { findCategoryNameById } from './_action/category';
import PagedPosts from './_component/PagedPosts';
import { CurrentUserType, PostType } from '@/types/types';

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

export default async function PostPage({ searchParams }: { searchParams: { page: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { posts: initialPosts, totalCount } = await fetchInitialPosts(page);
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const searchSuggestions = Array.from(new Set(initialPosts.map((post) => post.title)));

  return (
    <div className="pt-4">
      <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />
      <div className="flex flex-col px-4 pt-4 ">
        <PagedPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
          totalCount={totalCount}
          currentPage={page}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
