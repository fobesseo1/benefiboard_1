import { getCurrentUser } from '@/lib/cookies';
import { Suspense, lazy } from 'react';
import Breadcrumbs from '../../_component/Breadcrumbs';
import createSupabaseServerClient from '@/lib/supabse/server';
import dynamic from 'next/dynamic';
import Ad_Rectangle_Updown from '@/app/_components/Ad-Rectangle_Updown';
import { CurrentUserType } from '@/types/types';

const PostHeader = lazy(() => import('../../_component/PostHeader'));
const PostContent = lazy(() => import('../../_component/PostContent'));
const ExternalLinks = lazy(() => import('../../_component/ExternalLinksComponent'));
const ClientPostDetail = lazy(() => import('../../_component/ClientPostDetail'));

const AdPopupWrapper = dynamic(() => import('../../_component/AdPopupWrapper'), { ssr: false });

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase.from('post').select('*').eq('id', id).single();
  const currentUser: CurrentUserType | null = await getCurrentUser();

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  return (
    <div className="relative mx-4 lg:w-[948px] lg:mx-auto">
      <Ad_Rectangle_Updown />
      <Breadcrumbs category={post?.category} />
      <Suspense fallback={<div>Loading Post Header...</div>}>
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
      </Suspense>

      {post?.images && (
        <div className="flex flex-col gap-4">
          {post.images.map((image: string, index: number) => (
            <img key={index} src={image} alt={`Post Image ${index + 1}`} />
          ))}
        </div>
      )}
      <Suspense fallback={<div>Loading Post Content...</div>}>
        <PostContent content={post?.content} contentType={post?.content_type} />
      </Suspense>
      <Suspense fallback={<div>Loading External Links...</div>}>
        <ExternalLinks linkUrl1={post?.linkUrl1} linkUrl2={post?.linkUrl2} />
      </Suspense>
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
