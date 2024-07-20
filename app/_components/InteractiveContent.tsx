// app/_components/InteractiveContent.tsx
'use client';

import { useMemo } from 'react';
import TopPosts from './TopPosts';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';
import { CurrentUserType, PostType, RepostType } from '@/types/types';

interface InteractiveContentProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function InteractiveContent({
  postsWithCategoryNames,
  currentUser,
  bestReposts,
  basicReposts,
}: InteractiveContentProps) {
  const repostSections = useMemo(
    () => (
      <div className="w-full flex flex-col grid-cols-2 gap-12 lg:gap-8 lg:grid">
        <RepostSection
          title="repost best 10"
          posts={bestReposts}
          currentUser={currentUser}
          linkPath="/repost/best"
        />
        <RepostSection
          title="repost basic 10"
          posts={basicReposts}
          currentUser={currentUser}
          linkPath="/repost"
        />
      </div>
    ),
    [bestReposts, basicReposts, currentUser]
  );

  return (
    <>
      {repostSections}
      <PopularPosts posts={postsWithCategoryNames} currentUser={currentUser} />
    </>
  );
}

const RepostSection = ({
  title,
  posts,
  currentUser,
  linkPath,
}: {
  title: string;
  posts: RepostType[];
  currentUser: CurrentUserType | null;
  linkPath: string;
}) => (
  <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
    <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
    <Repost_list_mainpage
      initialPosts={posts}
      currentUser={currentUser}
      linkPath={linkPath}
      userId={currentUser?.id ?? null}
    />
  </div>
);

const PopularPosts = ({
  posts,
  currentUser,
}: {
  posts: PostType[];
  currentUser: CurrentUserType | null;
}) => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
    <TopPosts posts={posts} userId={currentUser?.id ?? null} currentUser={currentUser} />
  </div>
);
