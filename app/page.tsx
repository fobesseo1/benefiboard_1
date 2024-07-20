// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import {
  fetchCachedBasicReposts,
  fetchCachedBestReposts,
  fetchPosts,
} from './actions/mainPageActions';
import SkeletonLoader from './_components/SkeletonLoader';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import { CurrentUserType } from '@/types/types';

async function BestRepostsSectionWrapper({ currentUser }: { currentUser: CurrentUserType | null }) {
  const bestReposts = await fetchCachedBestReposts();
  return (
    <RepostSection
      title="인기 커뮤니티 오늘의 베스트 10"
      posts={bestReposts}
      linkpath="/repost/best"
      currentUser={currentUser}
    />
  );
}

async function BasicRepostsSectionWrapper({
  currentUser,
}: {
  currentUser: CurrentUserType | null;
}) {
  const basicReposts = await fetchCachedBasicReposts();
  return (
    <RepostSection
      title="인기 커뮤니티 실시간 베스트 10"
      posts={basicReposts}
      linkpath="/repost"
      currentUser={currentUser}
    />
  );
}

async function PostsSectionWrapper({ currentUser }: { currentUser: CurrentUserType | null }) {
  const posts = await fetchPosts();
  return <PostsSection posts={posts} currentUser={currentUser} />;
}

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <Suspense fallback={<SkeletonLoader />}>
        <BestRepostsSectionWrapper currentUser={currentUser} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <BasicRepostsSectionWrapper currentUser={currentUser} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <PostsSectionWrapper currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}
