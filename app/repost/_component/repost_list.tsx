// app/repost/_component/repost_list.tsx

'use client';

import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import SiteFilter, { siteColors } from './SiteFilter';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import { CurrentUserType, RepostType } from '@/types/types';
import { Button } from '@/components/ui/button';
import { fetchLatestBatches } from '../_actions/fetchRepostData';
import { fetchLatestBestBatches } from '../best/utils';

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  isBestPosts: boolean;
  initialSearchTerm?: string;
  totalCount: number;
};

const POSTS_PER_PAGE = 20;

export default function Repost_list({
  initialPosts,
  currentUser,
  isBestPosts,
  initialSearchTerm = '',
  totalCount: initialTotalCount,
}: RepostDataProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [page, setPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      const fetchFunction = isBestPosts ? fetchLatestBestBatches : fetchLatestBatches;
      const { data: newPosts, totalCount: newTotalCount } = await fetchFunction(
        pageNum,
        POSTS_PER_PAGE
      );
      if (newPosts) {
        setPosts(newPosts);
        setTotalCount(newTotalCount);
      }
    },
    [isBestPosts]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handlePostClick = useCallback(
    async (post: RepostType) => {
      setSelectedPost(post);
      setShowPopup(true);

      if (currentUser && currentUser.donation_id) {
        addDonationPoints(currentUser.id, currentUser.donation_id, 5)
          .then(() => console.log('Donation points added successfully'))
          .catch((error) => console.error('Error adding donation points:', error));
      }
    },
    [currentUser]
  );

  const handleSiteToggle = useCallback(
    (site: string) => {
      setSelectedSites((prev) => {
        const newSelectedSites =
          site === '전체'
            ? []
            : prev.includes(site)
              ? prev.filter((s) => s !== site)
              : [...prev, site];
        return newSelectedSites;
      });
      const baseUrl = isBestPosts ? '/repost/best' : '/repost';
      router.push(`${baseUrl}?page=1`);
    },
    [router, isBestPosts]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const baseUrl = isBestPosts ? '/repost/best' : '/repost';
      router.push(`${baseUrl}?page=${newPage}`);
      setPage(newPage);
    },
    [router, isBestPosts]
  );

  const filteredPosts = posts.filter(
    (post) => selectedSites.length === 0 || selectedSites.includes(post.site)
  );

  return (
    <div>
      <SiteFilter selectedSites={selectedSites} onSiteToggle={handleSiteToggle} />
      {filteredPosts.map((post) => (
        <div
          key={`${post.id}-${post.site}`}
          className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto"
        >
          <div className="flex justify-between items-center">
            <Badge className={classNames(`bg-${siteColors[post.site] || 'gray'}-500`)}>
              {post.site || '아무거나'}
            </Badge>
            <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
          </div>
          <div className="flex-1 pt-2 pb-2 cursor-pointer" onClick={() => handlePostClick(post)}>
            <p className="font-semibold line-clamp-1 leading-tight tracking-tighter">
              {post.title}
            </p>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => handlePageChange(Math.max(page - 1, 1))} disabled={page === 1}>
          이전 페이지
        </Button>
        <span className="text-sm text-gray-700">
          전체 {totalPages} 중 {page}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          다음 페이지
        </Button>
      </div>
      {showPopup && selectedPost && (
        <RepostPopup
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
