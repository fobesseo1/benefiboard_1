// app/_components/PostsSection.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { CurrentUserType, PostType } from '@/types/types';
import TopPosts from './TopPosts';

interface PostsSectionProps {
  postsPromise: Promise<PostType[]>;
  currentUser: CurrentUserType | null;
}

export default function PostsSection({ postsPromise, currentUser }: PostsSectionProps) {
  const initialPosts = use(postsPromise);
  const [posts, setPosts] = useState<PostType[]>(initialPosts);

  useEffect(() => {
    // 여기서 필요하다면 추가적인 로직을 구현할 수 있습니다.
    // 예를 들어, 로컬 스토리지를 사용한 캐싱 등
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <div className="w-full flex flex-col justify-center items-center lg:w-[948px] lg:mt-4">
      <h2 className="text-center text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
      <TopPosts posts={posts} currentUser={currentUser} />
    </div>
  );
}
