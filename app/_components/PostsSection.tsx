// app/_components/PostsSection.tsx

import { CurrentUserType, PostType } from '@/types/types';
import TopPosts from './TopPosts';

interface PostsSectionProps {
  posts: PostType[];
  currentUser: CurrentUserType | null;
}

export default function PostsSection({ posts, currentUser }: PostsSectionProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center lg:w-[948px] lg:mt-4">
      <h2 className="text-center text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
      <TopPosts posts={posts} currentUser={currentUser} />
    </div>
  );
}
