'use client';

import { useState, useEffect, use } from 'react';
import { CurrentUserType, RepostType } from '@/types/types';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';

interface RepostSectionProps {
  title: string;
  repostsPromise: Promise<RepostType[]>;
  cacheKey: string;
  cacheTime: number;
  currentUser: CurrentUserType | null;
  linkPath: string;
}

export default function RepostSection({
  title,
  repostsPromise,
  cacheKey,
  cacheTime,
  currentUser,
  linkPath,
}: RepostSectionProps) {
  const initialReposts = use(repostsPromise);
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
    setReposts(initialReposts);
    localStorage.setItem(cacheKey, JSON.stringify(initialReposts));
    localStorage.setItem(`${cacheKey}Time`, new Date().getTime().toString());
  };

  return (
    <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
      <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
      <Repost_list_mainpage
        initialPosts={reposts}
        cacheKey={cacheKey}
        cacheTime={cacheTime}
        currentUser={currentUser}
        userId={currentUser?.id ?? null}
        linkPath={linkPath}
      />
    </div>
  );
}
