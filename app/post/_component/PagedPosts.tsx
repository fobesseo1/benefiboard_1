// app/post/_component/PagedPosts.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlBubble, SlEye, SlHeart } from 'react-icons/sl';
import { listformatDate } from '@/lib/utils/formDate';
import { fetchMorePosts, fetchSearchPosts } from '../_action/infinityScrollPost';
import { CurrentUserType, PostType } from '../../../types/types';
import { addWritingPoints, addDonationPoints } from '../_action/adPointSupabase';
import { Button } from '@/components/ui/button';

type PagedPostsProps = {
  initialPosts: PostType[];
  userId?: string | null;
  searchTerm?: string;
  categoryId?: string;
  currentUser: CurrentUserType | null;
  totalCount: number;
  currentPage: number;
  isBestPosts?: boolean;
};

const PostItem = React.memo(({ post, isRead }: { post: PostType; isRead: boolean }) => (
  <Link href={`/post/detail/${post.id}`} passHref prefetch={true}>
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden">
      {/* Mobile layout */}
      <div className="flex justify-between items-center">
        <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
          <p className="text-xs leading-tight tracking-tight text-gray-600">
            {post.parent_category_name || '아무거나'} &gt; {post.child_category_name || '프리토크'}
          </p>
        </div>
        <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
      </div>
      <div className="flex-1 pt-2 pb-2">
        <p
          className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${isRead ? 'text-gray-400' : ''}`}
        >
          {post.title}
        </p>
      </div>
      {/* Post metadata */}
      <div className="flex gap-4 items-center overflow-hidden">
        <p
          className={`text-xs font-semibold leading-tight tracking-tight truncate ${isRead ? 'text-gray-400' : ''}`}
        >
          {post.author_name || post.author_email || 'unknown'}
        </p>
        <div className="flex gap-1">
          <span className="flex items-center gap-[2px]">
            <SlHeart size={12} color="gray" />
            {post.likes || '0'}
          </span>
          <span className="flex items-center gap-[2px]">
            <SlEye size={14} color="gray" />
            {post.views || '0'}
          </span>
          <span className="flex items-center gap-[2px]">
            <SlBubble size={12} color="gray" />
            {post.comments || '0'}
          </span>
        </div>
      </div>
    </div>

    <div className="hidden lg:flex w-[948px] mx-auto gap-4 items-center justify-between py-2 bg-white border-b-[1px] border-gray-200">
      {/* Desktop layout */}
      <div className="w-[160px]">
        <p className="text-xs leading-tight tracking-tight text-gray-600">
          {post.parent_category_name || '아무거나'} &gt; {post.child_category_name || '프리토크'}
        </p>
      </div>
      <div className="w-[520px] py-1">
        <p
          className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${isRead ? 'text-gray-400' : ''}`}
        >
          {post.title}
        </p>
      </div>
      <p className="w-[120px] text-sm leading-tight tracking-tight text-gray-600 truncate">
        {post.author_name || post.author_email || 'unknown'}
      </p>
      <div className="flex gap-1 w-[100px]">
        <span className="flex items-center gap-[2px]">
          <SlHeart size={12} color="gray" />
          {post.likes || '0'}
        </span>
        <span className="flex items-center gap-[2px]">
          <SlEye size={14} color="gray" />
          {post.views || '0'}
        </span>
        <span className="flex items-center gap-[2px]">
          <SlBubble size={12} color="gray" />
          {post.comments || '0'}
        </span>
      </div>
      <p className="text-xs text-gray-600 lg:block w-[48px]">
        {listformatDate(post.created_at) || 'No time'}
      </p>
    </div>
  </Link>
));

PostItem.displayName = 'PostItem';

export default function PagedPosts({
  initialPosts,
  userId,
  searchTerm,
  categoryId,
  currentUser,
  totalCount,
  currentPage,
  isBestPosts = false,
}: PagedPostsProps) {
  const [posts] = useState<PostType[]>(initialPosts);
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = useMemo(() => Math.ceil(totalCount / 20), [totalCount]);

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

  useEffect(() => {
    const postId = pathname.split('/').pop();
    if (postId && !readPosts[postId]) {
      setReadPosts((prev) => ({ ...prev, [postId]: true }));
      if (userId) {
        const readPostsKey = `readPosts_${userId}`;
        localStorage.setItem(
          readPostsKey,
          JSON.stringify(Object.keys({ ...readPosts, [postId]: true }))
        );
      }

      const post = posts.find((p) => p.id === postId);
      if (post) {
        Promise.all([
          addWritingPoints(post.author_id, 5),
          currentUser?.donation_id
            ? addDonationPoints(currentUser.id, currentUser.donation_id, 5)
            : Promise.resolve(),
        ]).catch((error) => {
          console.error('Error adding points:', error);
        });
      }
    }
  }, [pathname, posts, readPosts, userId, currentUser]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('page', newPage.toString());
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} isRead={readPosts[post.id] || false} />
      ))}

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
    </div>
  );
}
