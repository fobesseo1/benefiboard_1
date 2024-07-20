// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import SkeletonLoader from './_components/SkeletonLoader';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';

export default async function Home() {
  const currentUserPromise = getCurrentUser();
  const bestRepostsPromise = fetchBestReposts();
  const basicRepostsPromise = fetchBasicReposts();
  const postsPromise = fetchPosts();

  const currentUser = await currentUserPromise;

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <Suspense fallback={<SkeletonLoader />}>
        <RepostSection
          title="인기 커뮤니티 오늘의 베스트 10"
          repostsPromise={bestRepostsPromise}
          cacheKey="bestReposts"
          cacheTime={24 * 60 * 60 * 1000}
          currentUser={currentUser}
          linkPath="/repost/best"
        />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <RepostSection
          title="인기 커뮤니티 실시간 베스트 10"
          repostsPromise={basicRepostsPromise}
          cacheKey="basicReposts"
          cacheTime={3 * 60 * 60 * 1000}
          currentUser={currentUser}
          linkPath="/repost"
        />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <PostsSection postsPromise={postsPromise} currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}
