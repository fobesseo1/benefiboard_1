// app/repost/_component/RepostSearchList.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);

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
      }
      setLoading(false);
    },
    [isBestPosts]
  );

  useEffect(() => {
    const currentSearchTerm = searchParams.get('query') || initialSearchTerm;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    setSearchTerm(currentSearchTerm);
    setPage(currentPage);
    fetchSearchResults(currentSearchTerm, currentPage);
  }, [searchParams, initialSearchTerm, fetchSearchResults]);

  useEffect(() => {
    const readPostsKey = currentUser?.id ? `readPosts_${currentUser.id}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
    setReadPosts(storedReadPosts);
  }, [currentUser]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.push(`${isBestPosts ? '/repost/best' : '/repost'}?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const handlePostClick = async (post: RepostType) => {
    const readPostsKey = currentUser?.id ? `readPosts_${currentUser.id}` : 'readPosts';
    const updatedReadPosts = Array.from(new Set([...readPosts, post.id.toString()]));
    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    if (currentUser?.donation_id) {
      try {
        await addDonationPoints(currentUser.id, currentUser.donation_id, 5);
      } catch (error) {
        console.error('Error adding donation points:', error);
      }
    }

    setSelectedPost(post);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <RepostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            onPostClick={handlePostClick}
            isRead={readPosts.includes(post.id.toString())}
          />
        ))
      ) : (
        <p>No results found.</p>
      )}
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
