// app/_components/PostsSection.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { CurrentUserType, PostType } from '@/types/types';
import PagedPosts from '../post/_component/PagedPosts';

interface PostsSectionProps {
  postsPromise: Promise<PostType[]>;
  currentUser: CurrentUserType | null;
}

export default function PostsSection({ postsPromise, currentUser }: PostsSectionProps) {
  const initialPosts = use(postsPromise);
  const [posts, setPosts] = useState<PostType[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <div className="w-full flex flex-col justify-center items-center lg:w-[948px] lg:mt-4">
      <h2 className="text-center text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
      <PagedPosts
        initialPosts={posts}
        currentUser={currentUser}
        userId={currentUser?.id ?? null}
        isTopPosts={true}
      />
    </div>
  );
}
