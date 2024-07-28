'use client';

import { useState, useEffect, useMemo } from 'react';
import { CurrentUserType, PostType } from '@/types/types';
import PagedPosts from '../post/_component/PagedPosts_Router';

interface PostsSectionProps {
  initialPosts: PostType[];
  currentUser: CurrentUserType | null;
}

export default function PostsSection({ initialPosts, currentUser }: PostsSectionProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Memoize the PagedPosts component
  const MemoizedPagedPosts = useMemo(
    () => (
      <PagedPosts
        initialPosts={posts}
        currentUser={currentUser}
        userId={currentUser?.id ?? null}
        isTopPosts={true}
      />
    ),
    [posts, currentUser]
  );

  return (
    <div className="flex flex-col justify-center items-center mx-4 lg:w-[948px] lg:mt-4">
      <h2 className="text-center text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
      {MemoizedPagedPosts}
    </div>
  );
}
