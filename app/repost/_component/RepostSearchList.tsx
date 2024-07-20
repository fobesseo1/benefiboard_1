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
}

const POSTS_PER_PAGE = 20;

export default function RepostSearchList({
  currentUser,
  isBestPosts,
  initialSearchTerm,
}: RepostSearchListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<RepostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [readPosts, setReadPosts] = useState<string[]>([]);
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
      setLoading(true);
      try {
        const { data: searchResults, totalCount } = isBestPosts
          ? await fetchBestReposts(term, pageNum, POSTS_PER_PAGE)
          : await fetchReposts(term, pageNum, POSTS_PER_PAGE);

        setPosts(searchResults);
        setTotalPages(Math.ceil((totalCount ?? 0) / POSTS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching search results:', error);
        setPosts([]);
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
    setReadPosts(storedReadPosts);
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
      const readPostsKey = currentUser?.id ? `readPosts_${currentUser.id}` : 'readPosts';
      setReadPosts((prev) => {
        if (!prev.includes(post.id.toString())) {
          const newReadPosts = [...prev, post.id.toString()];
          localStorage.setItem(readPostsKey, JSON.stringify(newReadPosts));
          return newReadPosts;
        }
        return prev;
      });

      if (currentUser?.donation_id) {
        try {
          await addDonationPoints(currentUser.id, currentUser.donation_id, 5);
        } catch (error) {
          console.error('Error adding donation points:', error);
        }
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

  if (loading) return <p>Loading...</p>;
  if (posts.length === 0) return <p>No results found.</p>;

  return (
    <div>
      {posts.map((post) => (
        <RepostItem
          key={post.id}
          post={post}
          currentUser={currentUser}
          onPostClick={handlePostClick}
          isRead={readPosts.includes(post.id.toString())}
        />
      ))}
      <div className="flex justify-between items-center mt-4">
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
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUser} onClose={closePopup} />
      )}
    </div>
  );
}
