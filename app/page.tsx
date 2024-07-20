// app/page.tsx

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import SkeletonLoader from './_components/SkeletonLoader';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import { CurrentUserType } from '@/types/types';

const TodayNoticePopup = dynamic(() => import('./_components/TodayNoticePopup'), { ssr: false });
const RepostSection = dynamic(() => import('./_components/RepostSection'));
const PostsSection = dynamic(() => import('./_components/PostsSection'));

export const revalidate = 600; // 10분 (전체 페이지에 대한 기본 revalidate 시간)

async function BestRepostsSectionWrapper({ currentUser }: { currentUser: CurrentUserType | null }) {
  const bestReposts = await fetchBestReposts();
  return (
    <RepostSection
      title="인기 커뮤니티 오늘의 베스트 10"
      posts={bestReposts}
      linkPath="/repost/best"
      currentUser={currentUser}
    />
  );
}

async function BasicRepostsSectionWrapper({
  currentUser,
}: {
  currentUser: CurrentUserType | null;
}) {
  const basicReposts = await fetchBasicReposts();
  return (
    <RepostSection
      title="인기 커뮤니티 실시간 베스트 10"
      posts={basicReposts}
      linkPath="/repost"
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
      <TodayNoticePopup />
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
