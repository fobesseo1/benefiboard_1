'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/goodbye');
}
