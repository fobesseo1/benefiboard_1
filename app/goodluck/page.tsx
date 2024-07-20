import { getCurrentUser } from '@/lib/cookies';
import GoodluckTabs from './_components/GoodluckTabs';
import createSupabaseServerClient from '@/lib/supabse/server';
import AdPopupWrapper from '../post/_component/AdPopupWrapper';
import { CurrentUserType } from '@/types/types';

export default async function GoodluckPage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const id = 'Goodluck';
  const donationPoints = 50;

  return (
    <div className="flex flex-col items-center pb-16">
      <GoodluckTabs />

      <AdPopupWrapper
        currentUser={currentUser}
        postId={id}
        authorId={`Goodluck`}
        donationPoints={donationPoints}
      />
    </div>
  );
}
