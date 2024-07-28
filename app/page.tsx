import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';

// ISR 설정 최적화
export const revalidate = 300; // 5분으로 조정

export default async function Home() {
  const currentUser = await getCurrentUser();
  
  // 병렬로 데이터 fetching
  const [bestReposts, basicReposts, posts] = await Promise.all([
    fetchBestReposts(),
    fetchBasicReposts(),
    fetchPosts()
  ]);

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <RepostSection
        title="인기 커뮤니티 오늘의 베스트 10"
        initialReposts={bestReposts}
        cacheKey="bestReposts"
        cacheTime={60 * 60 * 1000}
        currentUser={currentUser}
        linkPath="/repost/best"
      />
      <RepostSection
        title="인기 커뮤니티 실시간 베스트 10"
        initialReposts={basicReposts}
        cacheKey="basicReposts"
        cacheTime={15 * 60 * 1000}
        currentUser={currentUser}
        linkPath="/repost"
      />
      <PostsSection initialPosts={posts} currentUser={currentUser} />
    </OnboardingLogicWrapper>
  );
}