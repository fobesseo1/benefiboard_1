import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';

// ISR 설정: 15분마다 페이지 재생성
export const revalidate = 900;

export default async function Home() {
  const currentUser = await getCurrentUser();
  const bestReposts = await fetchBestReposts();
  const basicReposts = await fetchBasicReposts();
  const postsPromise = fetchPosts();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <RepostSection
        title="인기 커뮤니티 오늘의 베스트 10"
        initialReposts={bestReposts}
        cacheKey="bestReposts"
        cacheTime={60 * 60 * 1000} // 1시간 캐시 시간
        currentUser={currentUser}
        linkPath="/repost/best"
      />
      <RepostSection
        title="인기 커뮤니티 실시간 베스트 10"
        initialReposts={basicReposts}
        cacheKey="basicReposts"
        cacheTime={15 * 60 * 1000} // 15분 캐시 시간
        currentUser={currentUser}
        linkPath="/repost"
      />
      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection postsPromise={postsPromise} currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}