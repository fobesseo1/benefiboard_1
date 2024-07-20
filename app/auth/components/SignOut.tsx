import { Button } from '@/components/ui/button';
import createSupabaseServerClient from '@/lib/supabse/server';
import { redirect } from 'next/navigation';

export default async function SignOut() {
  const logout = async () => {
    'use server';

    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/goodbye');
  };

  return (
    <div className="w-full flex justify-end -mt-4 mb-12">
      <form action={logout} className="w-1/3">
        <Button variant="outline" className="w-full">
          로그아웃
        </Button>
      </form>
    </div>
  );
}
