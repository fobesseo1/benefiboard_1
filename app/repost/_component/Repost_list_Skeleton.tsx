// app/repost/_component/Repost_list_Skeleton.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const RepostItemSkeleton: React.FC = () => (
  <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-20 h-6 bg-gray-200 rounded"></div>
      <div className="w-24 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="flex-1 pt-2 pb-2">
      <div className="w-full h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Repost_list_Skeleton: React.FC = () => {
  return (
    <div>
      {/* SiteFilter Skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[...Array(8)].map((_, index) => (
          <Badge key={index} className="bg-gray-200 animate-pulse">
            <div className="w-16 h-4"></div>
          </Badge>
        ))}
      </div>

      {/* RepostItems Skeleton */}
      {[...Array(10)].map((_, index) => (
        <RepostItemSkeleton key={index} />
      ))}

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <Button disabled className="opacity-50">
          이전 페이지
        </Button>
        <span className="text-sm text-gray-400">로딩 중...</span>
        <Button disabled className="opacity-50">
          다음 페이지
        </Button>
      </div>
    </div>
  );
};

export default Repost_list_Skeleton;
