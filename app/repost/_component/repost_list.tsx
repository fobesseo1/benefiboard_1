// app/repost/_component/repost_list.tsx

'use client';

'use client';

import * as React from 'react';
import { useCallback, useState, useEffect, useMemo } from 'react';
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

const RepostItem = React.memo(
  ({ post, isRead, onClick }: { post: RepostType; isRead: boolean; onClick: () => void }) => (
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto">
      <div className="flex justify-between items-center">
        <Badge className={classNames(`bg-${siteColors[post.site] || 'gray'}-500`)}>
          {post.site || '아무거나'}
        </Badge>
        <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
      </div>
      <div className="flex-1 pt-2 pb-2 cursor-pointer" onClick={onClick}>
        <p
          className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
            isRead ? 'text-gray-400' : ''
          }`}
        >
          {post.title}
        </p>
      </div>
    </div>
  )
);

RepostItem.displayName = 'RepostItem';

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
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    const readPostsKey = 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '{}');
    const now = new Date().getTime();

    // Remove posts older than 24 hours
    const updatedReadPosts = Object.entries(storedReadPosts).reduce(
      (acc, [id, timestamp]) => {
        if (now - Number(timestamp) < 24 * 60 * 60 * 1000) {
          acc[id] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    );

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));
  }, []);

  const handlePostClick = useCallback(
    async (post: RepostType) => {
      setSelectedPost(post);
      setShowPopup(true);

      // Mark post as read
      const newReadPosts = { ...readPosts, [post.id]: true };
      setReadPosts(newReadPosts);
      localStorage.setItem(
        'readPosts',
        JSON.stringify({
          ...JSON.parse(localStorage.getItem('readPosts') || '{}'),
          [post.id]: new Date().getTime(),
        })
      );

      if (currentUser && currentUser.donation_id) {
        addDonationPoints(currentUser.id, currentUser.donation_id, 5)
          .then(() => console.log('Donation points added successfully'))
          .catch((error) => console.error('Error adding donation points:', error));
      }
    },
    [currentUser, readPosts]
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

  const filteredPosts = useMemo(
    () => posts.filter((post) => selectedSites.length === 0 || selectedSites.includes(post.site)),
    [posts, selectedSites]
  );

  return (
    <div>
      <SiteFilter selectedSites={selectedSites} onSiteToggle={handleSiteToggle} />
      {filteredPosts.map((post) => (
        <RepostItem
          key={`${post.id}-${post.site}`}
          post={post}
          isRead={readPosts[post.id] || false}
          onClick={() => handlePostClick(post)}
        />
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
