// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import RepostSection from './_components/RepostSection';
import PostsSection from './_components/PostsSection';
import RepostSectionSkeleton from './_components/RepostSectionSkeleton';
import { CurrentUserType, RepostType } from '@/types/types';
import PostsSectionSkeleton from './_components/PostsSectionSkeleton';

async function RepostSectionWrapper({
  title,
  fetchFunction,
  cacheKey,
  cacheTime,
  currentUser,
  linkPath,
}: {
  title: string;
  fetchFunction: () => Promise<RepostType[]>;
  cacheKey: string;
  cacheTime: number;
  currentUser: CurrentUserType | null;
  linkPath: string;
}) {
  const initialPosts = await fetchFunction();

  return (
    <RepostSection
      title={title}
      initialPosts={initialPosts}
      cacheKey={cacheKey}
      cacheTime={cacheTime}
      currentUser={currentUser}
      linkPath={linkPath}
    />
  );
}

export default async function Home() {
  const currentUser = await getCurrentUser();
  const postsPromise = fetchPosts();

  return (
    <OnboardingLogicWrapper currentUser={currentUser}>
      <Suspense fallback={<RepostSectionSkeleton />}>
        <RepostSectionWrapper
          title="인기 커뮤니티 오늘의 베스트 10"
          fetchFunction={fetchBestReposts}
          cacheKey="bestReposts"
          cacheTime={1 * 60 * 60 * 1000} //1시간 캐시 시간
          currentUser={currentUser}
          linkPath="/repost/best"
        />
      </Suspense>
      <Suspense fallback={<RepostSectionSkeleton />}>
        <RepostSectionWrapper
          title="인기 커뮤니티 실시간 베스트 10"
          fetchFunction={fetchBasicReposts}
          cacheKey="basicReposts"
          cacheTime={15 * 60 * 1000} //15분 캐시 시간
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