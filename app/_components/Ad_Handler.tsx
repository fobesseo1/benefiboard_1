//app/_components/Ad_Handler.tsx

'use client';

import React, { useEffect, useState } from 'react';
import AdAlert from '../post/_component/AdAlert';
import { CurrentUserType } from '@/types/types';

const Ad_Handler = ({
  postId,
  authorId,
  pagePath,
  currentUser,
}: {
  postId: string;
  authorId: string;
  pagePath: string;
  currentUser: CurrentUserType | null;
}) => {
  const [initialPoints, setInitialPoints] = useState<number>(
    currentUser ? currentUser.current_points : 0
  );

  useEffect(() => {
    if (currentUser) {
      setInitialPoints(currentUser.current_points);
    }
  }, [currentUser]);

  const animationExecuted =
    typeof window !== 'undefined' && localStorage.getItem(`post${postId}_animation_executed`);

  console.log('Rendering Ad_Handler', { currentUser, postId, animationExecuted });

  if (animationExecuted) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999]">
      <AdAlert
        userId={currentUser?.id ?? null}
        postId={postId}
        author_id={authorId}
        initialPoints={initialPoints}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Ad_Handler;
