// app/post/search/page.tsx
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '../_component/SearchBar';
import PagedPosts from '../_component/PagedPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '../../../types/types';
import { getPostsData } from '../_action/postData';
import { searchPosts } from './utils';

interface PostSearchPageProps {
  searchParams: {
    query: string;
    page: string;
  };
}

const PostSearchPage: React.FC<PostSearchPageProps> = async ({ searchParams }) => {
  const query = searchParams.query || '';
  const page = parseInt(searchParams.page || '1', 10);
  const { posts: initialPosts, totalCount } = await searchPosts(query, page);

  const currentUser: CurrentUserType | null = await getCurrentUser();
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
};

export default PostSearchPage;
