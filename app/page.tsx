// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import SkeletonLoader from './_components/SkeletonLoader';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';

export default async function Home() {
  const currentUser = await getCurrentUser();
  const bestReposts = await fetchBestReposts();
  const basicReposts = await fetchBasicReposts();
  const posts = await fetchPosts();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <Suspense fallback={<SkeletonLoader />}>
        <RepostSection
          title="인기 커뮤니티 오늘의 베스트 10"
          initialPosts={bestReposts}
          cacheKey="bestReposts"
          cacheTime={24 * 60 * 60 * 1000} // 24시간
          currentUser={currentUser}
          linkPath="/repost/best"
        />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <RepostSection
          title="인기 커뮤니티 실시간 베스트 10"
          initialPosts={basicReposts}
          cacheKey="basicReposts"
          cacheTime={3 * 60 * 60 * 1000} // 3시간
          currentUser={currentUser}
          linkPath="/repost"
        />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <PostsSection posts={posts} currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}