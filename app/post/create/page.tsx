// app/post/create/page.tsx
import PostForm from '../_component/PostForm';
import { getCurrentUser } from '@/lib/cookies';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CurrentUserType } from '@/types/types';

export default async function PostCreatePage({
  searchParams,
}: {
  searchParams: { categoryId?: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const categoryId = searchParams.categoryId || '';

  console.log('Post createPage categoryId:', categoryId);

  if (!currentUser) {
    console.log('nonono');
    return (
      <div className="w-screen h-height-minus-146 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center gap-6 mx-6  shadow-lg">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>로그인 후 포스트 작성해주세요 ♡</AlertTitle>
            <AlertDescription>현재 로그인이 되지 않았어요. 확인해 주세요.</AlertDescription>
            <AlertDescription>
              <div className="mt-4 pt-4 border-t-[1px] border-gray-200 ">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/post">홈으로가기</Link>
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
    <div>
      <PostForm
        user_id={currentUser.id}
        user_name={currentUser.username || ''}
        user_avatar_url={currentUser.avatar_url || ''}
        user_email={currentUser.email || ''}
        initialParentCategoryId={categoryId}
      />
    </div>
  );
}
