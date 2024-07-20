// app/_components/RepostSection.tsx
'use client';

import { CurrentUserType, RepostType } from '@/types/types';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';

interface RepostSectionProps {
  title: string;
  posts: RepostType[];
  linkPath: string;
  currentUser: CurrentUserType | null;
}

export default function RepostSection({ title, posts, linkPath, currentUser }: RepostSectionProps) {
  const userId = currentUser ? currentUser.id : null;

  return (
    <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
      <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
      <Repost_list_mainpage
        initialPosts={posts}
        currentUser={currentUser}
        linkPath={linkPath}
        userId={userId}
      />
    </div>
  );
}
