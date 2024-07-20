// app/repost/search/page.tsx
import { getCurrentUser } from '@/lib/cookies';
import SearchBar from '@/app/post/_component/SearchBar';
import RepostSearchList from '../_component/RepostSearchList';
import { fetchLatestBatches } from '../_actions/fetchRepostData';
import { CurrentUserType, RepostType } from '@/types/types';

export default async function RepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query || '';

  // 검색 제안을 위한 데이터 가져오기
  const { success, data: repostData } = await fetchLatestBatches();
  const suggestions: RepostType[] = success && Array.isArray(repostData) ? repostData : [];
  const titleSuggestions = Array.from(new Set(suggestions.map((post) => post.title)));

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
