// app/repost/search/best/page.tsx

import { cache } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import RepostSearchList from '../../_component/RepostSearchList';
import { CurrentUserType, RepostType } from '@/types/types';
import { fetchLatestBestBatches } from '../../best/utils';

const fetchCachedBestSearchSuggestions = cache(async () => {
  const { success, data: repostData } = await fetchLatestBestBatches();
  if (!success || !Array.isArray(repostData)) {
    console.error('Failed to fetch best search suggestions');
    return [];
  }
  return Array.from(new Set(repostData.map((post) => post.title)));
});

export default async function BestRepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query || '';

  const titleSuggestions = await fetchCachedBestSearchSuggestions();

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[984px] mx-auto">
        <h1 className="text-2xl font-semibold">Best Repost Search Results</h1>
        <SearchBar
          initialQuery={query}
          searchUrl="/repost/search/best"
          suggestions={titleSuggestions}
        />
        <RepostSearchList currentUser={currentUser} isBestPosts={true} initialSearchTerm={query} />
      </div>
    </div>
  );
}
