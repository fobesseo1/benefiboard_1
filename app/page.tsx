/* import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';
import dynamic from 'next/dynamic';

// ISR 설정 최적화
export const revalidate = 300; // 5분으로 조정

const DynamicPostsSection = dynamic(() => import('./_components/PostsSection'), {
  loading: () => <PostsSectionSkeleton />,
});

export default async function Home() {

  // 병렬로 데이터 fetching
  const [currentUser, bestReposts, basicReposts, posts] = await Promise.all([
    getCurrentUser(),
    fetchBestReposts(),
    fetchBasicReposts(),
    fetchPosts(),
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
      <DynamicPostsSection initialPosts={posts} currentUser={currentUser} />
    </OnboardingLogicWrapper>
  );
}
 */

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';
import RepostSectionSkeleton from './_components/RepostSectionSkeleton';
import dynamic from 'next/dynamic';
import { CurrentUserType, PostType, RepostType } from '@/types/types';

export const revalidate = 300; // 5분으로 조정

const DynamicPostsSection = dynamic(() => import('./_components/PostsSection'), {
  loading: () => <PostsSectionSkeleton />,
});

export default async function Home() {
  const dataPromises = {
    currentUser: getCurrentUser(),
    bestReposts: fetchBestReposts(),
    basicReposts: fetchBasicReposts(),
    posts: fetchPosts(),
  };

  const results = await Promise.allSettled(
    Object.entries(dataPromises).map(([key, promise]) => promise)
  );

  const data: {
    currentUser: CurrentUserType | null;
    bestReposts: RepostType[] | null;
    basicReposts: RepostType[] | null;
    posts: PostType[] | null;
  } = {
    currentUser: null,
    bestReposts: null,
    basicReposts: null,
    posts: null,
  };

  Object.keys(dataPromises).forEach((key, index) => {
    if (results[index].status === 'fulfilled') {
      data[key as keyof typeof data] = results[index].value as any;
    }
  });

  return (
    <OnboardingLogicWrapper currentUser={data.currentUser}>
      <Suspense fallback={<RepostSectionSkeleton />}>
        {data.bestReposts ? (
          <RepostSection
            title="인기 커뮤니티 오늘의 베스트 10"
            initialReposts={data.bestReposts}
            cacheKey="bestReposts"
            cacheTime={60 * 60 * 1000}
            currentUser={data.currentUser}
            linkPath="/repost/best"
          />
        ) : (
          <div>베스트 리포스트를 불러오는 데 실패했습니다.</div>
        )}
      </Suspense>

      <Suspense fallback={<RepostSectionSkeleton />}>
        {data.basicReposts ? (
          <RepostSection
            title="인기 커뮤니티 실시간 베스트 10"
            initialReposts={data.basicReposts}
            cacheKey="basicReposts"
            cacheTime={15 * 60 * 1000}
            currentUser={data.currentUser}
            linkPath="/repost"
          />
        ) : (
          <div>실시간 베스트 리포스트를 불러오는 데 실패했습니다.</div>
        )}
      </Suspense>

      <Suspense fallback={<PostsSectionSkeleton />}>
        {data.posts ? (
          <DynamicPostsSection initialPosts={data.posts} currentUser={data.currentUser} />
        ) : (
          <div>포스트를 불러오는 데 실패했습니다.</div>
        )}
      </Suspense>
    </OnboardingLogicWrapper>
  );
}
