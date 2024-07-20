// app/post/_component/PagedPosts.tsx
'use client';

import { useEffect, useState } from 'react';
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
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const router = useRouter();

  const totalPages = Math.ceil(totalCount / 20);

  useEffect(() => {
    if (userId) {
      const readPostsKey = `readPosts_${userId}`;
      const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
      setReadPosts(storedReadPosts);
    }
  }, [userId]);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(currentPage);
  }, [initialPosts, currentPage]);

  const fetchPosts = async (newPage: number) => {
    setLoading(true);
    try {
      let newPosts;
      if (searchTerm) {
        newPosts = await fetchSearchPosts(searchTerm, newPage);
      } else if (isBestPosts) {
        // Implement fetchBestPosts function similar to fetchMorePosts
        newPosts = await fetchMorePosts(newPage, categoryId);
      } else {
        newPosts = await fetchMorePosts(newPage, categoryId);
      }
      setPosts(newPosts);
      setPage(newPage);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage);
    router.push(`?page=${newPage}${searchTerm ? `&query=${searchTerm}` : ''}`, { scroll: false });
  };

  const prefetchPostDetail = async (postId: string) => {
    const targetUrl = `/post/detail/${postId}`;
    router.prefetch(targetUrl);
  };

  const handlePostClick = async (postId: string) => {
    console.log('postId click', postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      try {
        const result = await addWritingPoints(post.author_id, 5);
        if (result) {
          console.log(`Added 5 points to author ${post.author_id}`);
        } else {
          console.error(`Failed to add points to author ${post.author_id}`);
        }

        if (currentUser && currentUser.donation_id) {
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
        }
      } catch (error) {
        console.error('Error adding points:', error);
      }
    }

    const readPostsKey = `readPosts_${userId}`;
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

    const updatedReadPosts = Array.from(new Set([...storedReadPosts, postId]));

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    const detailUrl = `/post/detail/${postId}`;
    router.push(detailUrl);
  };

  const isPostRead = (postId: string) => {
    return readPosts.includes(postId);
  };

  return (
    <div>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id}>
            <div
              className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden"
              onClick={() => prefetchPostDetail(post.id)}
            >
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
                <p className="text-xs text-gray-600">
                  {listformatDate(post.created_at) || 'No time'}
                </p>
              </div>
              <div
                className="flex-1 pt-2 pb-2 cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              >
                <p
                  className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                    isPostRead(post.id) ? 'text-gray-400' : ''
                  }`}
                >
                  {post.title}
                </p>
              </div>
              <div className="flex gap-4 items-center overflow-hidden">
                <Link href={`/profile/${post.author_id}`} className="overflow-hidden flex-1">
                  <p
                    className={`text-xs font-semibold leading-tight tracking-tight
                   truncate ${isPostRead(post.id) ? 'text-gray-400' : ''}`}
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

            <div
              className="hidden lg:flex w-[948px] mx-auto gap-4 items-center justify-between py-2 bg-white border-b-[1px] border-gray-200"
              onClick={() => handlePostClick(post.id)}
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
                    isPostRead(post.id) ? 'text-gray-400' : ''
                  }`}
                >
                  {post.title}
                </p>
              </div>

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
        ))
      ) : (
        <div className="w-full flex items-center justify-center">
          <p className="hover:text-red-200 text-blue-400 mx-auto">No posts</p>
        </div>
      )}

      {loading && <p>Loading...</p>}
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
