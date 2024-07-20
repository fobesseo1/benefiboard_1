'use client';

import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';

interface IconToggleProps {
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
  showEditDelete: boolean;
}

const IconToggle: React.FC<IconToggleProps> = ({ onEdit, onDelete, onReply, showEditDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIcons = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative flex flex-col items-end">
      <div className="cursor-pointer" onClick={toggleIcons}>
        <BiDotsVerticalRounded
          size={36}
          className={isExpanded ? 'text-emerald-200' : 'text-gray-400'}
        />
      </div>
      {isExpanded && (
        <div className=" absolute right-0 top-full  flex flex-col items-end gap-3 p-2 z-10 bg-white">
          {showEditDelete && (
            <>
              <p
                onClick={onEdit}
                className="text-sm tracking-tighter bg-emerald-200  border-gray-200 cursor-pointer min-w-16 min-h-8  flex items-center justify-center shadow-md rounded-md"
              >
                수정
              </p>
              <p
                onClick={onDelete}
                className="text-sm tracking-tighter bg-emerald-200  border-gray-200 cursor-pointer min-w-16 min-h-8  flex items-center justify-center shadow-md rounded-md"
              >
                삭제
              </p>
            </>
          )}
          <p
            onClick={onReply}
            className="text-sm tracking-tighter bg-emerald-200  border-gray-200 cursor-pointer min-w-16 min-h-8  flex items-center justify-center shadow-md rounded-md"
          >
            댓글
          </p>
        </div>
      )}
    </div>
  );
};

export default IconToggle;
