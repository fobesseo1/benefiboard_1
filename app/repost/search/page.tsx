// app/repost/search/page.tsx

import { cache } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import RepostSearchList from '../_component/RepostSearchList';
import { fetchLatestBatches } from '../_actions/fetchRepostData';
import { CurrentUserType, RepostType } from '@/types/types';

const fetchCachedSearchSuggestions = cache(async () => {
  const { success, data: repostData } = await fetchLatestBatches();
  if (!success || !Array.isArray(repostData)) {
    console.error('Failed to fetch search suggestions');
    return [];
  }
  return Array.from(new Set(repostData.map((post) => post.title)));
});

export default async function RepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query || '';

  const titleSuggestions = await fetchCachedSearchSuggestions();

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[948px] mx-auto">
        <h1 className="text-2xl font-semibold">Repost Search Results</h1>
        <SearchBar initialQuery={query} searchUrl="/repost/search" suggestions={titleSuggestions} />
        <RepostSearchList currentUser={currentUser} isBestPosts={false} initialSearchTerm={query} />
      </div>
    </div>
  );
}
