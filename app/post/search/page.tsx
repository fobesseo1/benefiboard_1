// app/post/search/page.tsx
import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from '../_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import PagedPosts from '../_component/PagedPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '../../../types/types';
import { getPostsData } from '../_action/postData';

export async function searchPosts(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<{ posts: PostType[]; totalCount: number }> {
  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from('post')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error searching posts:', error);
    return { posts: [], totalCount: 0 };
  }

  return { posts: data || [], totalCount: count || 0 };
}

export default async function PostSearchPage({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) {
  const query = searchParams.query || '';
  const page = parseInt(searchParams.page || '1', 10);
  const { posts: initialPosts, totalCount } = await searchPosts(query, page);

  const currentUser: CurrentUserType | null = await getCurrentUser();
  // 검색 제안을 위한 데이터 가져오기
  const posts = await getPostsData();
  const suggestions: PostType[] = Array.isArray(posts) ? posts : [];
  const titleSuggestions = Array.from(
    new Set(
      suggestions.map((post) => post.title).filter((title): title is string => title !== undefined)
    )
  );

  return (
    <div className="pt-4">
      <SearchBar initialQuery={query} searchUrl="/post/search" suggestions={titleSuggestions} />
      <div className="grid grid-cols-1 h-12 lg:w-[948px] mx-auto">
        <div className="bg-white border-b-[1px] border-gray-400 flex justify-center items-center ">
          <p className="font-bold text-center">Search Results</p>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-4 ">
        <PagedPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
          searchTerm={query}
          totalCount={totalCount}
          currentPage={page}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
