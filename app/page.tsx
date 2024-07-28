// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import RepostSectionSkeleton from './_components/RepostSectionSkeleton';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';

// ISR 설정: 15분마다 페이지 재생성
export const revalidate = 900;

export default async function Home() {
  const currentUser = await getCurrentUser();
  const bestRepostsPromise = fetchBestReposts();
  const basicRepostsPromise = fetchBasicReposts();
  const postsPromise = fetchPosts();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <Suspense fallback={<RepostSectionSkeleton />}>
        <RepostSection
          title="인기 커뮤니티 오늘의 베스트 10"
          repostsPromise={bestRepostsPromise}
          cacheKey="bestReposts"
          cacheTime={60 * 60 * 1000} // 1시간 캐시 시간
          currentUser={currentUser}
          linkPath="/repost/best"
        />
      </Suspense>
      <Suspense fallback={<RepostSectionSkeleton />}>
        <RepostSection
          title="인기 커뮤니티 실시간 베스트 10"
          repostsPromise={basicRepostsPromise}
          cacheKey="basicReposts"
          cacheTime={15 * 60 * 1000} // 15분 캐시 시간
          currentUser={currentUser}
          linkPath="/repost"
        />
      </Suspense>
      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection postsPromise={postsPromise} currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}
