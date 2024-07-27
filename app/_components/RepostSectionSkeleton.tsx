import React from 'react';

const RepostSectionSkeleton = () => {
  return (
    <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
      <div className="h-8 w-3/4 bg-gray-200 rounded my-4 animate-pulse"></div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className="py-2 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
      <div className="relative h-12 mt-4">
        <div className="absolute w-24 h-12 bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default RepostSectionSkeleton;
