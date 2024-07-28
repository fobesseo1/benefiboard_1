'use client';

import { useState, useEffect, useMemo } from 'react';
import { CurrentUserType, RepostType } from '@/types/types';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';

interface RepostSectionProps {
  title: string;
  initialReposts: RepostType[];
  cacheKey: string;
  cacheTime: number;
  currentUser: CurrentUserType | null;
  linkPath: string;
}

export default function RepostSection({
  title,
  initialReposts,
  cacheKey,
  cacheTime,
  currentUser,
  linkPath,
}: RepostSectionProps) {
  const [reposts, setReposts] = useState<RepostType[]>(initialReposts);

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}Time`);

    if (cachedData && cachedTime) {
      const now = new Date().getTime();
      if (now - parseInt(cachedTime) < cacheTime) {
        setReposts(JSON.parse(cachedData));
      } else {
        updateCache();
      }
    } else {
      updateCache();
    }
  }, [cacheKey, cacheTime, initialReposts]);

  const updateCache = () => {
    localStorage.setItem(cacheKey, JSON.stringify(initialReposts));
    localStorage.setItem(`${cacheKey}Time`, new Date().getTime().toString());
  };

  // Memoize the Repost_list_mainpage component
  const MemoizedRepostList = useMemo(() => (
    <Repost_list_mainpage
      initialPosts={reposts}
      cacheKey={cacheKey}
      cacheTime={cacheTime}
      currentUser={currentUser}
      userId={currentUser?.id ?? null}
      linkPath={linkPath}
    />
  ), [reposts, cacheKey, cacheTime, currentUser, linkPath]);

  return (
    <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
      <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
      {MemoizedRepostList}
    </div>
  );
}
