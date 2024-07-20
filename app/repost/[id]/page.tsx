// app/repost/[id]/page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import RepostDetailClient from '../_component/RepostDetailClient';
import { getCurrentUser } from '@/lib/cookies';
import Ad_Handler from '@/app/_components/Ad_Handler';
import { CurrentUserType } from '@/types/types';

export default async function RepostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const pagePath = 'repost/detail';

  const supabase = await createSupabaseServerClient();
  const { data: repost, error } = await supabase
    .from('repost_data')
    .select('*')
    .eq('id', id)
    .single();
  const link = repost?.link;

  const currentUser: CurrentUserType | null = await getCurrentUser();

  console.log('repost[id]', repost);
  console.log('currentUser_repost[id]', currentUser);

  return (
    <>
      <RepostDetailClient id={id} link={link} authorId={`repostId`} currentUser={currentUser} />
      {/* Ad 추가 */}
      {/* <Ad_Handler currentUser={currentUser} postId={id} authorId={repost.id} pagePath={pagePath} /> */}
    </>
  );
}
