// app/repost/_component/repost_list.tsx
'use client';

import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import { fetchReposts, fetchBestReposts } from '../_actions/repostActions';
import SiteFilter, { siteColors } from './SiteFilter';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import { CurrentUserType, RepostType } from '@/types/types';
import { Button } from '@/components/ui/button';

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  isBestPosts: boolean;
  initialSearchTerm?: string;
  searchTerm?: string;
};

const POSTS_PER_PAGE = 20;

export default function Repost_list({
  initialPosts,
  currentUser,
  isBestPosts,
  initialSearchTerm = '',
  searchTerm: propSearchTerm = '',
}: RepostDataProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [allPosts, setAllPosts] = useState<RepostType[]>(initialPosts);
  const [currentUserState, setCurrentUserState] = useState<CurrentUserType | null>(currentUser);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const userId = currentUser?.id;

  const urlSearchTerm = searchParams.get('query');
  const effectiveSearchTerm = propSearchTerm || urlSearchTerm || initialSearchTerm;

  const baseUrl = isBestPosts ? '/repost/best' : '/repost';

  const filteredPosts = useMemo(() => {
    return allPosts.filter(
      (post) => selectedSites.length === 0 || selectedSites.includes(post.site)
    );
  }, [allPosts, selectedSites]);

  const totalPages = useMemo(
    () => Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    [filteredPosts]
  );

  const currentPagePosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, page]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: newPosts } = isBestPosts
        ? await fetchBestReposts(
            effectiveSearchTerm,
            Math.ceil(allPosts.length / POSTS_PER_PAGE) + 1,
            POSTS_PER_PAGE,
            selectedSites
          )
        : await fetchReposts(
            effectiveSearchTerm,
            Math.ceil(allPosts.length / POSTS_PER_PAGE) + 1,
            POSTS_PER_PAGE,
            selectedSites
          );

      setAllPosts((prev) => [...prev, ...newPosts]);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
    setLoading(false);
  }, [allPosts.length, effectiveSearchTerm, isBestPosts, loading, selectedSites]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    router.push(`${baseUrl}?${newSearchParams.toString()}`, { scroll: false });
    scrollToTop();
  }, [page, router, searchParams, scrollToTop, baseUrl]);

  useEffect(() => {
    setCurrentUserState(currentUser);
  }, [currentUser]);

  useEffect(() => {
    const readPostsKey = userId ? `readPosts_${userId}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
    setReadPosts(storedReadPosts);
  }, [userId]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      loadMorePosts();
    }
  }, [page, totalPages, loadMorePosts]);

  const handlePostClick = async (post: RepostType) => {
    const readPostsKey = userId ? `readPosts_${userId}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

    const updatedReadPosts = Array.from(new Set([...storedReadPosts, post.id.toString()]));

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    if (currentUserState && currentUserState.donation_id) {
      try {
        await addDonationPoints(currentUserState.id, currentUserState.donation_id, 5);
      } catch (error) {
        console.error('Error adding donation points:', error);
      }
    }

    setSelectedPost(post);
    setShowPopup(true);
  };

  const isPostRead = useCallback(
    (postId: string) => {
      return readPosts.includes(postId);
    },
    [readPosts]
  );

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  const getBadgeColor = useCallback((site: string) => {
    return siteColors[site] || 'gray';
  }, []);

  const handleSiteToggle = useCallback(
    (site: string) => {
      setSelectedSites((prev) => {
        const newSelectedSites =
          site === '전체'
            ? []
            : prev.includes(site)
              ? prev.filter((s) => s !== site)
              : [...prev, site];

        setPage(1);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', '1');
        router.push(`${baseUrl}?${newSearchParams.toString()}`, { scroll: false });

        return newSelectedSites;
      });
    },
    [searchParams, router, baseUrl]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div>
      <SiteFilter selectedSites={selectedSites} onSiteToggle={handleSiteToggle} />
      {currentPagePosts.length ? (
        currentPagePosts.map((post) => (
          <div key={`${post.id}-${post.site}`}>
            <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto">
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
      {loading && <p>Loading more posts...</p>}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          이전 페이지
        </Button>
        <span className="text-sm text-gray-700">
          전체 {totalPages} 중 {page}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages && !loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          다음 페이지
        </Button>
      </div>
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUserState} onClose={closePopup} />
      )}
    </div>
  );
}
