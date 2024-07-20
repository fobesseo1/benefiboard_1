//app>auth>actions>index.ts

'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { cookies } from 'next/headers';

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  username: string;
  userType: 'regular' | 'partner';
  category?: string;
  partner_name?: string;
}) {
  const supabase = await createSupabaseServerClient();

  try {
    // 이메일과 닉네임 중복 확인
    const isEmailAvailable = await checkEmailAvailability(data.email);
    const isUsernameAvailable = await checkUsernameAvailability(data.username);

    if (!isEmailAvailable) {
      return { success: false, message: '이미 사용 중인 이메일입니다.' };
    }

    if (!isUsernameAvailable) {
      return { success: false, message: '이미 사용 중인 닉네임입니다.' };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          user_type: data.userType,
          category: data.category,
          partner_name: data.partner_name,
        },
      },
    });

    if (authError) {
      return { success: false, message: '회원가입 오류: ' + authError.message };
    }

    if (!authData.user) {
      return { success: false, message: '사용자 데이터가 생성되지 않았습니다.' };
    }

    // userdata 테이블에 사용자 정보 추가
    const { error: insertError } = await supabase.from('userdata').insert({
      id: authData.user.id,
      email: data.email,
      username: data.username,
      user_type: data.userType,
      category: data.category,
      partner_name: data.partner_name,
    });

    if (insertError) {
      console.error('Error inserting user data:', insertError);
      return { success: false, message: '사용자 데이터 저장 중 오류가 발생했습니다.' };
    }

    return { success: true, message: '회원가입을 완료하시려면 이메일을 확인해주세요' };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: '예상치 못한 오류가 발생했습니다.' };
  }
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('userdata')
    .select('username')
    .eq('username', username)
    .single();

  if (error && error.code === 'PGRST116') {
    // PGRST116 error means no rows were returned, so the username is available
    return true;
  }

  return !data;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('userdata')
    .select('email')
    .eq('email', email)
    .single();

  if (error && error.code === 'PGRST116') {
    // PGRST116 error means no rows were returned, so the email is available
    return true;
  }

  return !data;
}

export async function signInWithEmailAndPassword(data: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (result.session) {
    cookies().set('access_token', result.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: result.session.expires_in,
    });

    const userResponse = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email')
      .eq('id', result.user?.id)
      .single();

    if (userResponse.error) {
      return { success: false, message: userResponse.error.message };
    }

    cookies().set('currentUser', JSON.stringify(userResponse.data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return { success: true, message: '로그인 성공' };
  }

  return { success: false, message: '세션 생성에 실패했습니다.' };
}
