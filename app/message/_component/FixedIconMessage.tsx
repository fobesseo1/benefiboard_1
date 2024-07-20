// components/FixedIconGroup.tsx
'use client';

import { useState } from 'react';
import { BiPencil, BiUpArrowAlt, BiDownArrowAlt, BiDotsVerticalRounded } from 'react-icons/bi';
import Link from 'next/link';

export default function FixedIconMessage() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIcons = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-4 fixed bottom-20 right-4 items-center">
      {isExpanded && (
        <>
          <div className="w-11 h-11 bg-emerald-200 rounded-full flex items-center justify-center shadow-lg">
            <Link href="/message/create">
              <BiPencil size={32} color="white" />
            </Link>
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
