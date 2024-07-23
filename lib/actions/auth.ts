'use server';

import createSupabaseServerClient from '../supabse/server';

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error: dataError } = await supabase
      .from('userdata')
      .select(
        'id, username, email, avatar_url, current_points, donation_id, partner_name, unread_messages_count'
      )
      .eq('id', user.id)
      .single();

    if (dataError) throw dataError;

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
