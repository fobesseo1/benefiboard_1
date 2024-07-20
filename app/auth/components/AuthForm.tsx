'use client';

import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import GithubButton from './OAuthForm_Github';
import GoogleButton from './OAuthForm_Google';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

export function AuthForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(
    null
  );

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      setMessage({ type: 'success', content: decodeURIComponent(success) });
    } else if (error) {
      setMessage({ type: 'error', content: decodeURIComponent(error) });
    }
  }, [searchParams]);

  return (
    <div className="w-full space-y-6">
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertTitle>{message.type === 'success' ? '성공' : '오류'}</AlertTitle>
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="signin" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">로그인</TabsTrigger>
          <TabsTrigger value="register">회원가입</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      <hr />
      <div className="flex flex-col gap-4">
        <GoogleButton />
        <GithubButton />
      </div>
    </div>
  );
}
