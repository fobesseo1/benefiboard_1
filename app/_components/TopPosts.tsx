// app/_components/TopPosts.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SlBubble, SlEye, SlHeart } from 'react-icons/sl';
import { listformatDate } from '@/lib/utils/formDate';
import { CurrentUserType, PostType } from '../../types/types';
import { addDonationPoints, addWritingPoints } from '../post/_action/adPointSupabase';

type TopPostsProps = {
  posts: PostType[];
  userId?: string | null;
  searchTerm?: string;
  currentUser: CurrentUserType | null;
};

const PostItem = React.memo(
  ({ post, isRead, onClick }: { post: PostType; isRead: boolean; onClick: () => void }) => {
    const profileUrl = `/profile/${post.author_id}`;

    return (
      <>
        {/* Mobile view */}
        <div
          className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden"
          onClick={onClick}
        >
          <div className="flex justify-between items-center">
            <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden">
              <div className="flex">
                <p className="text-xs leading-tight tracking-tight text-gray-600">
                  {post.parent_category_name || '아무거나'} &gt;
                </p>
                <p className="text-xs leading-tight tracking-tight text-gray-600 ml-1">
                  {post.child_category_name || '프리토크'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
          </div>
          <div className="flex-1 pt-2 pb-2 cursor-pointer">
            <p
              className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                isRead ? 'text-gray-400' : ''
              }`}
            >
              {post.title}
            </p>
          </div>
          <div className="flex gap-4 items-center overflow-hidden">
            <Link href={profileUrl} className="overflow-hidden flex-1">
              <p className="text-xs font-semibold leading-tight tracking-tight text-gray-600 truncate">
                {post.author_name || post.author_email || 'unknown'}
              </p>
            </Link>
            <div className="flex gap-1">
              <div className="flex items-center gap-[2px]">
                <SlHeart size={12} color="gray" />
                <p className="text-xs leading-tight tracking-tight text-gray-600">
                  {post.likes || '0'}
                </p>
              </div>
              <div className="flex items-center gap-[2px]">
                <SlEye size={14} color="gray" />
                <p className="text-xs leading-tight tracking-tight text-gray-600">
                  {post.views || '0'}
                </p>
              </div>
              <div className="flex items-center gap-[2px]">
                <SlBubble size={12} color="gray" />
                <p className="text-xs leading-tight tracking-tight text-gray-600">
                  {post.comments || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop view */}
        <div
          className="hidden lg:flex w-[948px] gap-4 items-center py-2 bg-white border-b-[1px] border-gray-200"
          onClick={onClick}
        >
          <div className="flex items-center w-[160px]">
            <div className="flex">
              <p className="text-xs leading-tight tracking-tight text-gray-600">
                {post.parent_category_name || '아무거나'} &gt;
              </p>
              <p className="text-xs leading-tight tracking-tight text-gray-600 ml-1">
                {post.child_category_name || '프리토크'}
              </p>
            </div>
          </div>
          <div className="w-[520px] py-1 cursor-pointer">
            <p
              className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                isRead ? 'text-gray-400' : ''
              }`}
            >
              {post.title}
            </p>
          </div>
          <Link href={profileUrl} className="overflow-hidden w-[100px]">
            <p className="text-sm leading-tight tracking-tight text-gray-600 truncate">
              {post.author_name || post.author_email || 'unknown'}
            </p>
          </Link>
          <div className="flex gap-1 w-[120px]">
            <div className="flex items-center gap-[2px]">
              <SlHeart size={12} color="gray" />
              <p className="text-xs leading-tight tracking-tight text-gray-600">
                {post.likes || '0'}
              </p>
            </div>
            <div className="flex items-center gap-[2px]">
              <SlEye size={14} color="gray" />
              <p className="text-xs leading-tight tracking-tight text-gray-600">
                {post.views || '0'}
              </p>
            </div>
            <div className="flex items-center gap-[2px]">
              <SlBubble size={12} color="gray" />
              <p className="text-xs leading-tight tracking-tight text-gray-600">
                {post.comments || '0'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 lg:block w-[48px]">
            {listformatDate(post.created_at) || 'No time'}
          </p>
        </div>
      </>
    );
  }
);

PostItem.displayName = 'PostItem';

export default function TopPosts({ posts, userId, currentUser }: TopPostsProps) {
  const router = useRouter();
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userId) {
      const readPostsKey = `readPosts_${userId}`;
      const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
      setReadPosts(
        storedReadPosts.reduce((acc: Record<string, boolean>, postId: string) => {
          acc[postId] = true;
          return acc;
        }, {})
      );
    }
  }, [userId]);

  const addPoints = useCallback(
    (post: PostType) => {
      Promise.all([
        addWritingPoints(post.author_id, 5),
        currentUser?.donation_id
          ? addDonationPoints(currentUser.id, currentUser.donation_id, 5)
          : Promise.resolve(),
      ]).catch((error) => {
        console.error('Error adding points:', error);
      });
    },
    [currentUser]
  );

  const handlePostClick = useCallback(
    (post: PostType) => {
      setReadPosts((prev) => ({ ...prev, [post.id]: true }));

      if (userId) {
        const readPostsKey = `readPosts_${userId}`;
        localStorage.setItem(
          readPostsKey,
          JSON.stringify(Object.keys({ ...readPosts, [post.id]: true }))
        );
      }

      // Navigate immediately
      router.push(`/post/detail/${post.id}`);

      // Add points after navigation
      setTimeout(() => addPoints(post), 0);
    },
    [readPosts, userId, router, addPoints]
  );

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
    <div className="flex flex-col pt-4 w-full px-4 lg:px-0 relative">
      <Link href="/post/best" prefetch={true}>
        <div className="absolute w-8 h-8 -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-400 flex items-center justify-center rounded-full">
          <p className="text-lg font-semibold text-white">+</p>
        </div>
      </Link>
      {memoizedPosts.length ? (
        memoizedPosts.map((post) => (
          <Link key={post.id} href={`/post/detail/${post.id}`} prefetch={true}>
            <PostItem
              post={post}
              isRead={readPosts[post.id] || false}
              onClick={() => handlePostClick(post)}
            />
          </Link>
        ))
      ) : (
        <p className="hover:text-red-200 text-blue-400">No posts</p>
      )}
    </div>
  );
}
