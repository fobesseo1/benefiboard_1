//app>repost>_components>repost_list_mainpage.tsx

'use client';

import * as React from 'react';
import { useEffect, useState, useCallback, useMemo, useTransition } from 'react';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import { CurrentUserType, RepostType } from '@/types/types';

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  linkPath: string;
  userId: string | null;
  cacheKey: string;
  cacheTime: number;
};

const siteColors: { [key: string]: string } = {
  웃대: 'red',
  펨코: 'orange',
  인벤: 'amber',
  엠팍: 'green',
  루리: 'emerald',
  오유: 'teal',
  SLR: 'cyan',
  '82쿡': 'sky',
  클리앙: 'indigo',
  인티: 'violet',
  보배: 'purple',
  더쿠: 'fuchsia',
  디씨: 'stone',
  유머픽: 'lime',
  뽐뿌: 'rose',
};

const RepostItem = React.memo(
  ({
    post,
    isRead,
    onClick,
    getBadgeColor,
  }: {
    post: RepostType;
    isRead: boolean;
    onClick: () => void;
    getBadgeColor: (site: string) => string;
  }) => (
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto">
      <div className="flex justify-between items-center">
        <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
          <div className="flex items-center">
            <Badge className={classNames(`bg-${getBadgeColor(post.site)}-500`)}>
              {post.site || '아무거나'}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
      </div>
      <div className="flex-1 pt-2 pb-2 cursor-pointer" onClick={onClick}>
        <p
          className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
            isRead ? 'text-gray-400' : ''
          }`}
        >
          {post.title}
        </p>
      </div>
    </div>
  )
);

RepostItem.displayName = 'RepostItem';

export default function Repost_list_mainpage({
  initialPosts,
  currentUser,
  linkPath,
  userId,
  cacheKey,
  cacheTime,
}: RepostDataProps) {
  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);

  const getLocalStorageItem = (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      return null;
    }
  };

  const setLocalStorageItem = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
    }
  };

  const updateCache = useCallback(() => {
    setLocalStorageItem(`repost_${cacheKey}`, initialPosts);
    setLocalStorageItem(`repost_${cacheKey}_time`, new Date().getTime().toString());
  }, [cacheKey, initialPosts]);

  useEffect(() => {
    const cachedData = getLocalStorageItem(`repost_${cacheKey}`);
    const cachedTime = getLocalStorageItem(`repost_${cacheKey}_time`);

    if (Array.isArray(cachedData) && typeof cachedTime === 'number') {
      const now = new Date().getTime();
      if (now - cachedTime < cacheTime) {
        setPosts(cachedData);
      } else {
        updateCache();
      }
    } else {
      updateCache();
    }

    if (userId) {
      const readPostsKey = `repost_readPosts_${userId}`;
      const storedReadPosts = getLocalStorageItem(readPostsKey);
      if (storedReadPosts && typeof storedReadPosts === 'object') {
        setReadPosts(storedReadPosts);
      }
    }
  }, [cacheKey, cacheTime, initialPosts, userId, updateCache]);

  const handlePostClick = useCallback(
    async (post: RepostType) => {
      if (userId) {
        setReadPosts((prev) => ({ ...prev, [post.id]: true }));
        const readPostsKey = `repost_readPosts_${userId}`;
        const updatedReadPosts = { ...readPosts, [post.id]: true };
        localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

        if (currentUser?.donation_id) {
          addDonationPoints(currentUser.id, currentUser.donation_id, 5)
            .then(() => console.log(`Added 5 donation points`))
            .catch((error) => console.error('Error adding donation points:', error));
        }
      }

      setSelectedPost(post);
      setShowPopup(true);
    },
    [userId, currentUser, readPosts]
  );

  const closePopup = useCallback(() => {
    setShowPopup(false);
    setSelectedPost(null);
  }, []);

  const getBadgeColor = useCallback((site: string) => {
    return siteColors[site] || 'gray';
  }, []);

  return (
    <div className="relative mb-4">
      <Link href={linkPath}>
        <div className="absolute w-24 h-12 -bottom-8 lg:-bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 flex items-center justify-center gap-1 rounded-full shadow-md">
          <p className="text-lg font-semibold text-white">+</p>
          <p className="font-semibold text-white">더보기</p>
        </div>
      </Link>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <RepostItem
            key={post.id}
            post={post}
            isRead={readPosts[post.id] || false}
            onClick={() => handlePostClick(post)}
            getBadgeColor={getBadgeColor}
          />
        ))
      ) : (
        <p className="hover:text-red-200 text-blue-400">No posts</p>
      )}
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUser} onClose={closePopup} />
      )}
    </div>
  );
}
