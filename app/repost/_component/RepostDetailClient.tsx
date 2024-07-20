'use client';

import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';

import { useState } from 'react';
import AdIntermediatePage from './AdIntermediatePage';

interface RepostDetailClientProps {
  id: string;
  link: string | null;
  currentUser: any;
  authorId: string;
}

export default function RepostDetailClient({
  id,
  link,
  currentUser,
  authorId,
}: RepostDetailClientProps) {
  const router = useRouter();
  const [showIntermediate, setShowIntermediate] = useState(false);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <>
        <div className="flex items-center mb-4">
          <BiArrowBack size={24} onClick={handleBackClick} className="cursor-pointer" />
          <h2 className="ml-2 text-xl font-semibold">Detail Repost</h2>
        </div>

        <AdIntermediatePage
          currentUser={currentUser}
          postId={id}
          authorId={authorId}
          pagePath="repost/detail"
          targetLink={link ? decodeURIComponent(link) : '/'}
        />
      </>
    </div>
  );
}
