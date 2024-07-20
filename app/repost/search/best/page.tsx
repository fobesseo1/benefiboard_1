// app/repost/search/best/page.tsx
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import RepostSearchList from '../../_component/RepostSearchList';
import { CurrentUserType, RepostType } from '@/types/types';
import { fetchLatestBestBatches } from '../../best/page';

export default async function BestRepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query || '';

  // 검색 제안을 위한 데이터 가져오기
  const { success, data: repostData } = await fetchLatestBestBatches();
  const suggestions: RepostType[] = success && Array.isArray(repostData) ? repostData : [];
  const titleSuggestions = Array.from(new Set(suggestions.map((post) => post.title)));

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
