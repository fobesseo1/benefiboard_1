// app/repost/_component/RepostSearchList.tsx

'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CurrentUserType, RepostType } from '@/types/types';
import { fetchReposts, fetchBestReposts } from '../_actions/repostActions';
import RepostItem from './RepostItem';
import { Button } from '@/components/ui/button';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import RepostPopup from './RepostPopup';

interface RepostSearchListProps {
  currentUser: CurrentUserType | null;
  isBestPosts: boolean;
  initialSearchTerm: string;
  initialPosts?: RepostType[];
  initialTotalPages?: number;
}

const POSTS_PER_PAGE = 20;

export default function RepostSearchList({
  currentUser,
  isBestPosts,
  initialSearchTerm,
  initialPosts = [],
  initialTotalPages = 1,
}: RepostSearchListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);

  const searchTerm = useMemo(
    () => searchParams.get('query') || initialSearchTerm,
    [searchParams, initialSearchTerm]
  );
  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  }, [searchParams]);

  const fetchSearchResults = useCallback(
    async (term: string, pageNum: number) => {
      if (posts.length > 0 && pageNum === 1) return; // 초기 데이터가 있으면 첫 페이지 로딩 스킵
      setLoading(true);
      try {
        const { data: searchResults, totalCount } = isBestPosts
          ? await fetchBestReposts(term, pageNum, POSTS_PER_PAGE)
          : await fetchReposts(term, pageNum, POSTS_PER_PAGE);

        setPosts((prevPosts) => (pageNum === 1 ? searchResults : [...prevPosts, ...searchResults]));
        setTotalPages(Math.ceil((totalCount ?? 0) / POSTS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching search results:', error);
        if (pageNum === 1) setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [isBestPosts]
  );

  useEffect(() => {
    fetchSearchResults(searchTerm, page);
  }, [searchTerm, page, fetchSearchResults]);

  useEffect(() => {
    const readPostsKey = currentUser?.id ? `readPosts_${currentUser.id}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
    const readPostsObject = storedReadPosts.reduce(
      (acc: Record<string, boolean>, postId: string) => {
        acc[postId] = true;
        return acc;
      },
      {}
    );
    setReadPosts(readPostsObject);
  }, [currentUser]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', newPage.toString());
      router.push(
        `${isBestPosts ? '/repost/search/best' : '/repost/search'}?${newSearchParams.toString()}`,
        {
          scroll: false,
        }
      );
    },
    [searchParams, router, isBestPosts]
  );

  const handlePostClick = useCallback(
    async (post: RepostType) => {
      setReadPosts((prev) => {
        const newReadPosts = { ...prev, [post.id.toString()]: true };
        const readPostsKey = currentUser?.id ? `readPosts_${currentUser.id}` : 'readPosts';
        localStorage.setItem(readPostsKey, JSON.stringify(Object.keys(newReadPosts)));
        return newReadPosts;
      });

      if (currentUser?.donation_id) {
        addDonationPoints(currentUser.id, currentUser.donation_id, 5).catch((error) =>
          console.error('Error adding donation points:', error)
        );
      }

      setSelectedPost(post);
      setShowPopup(true);
    },
    [currentUser]
  );

  const closePopup = useCallback(() => {
    setShowPopup(false);
    setSelectedPost(null);
  }, []);

  if (loading && posts.length === 0) return <p>Loading...</p>;
  if (posts.length === 0) return <p>No results found.</p>;

  return (
    <div>
      {posts.map((post) => (
        <RepostItem
          key={post.id}
          post={post}
          currentUser={currentUser}
          onPostClick={handlePostClick}
          isRead={readPosts[post.id.toString()] || false}
        />
      ))}
      {loading && <p>Loading more...</p>}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => handlePageChange(Math.max(page - 1, 1))} disabled={page === 1}>
          Previous Page
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages || loading}
        >
          Next Page
        </Button>
      </div>
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUser} onClose={closePopup} />
      )}
    </div>
  );
}
