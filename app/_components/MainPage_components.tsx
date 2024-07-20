import { CurrentUserType, PostType, RepostType } from '@/types/types';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';
import TopPosts from './TopPosts';
import Link from 'next/link';

export const WelcomeBanner = () => (
  <div className="w-[calc(100%-32px)] mt-4 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl text-white lg:w-full]">
    <h1 className="text-xl font-semibold lg:text-2xl">베네피보드에 오신 것을 환영합니다</h1>
    <p className="tracking-tighter text-sm lg:text-lg">
      ♡ 탐험하고, 소통하며, 다양한 보상을 받으세요 ♡
    </p>
  </div>
);

export const CurrentPoints = ({ points }: { points: number }) => (
  <div className="w-full flex justify-end lg:hidden">
    <p className="font-semibold mr-4">현재 포인트: {points}</p>
  </div>
);

export const RepostSection = ({
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

export const PopularPosts = ({
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

export const CommunityHighlight = () => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-bold lg:my-4 my-2">커뮤니티 하이라이트</h2>
    <Link href="/community-events">
      <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-blue-200 p-1 mt-4 rounded-xl">
        <img src="/communityEventsAd.jpg" alt="Community Events" />
      </div>
    </Link>
  </div>
);
