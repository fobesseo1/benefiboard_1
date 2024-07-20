'use client';

import { useState } from 'react';
import { BiPencil, BiUpArrowAlt, BiDownArrowAlt, BiDotsVerticalRounded } from 'react-icons/bi';
import { useRouter, usePathname } from 'next/navigation';

export default function FixedIconGroup() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleIcons = () => {
    setIsExpanded(!isExpanded);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handlePencilClick = () => {
    const categoryId = pathname.split('/').pop(); // 현재 URL에서 카테고리 ID 추출
    router.push(`/post/create?categoryId=${categoryId}`);
  };

  return (
    <div className="flex flex-col gap-4 fixed bottom-20 right-4 items-center">
      {isExpanded && (
        <>
          <div
            className="w-11 h-11 bg-emerald-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            onClick={handlePencilClick}
          >
            <BiPencil size={32} color="white" />
          </div>
          <div
            className="w-11 h-11 bg-emerald-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            onClick={scrollToTop}
          >
            <BiUpArrowAlt size={32} color="white" />
          </div>
          <div
            className="w-11 h-11 bg-emerald-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            onClick={scrollToBottom}
          >
            <BiDownArrowAlt size={32} color="white" />
          </div>
        </>
      )}
      <div
        className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        onClick={toggleIcons}
      >
        <BiDotsVerticalRounded size={36} color="white" />
      </div>
    </div>
  );
}
