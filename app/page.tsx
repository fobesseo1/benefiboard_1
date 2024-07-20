// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import SkeletonLoader from './_components/SkeletonLoader';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import { CurrentUserType } from '@/types/types';
import TodayNoticePopup from './_components/TodayNoticePopup';

export const revalidate = 1800;

// 각 섹션을 위한 서버 컴포넌트
const PostsSectionWrapper = async () => {
  const posts = await fetchPosts();
  const Component = ({ currentUser }: { currentUser: CurrentUserType | null }) => (
    <PostsSection posts={posts} currentUser={currentUser} />
  );
  Component.displayName = 'PostsSectionWrapper';
  return Component;
};

const BestRepostsSectionWrapper = async () => {
  const bestReposts = await fetchBestReposts();
  const Component = ({ currentUser }: { currentUser: CurrentUserType | null }) => (
    <RepostSection
      title="인기 커뮤니티 오늘의 베스트 10"
      posts={bestReposts}
      linkPath="/repost/best"
      currentUser={currentUser}
    />
  );
  Component.displayName = 'BestRepostsSectionWrapper';
  return Component;
};

const BasicRepostsSectionWrapper = async () => {
  const basicReposts = await fetchBasicReposts();
  const Component = ({ currentUser }: { currentUser: CurrentUserType | null }) => (
    <RepostSection
      title="인기 커뮤니티 실시간 베스트 10"
      posts={basicReposts}
      linkPath="/repost"
      currentUser={currentUser}
    />
  );
  Component.displayName = 'BasicRepostsSectionWrapper';
  return Component;
};

export default async function Home() {
  const currentUser = await getCurrentUser();
  const PostsSectionComponent = await PostsSectionWrapper();
  const BestRepostsSectionComponent = await BestRepostsSectionWrapper();
  const BasicRepostsSectionComponent = await BasicRepostsSectionWrapper();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <TodayNoticePopup />
      <Suspense fallback={<SkeletonLoader />}>
        <BestRepostsSectionComponent currentUser={currentUser} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <BasicRepostsSectionComponent currentUser={currentUser} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader />}>
        <PostsSectionComponent currentUser={currentUser} />
      </Suspense>
    </OnboardingLogicWrapper>
  );
}
