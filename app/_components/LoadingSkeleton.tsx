// app/_component/LoadingSkeleton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

const PostItemSkeleton: React.FC = () => (
  <div className="opacity-75 pt-8 mx-8 lg:pt-0 lg:mx-0">
    {/* Mobile view */}
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden">
      <div className="flex justify-between items-center">
        <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
        <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
      </div>
      <div className="flex-1 pt-2 pb-2">
        <div className="bg-gray-200 h-6 w-full rounded"></div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
        {/* <div className="flex gap-1">
          <div className="bg-gray-200 h-4 w-8 rounded"></div>
          <div className="bg-gray-200 h-4 w-8 rounded"></div>
          <div className="bg-gray-200 h-4 w-8 rounded"></div>
        </div> */}
      </div>
    </div>

    {/* Desktop view */}
    <div className="hidden lg:flex w-[948px] gap-4 items-center py-2 bg-white border-b-[1px] border-gray-200">
      <div className="w-[160px]">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
      </div>
      <div className="w-[520px]">
        <div className="bg-gray-200 h-6 w-full rounded"></div>
      </div>
      <div className="w-[100px]">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
      </div>
      <div className="flex gap-1 w-[120px]">
        <div className="bg-gray-200 h-4 w-8 rounded"></div>
        <div className="bg-gray-200 h-4 w-8 rounded"></div>
        <div className="bg-gray-200 h-4 w-8 rounded"></div>
      </div>
      <div className="w-[48px]">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
      </div>
    </div>
  </div>
);

const LoadingSkeleton: React.FC<{ isTopPosts?: boolean }> = ({ isTopPosts = false }) => {
  return (
    <div className="relative lg:w-[948px] mx-auto w-full animate-pulse ">
      <div className="lg:hidden">
        {[...Array(10)].map((_, index) => (
          <PostItemSkeleton key={index} />
        ))}
      </div>
      <div className="hidden lg:block">
        {[...Array(16)].map((_, index) => (
          <PostItemSkeleton key={index} />
        ))}
      </div>

      {isTopPosts && (
        <div className="absolute w-8 h-8 -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 rounded-full"></div>
      )}

      {/* {!isTopPosts && (
        <div className="flex justify-between items-center mt-4 lg:w-[948px] mx-auto">
          <Button disabled>Previous Page</Button>
          <span className="text-gray-400">Page ... of ...</span>
          <Button disabled>Next Page</Button>
        </div>
      )} */}
    </div>
  );
};

export default LoadingSkeleton;
