'use client';

import React, { useEffect, useState, useRef } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDrag } from '@use-gesture/react';
import Ad_Handler from '@/app/_components/Ad_Handler';
import { Button } from '@/components/ui/button';
import Ad_Square_Updown from '@/app/_components/Ad_Square_Updown';
import { CurrentUserType, RepostType } from '@/types/types';

interface RepostPopupProps {
  post: RepostType;
  currentUser: CurrentUserType | null;
  onClose: () => void;
}

export default function RepostPopup({ post, currentUser, onClose }: RepostPopupProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingTimeout, setDraggingTimeout] = useState<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const AD_URL = 'https://link.coupang.com/a/bKbEkY';

  const handleRedirect = () => {
    if (!isDragging) {
      location.href = post.link;
      onClose();
    }
  };

  const bind = useDrag((state) => {
    setIsDragging(state.active);
    if (state.active && draggingTimeout) {
      clearTimeout(draggingTimeout);
      setDraggingTimeout(null);
    }
    if (state.last && !state.active) {
      location.href = post.link;
      onClose();
    }
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(AD_URL, '_blank');
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const timeout = setTimeout(() => {
        setIsDragging(false);
      }, 300);
      setDraggingTimeout(timeout);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg overflow-hidden">
        <div
          {...bind()}
          ref={popupRef}
          className="relative p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-2 right-2 text-xl">
            &times;
          </button>
          <div className="flex items-center mb-4">
            <BiArrowBack size={24} onClick={onClose} className="cursor-pointer" />
            <h2 className="ml-2 text-xl font-semibold">Detail Repost</h2>
          </div>

          <Ad_Square_Updown />

          <Ad_Handler
            currentUser={currentUser}
            postId={post.id.toString()}
            authorId={`repostId`}
            pagePath="repost/detail"
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
              이동 중...
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className=" p-4 -mt-4">
          <Button
            onClick={handleButtonClick}
            className="w-full mt-4 px-4 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            AD 링크로 이동
          </Button>
          <p className="text-center my-2">좌우 스와이프하거나 드래그해도 닫혀요</p>
        </div>
      </div>
    </div>
  );
}
