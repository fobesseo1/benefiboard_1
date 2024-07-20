//app>repost>_components>repost_list.tsx

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames'; // classNames 라이브러리 임포트
import Link from 'next/link';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import { CurrentUserType, RepostType } from '@/types/types';

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  linkPath: string;
  userId: string | null;
};

// 사이트와 색상 매핑 객체
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

export default function Repost_list_mainpage({
  initialPosts,
  currentUser,
  linkPath,
  userId,
}: RepostDataProps) {
  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [currentUserState, setCurrentUserState] = useState<CurrentUserType | null>(currentUser);
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
    setCurrentUserState(currentUser);
  }, [initialPosts, currentUser]);

  useEffect(() => {
    const clearLocalStorageDaily = () => {
      const lastClear = localStorage.getItem('lastClear');
      const now = new Date().getTime();

      if (!lastClear || now - parseInt(lastClear) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('lastClear', now.toString());
        localStorage.removeItem('roundsData');
        localStorage.removeItem(`readPosts`);
        if (userId) {
          localStorage.removeItem(`readPosts_${userId}`);
        }
      }
    };

    clearLocalStorageDaily();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const readPostsKey = `readPosts_${userId}`;
      const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
      setReadPosts(storedReadPosts);
    }
  }, [userId]);

  const handlePostClick = async (post: RepostType) => {
    if (userId) {
      const readPostsKey = `readPosts_${userId}`;
      const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
      const updatedReadPosts = Array.from(new Set([...storedReadPosts, post.id.toString()]));
      setReadPosts(updatedReadPosts);
      localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

      if (currentUser && currentUser.donation_id) {
        try {
          const donationResult = await addDonationPoints(
            currentUser.id,
            currentUser.donation_id,
            5
          );
          if (donationResult) {
            console.log(
              `Added 5 donation points from ${currentUser.id} to ${currentUser.donation_id}`
            );
          } else {
            console.error(
              `Failed to add donation points from ${currentUser.id} to ${currentUser.donation_id}`
            );
          }
        } catch (error) {
          console.error('Error adding donation points:', error);
        }
      }
    }

    setSelectedPost(post);
    setShowPopup(true);
  };

  const isPostRead = (postId: string) => {
    return readPosts.includes(postId);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  const getBadgeColor = (site: string) => {
    return siteColors[site] || 'gray'; // 사이트에 해당하는 색상을 찾거나 기본 색상인 gray를 반환
  };

  return (
    <div className="relative mb-4 ">
      <Link href={linkPath}>
        <div className="absolute w-24 h-12 -bottom-8 lg:-bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 flex items-center justify-center gap-1 rounded-full shadow-md">
          <p className="text-lg font-semibold text-white">+</p>
          <p className=" font-semibold text-white">더보기</p>
        </div>
      </Link>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id}>
            <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200  mx-auto ">
              <div className="flex justify-between items-center">
                <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
                  <div className="flex items-center">
                    <Badge className={classNames(`bg-${getBadgeColor(post.site)}-500`)}>
                      {post.site || '아무거나'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {listformatDate(post.created_at) || 'No time'}
                </p>
              </div>
              <div
                className="flex-1 pt-2 pb-2 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <p
                  className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                    isPostRead(post.id.toString()) ? 'text-gray-400' : ''
                  }`}
                >
                  {post.title}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="hover:text-red-200 text-blue-400">No posts</p>
      )}
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUserState} onClose={closePopup} />
      )}
    </div>
  );
}
