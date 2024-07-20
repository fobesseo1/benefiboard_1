// pages/message/create.tsx
import { redirect } from 'next/navigation';
import MessageForm from '../_component/MessageForm';
import { getCurrentUser } from '@/lib/cookies';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CurrentUserType } from '@/types/types';

export default async function MessageCreatePage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  if (!currentUser) {
    console.log('nonono');
    return (
      <div className="w-screen h-height-minus-146 flex flex-col justify-center items-center lg:w-[948px] mx-auto">
        <div className="flex flex-col items-center justify-center gap-6 mx-6  shadow-lg">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>로그인 후 쪽지를 작성해주세요 ♡</AlertTitle>
            <AlertDescription>현재 로그인이 되지 않았어요. 확인해 주세요.</AlertDescription>
            <AlertDescription>
              <div className="mt-4 pt-4 border-t-[1px] border-gray-200 ">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/message">홈으로가기</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="/auth">로그인 하러가기</Link>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[948px] mx-auto">
      <MessageForm
        sender_id={currentUser.id}
        sender_name={currentUser.username || ''}
        sender_avatar_url={currentUser.avatar_url || ''}
        sender_email={currentUser.email || ''}
      />
    </div>
  );
}
