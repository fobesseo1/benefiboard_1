import { getCurrentUser } from '@/lib/cookies';
import MessageList from './_component/MessageList';
import { CurrentUserType } from '@/types/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function MessagePage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  if (!currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="lg:w-[948px] mx-auto">
      <Link href="/message/create" className="flex justify-end p-4">
        <Button className=" bg-pink-400">메세지 작성하기</Button>
      </Link>
      <MessageList currentUserId={currentUser.id} />
    </div>
  );
}
