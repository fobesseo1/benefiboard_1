// app/post/_component/PagedPosts.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const PostItem = React.memo(
  ({ post, isRead, onClick }: { post: PostType; isRead: boolean; onClick: () => void }) => (
    <div>
      <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden">
        <div className="flex justify-between items-center">
          <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
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
        <Link href={`/post/detail/${post.id}`} passHref>
          <div className="flex-1 pt-2 pb-2 cursor-pointer" onClick={onClick}>
            <p
              className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                isRead ? 'text-gray-400' : ''
              }`}
            >
              {post.title}
            </p>
          </div>
        </Link>
        <div className="flex gap-4 items-center overflow-hidden">
          <Link href={`/profile/${post.author_id}`} className="overflow-hidden flex-1">
            <p
              className={`text-xs font-semibold leading-tight tracking-tight
           truncate ${isRead ? 'text-gray-400' : ''}`}
            >
              {post.author_name || post.author_email || 'unknown'}
            </p>
          </Link>
          <div className="flex gap-1">
            <div className="flex items-center gap-[2px]">
              <SlHeart size={12} color="gray" />
              <p className="text-xs leading-tight tracking-tight text-gray-600">
                {post?.likes || '0'}
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

      <div className="hidden lg:flex w-[948px] mx-auto gap-4 items-center justify-between py-2 bg-white border-b-[1px] border-gray-200">
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
        <Link href={`/post/detail/${post.id}`} passHref>
          <div className="w-[520px] py-1 cursor-pointer" onClick={onClick}>
            <p
              className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                isRead ? 'text-gray-400' : ''
              }`}
            >
              {post.title}
            </p>
          </div>
        </Link>

        <Link href={`/profile/${post.author_id}`} className="overflow-hidden w-[120px]">
          <p className="text-sm leading-tight tracking-tight text-gray-600 truncate">
            {post.author_name || post.author_email || 'unknown'}
          </p>
        </Link>
        <div className="flex gap-1 w-[100px]">
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
    </div>
  )
);

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
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(currentPage);
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const router = useRouter();

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
    setPosts(initialPosts);
    setPage(currentPage);
  }, [initialPosts, currentPage]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let newPosts;
      if (searchTerm) {
        newPosts = await fetchSearchPosts(searchTerm, page);
      } else if (isBestPosts) {
        newPosts = await fetchMorePosts(page, categoryId);
      } else {
        newPosts = await fetchMorePosts(page, categoryId);
      }
      setPosts(newPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, isBestPosts, categoryId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      router.push(`?page=${newPage}${searchTerm ? `&query=${searchTerm}` : ''}`, { scroll: false });
    },
    [router, searchTerm]
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

      // 포인트 추가 로직을 백그라운드에서 비동기적으로 실행
      Promise.all([
        addWritingPoints(post.author_id, 5),
        currentUser?.donation_id
          ? addDonationPoints(currentUser.id, currentUser.donation_id, 5)
          : Promise.resolve(),
      ]).catch((error) => {
        console.error('Error adding points:', error);
      });

      // 즉시 페이지 이동
      router.push(`/post/detail/${post.id}`);
    },
    [readPosts, userId, currentUser, router]
  );

  const memoizedPosts = useMemo(() => posts, [posts]);

  if (loading && posts.length === 0) return <p>Loading...</p>;
  if (posts.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      {memoizedPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          isRead={readPosts[post.id] || false}
          onClick={() => handlePostClick(post)}
        />
      ))}

      <div className="flex justify-between items-center mt-4 lg:w-[948px] mx-auto">
        <Button onClick={() => handlePageChange(Math.max(page - 1, 1))} disabled={page === 1}>
          Previous Page
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
