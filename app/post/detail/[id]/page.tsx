//app>post>detail>[id]>page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import dynamic from 'next/dynamic';
import { CurrentUserType } from '@/types/types';

// 정적 임포트로 변경
import Breadcrumbs from '../../_component/Breadcrumbs';
import PostHeader from '../../_component/PostHeader';
import PostContent from '../../_component/PostContent';
import ExternalLinks from '../../_component/ExternalLinksComponent';

// 클라이언트 컴포넌트만 동적 임포트
const ClientPostDetail = dynamic(() => import('../../_component/ClientPostDetail'), {
  loading: () => <div>Loading Post Details...</div>,
});

const AdPopupWrapper = dynamic(() => import('../../_component/AdPopupWrapper'), {
  ssr: false,
  loading: () => <div>Loading Ad...</div>,
});

const Ad_Rectangle_Updown = dynamic(() => import('@/app/_components/Ad-Rectangle_Updown'), {
  ssr: false,
  loading: () => <div>Loading Ad...</div>,
});

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = await createSupabaseServerClient();
  const currentUserPromise = getCurrentUser();
  const postPromise = supabase.from('post').select('*').eq('id', id).single();

  const [currentUser, { data: post, error }] = await Promise.all([currentUserPromise, postPromise]);

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  return (
    <div className="relative mx-4 lg:w-[948px] lg:mx-auto">
      <Ad_Rectangle_Updown />
      <hr className="mt-4" />
      <Breadcrumbs category={post?.category} />
      <PostHeader
        title={post?.title}
        author_name={post?.author_name}
        author_email={post?.author_email}
        author_avatar_url={post?.author_avatar_url}
        author_id={post?.author_id}
        author={post?.author}
        views={post?.views}
        comments={post?.comments}
        created_at={post?.created_at}
        point={currentUser?.current_points ?? 0}
      />
      {post?.images && (
        <div className="flex flex-col gap-4">
          {post.images.map((image: string, index: number) => (
            <img key={index} src={image} alt={`Post Image ${index + 1}`} />
          ))}
        </div>
      )}
      <PostContent content={post?.content} contentType={post?.content_type} />
      <ExternalLinks linkUrl1={post?.linkUrl1} linkUrl2={post?.linkUrl2} />
      <Suspense fallback={<div>Loading Post Details...</div>}>
        <ClientPostDetail
          postId={id}
          initialUser={
            currentUser ? { ...currentUser, current_points: currentUser.current_points ?? 0 } : null
          }
          initialPost={post}
        />
      </Suspense>
      <AdPopupWrapper
        currentUser={currentUser}
        postId={id}
        authorId={post?.author_id}
        donationPoints={0}
      />
    </div>
  );
}
