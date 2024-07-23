// app/post/_component/PagedPosts.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlBubble, SlEye, SlHeart } from 'react-icons/sl';
import { listformatDate } from '@/lib/utils/formDate';
import {
  addWritingPoints,
  addDonationPoints,
  addPointsServerAction,
} from '../_action/adPointSupabase';
import { CurrentUserType, PostType } from '../../../types/types';
import { Button } from '@/components/ui/button';

type PagedPostsProps = {
  initialPosts: PostType[];
  userId?: string | null;
  currentUser: CurrentUserType | null;
  totalCount?: number;
  currentPage?: number;
  isTopPosts?: boolean;
  categoryId?: string;
  isBestPosts?: boolean;
  searchTerm?: string;
};

const PostItem = React.memo(({ post, isRead }: { post: PostType; isRead: boolean }) => (
  <div className="">
    {/* Mobile view */}
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden">
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
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-semibold leading-tight tracking-tight text-gray-600 truncate">
            {post.author_name || post.author_email || 'unknown'}
          </p>
        </div>
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
    <div className="hidden lg:flex w-[948px] gap-4 items-center py-2 bg-white border-b-[1px] border-gray-200">
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
      <div className="overflow-hidden w-[100px]">
        <p className="text-sm leading-tight tracking-tight text-gray-600 truncate">
          {post.author_name || post.author_email || 'unknown'}
        </p>
      </div>
      <div className="flex gap-1 w-[120px]">
        <div className="flex items-center gap-[2px]">
          <SlHeart size={12} color="gray" />
          <p className="text-xs leading-tight tracking-tight text-gray-600">{post.likes || '0'}</p>
        </div>
        <div className="flex items-center gap-[2px]">
          <SlEye size={14} color="gray" />
          <p className="text-xs leading-tight tracking-tight text-gray-600">{post.views || '0'}</p>
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
  </div>
));

PostItem.displayName = 'PostItem';

export default function PagedPosts({
  initialPosts,
  userId,
  currentUser,
  totalCount,
  currentPage,
  isTopPosts = false,
  categoryId,
  isBestPosts = false,
  searchTerm,
}: PagedPostsProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = useMemo(() => (totalCount ? Math.ceil(totalCount / 20) : 1), [totalCount]);

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

  const handlePostClick = useCallback(
    (post: PostType) => {
      // 즉시 페이지 이동 시작
      router.push(`/post/detail/${post.id}`);

      // 로컬 상태 및 localStorage 업데이트
      setReadPosts((prev) => ({ ...prev, [post.id]: true }));
      if (userId) {
        const readPostsKey = `readPosts_${userId}`;
        const updatedReadPosts = JSON.stringify(Object.keys({ ...readPosts, [post.id]: true }));
        localStorage.setItem(readPostsKey, updatedReadPosts);
      }

      // 포인트 추가 로직을 백그라운드에서 실행
      if (currentUser) {
        // requestIdleCallback을 사용하여 브라우저가 idle 상태일 때 실행
        requestIdleCallback(() => {
          addPointsServerAction(
            post.author_id,
            currentUser.id,
            currentUser.donation_id || undefined
          ).catch((error) => {
            console.error('Error adding points:', error);
          });
        });
      }
    },
    [currentUser, readPosts, userId, router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!isTopPosts && currentPage !== undefined) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', newPage.toString());
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
      }
    },
    [isTopPosts, currentPage, searchParams, pathname, router]
  );

  return (
    <div className="relative lg:w-[948px] mx-auto w-full ">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/detail/${post.id}`}
          prefetch={true}
          onClick={(e) => {
            e.preventDefault();
            handlePostClick(post);
          }}
        >
          <PostItem post={post} isRead={readPosts[post.id] || false} />
        </Link>
      ))}

      {isTopPosts && (
        <Link href="/post/best" prefetch={true}>
          <div className="absolute w-8 h-8 -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-400 flex items-center justify-center rounded-full">
            <p className="text-lg font-semibold text-white">+</p>
          </div>
        </Link>
      )}

      {!isTopPosts && currentPage !== undefined && (
        <div className="flex justify-between items-center mt-4 lg:w-[948px] mx-auto">
          <Button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next Page
          </Button>
        </div>
      )}
    </div>
  );
}
