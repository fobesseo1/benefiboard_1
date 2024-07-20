'use server';
import createSupabaseServerClient from '@/lib/supabse/server';

// 고유 식별자를 생성하는 함수
function generateUniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// 파일 이름을 안전하게 변환하는 함수
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// 이미지 업로드
export async function uploadImageToSupabase(file: File, user_id: string) {
  const supabase = await createSupabaseServerClient();
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const sanitizedFileName = sanitizeFileName(file.name);
  const fileName = `${user_id}/${uniqueSuffix}-${sanitizedFileName}`;
  console.log('Uploading file:', fileName); // 로그 추가
  const { data, error } = await supabase.storage.from('images').upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error); // 로그 추가
    throw new Error(error.message);
  }

  const url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
  console.log('Uploaded file URL:', url); // 로그 추가

  return { url };
}

// 이미지 삭제
export async function deleteImageFromSupabase(url: string) {
  const supabase = await createSupabaseServerClient();
  // URL에서 폴더와 파일 이름을 추출
  const fileName = url.split('/').slice(-2).join('/'); // 마지막 두 개의 경로 요소를 조합하여 파일 경로 생성
  console.log('Deleting file:', fileName); // 로그 추가
  const { error } = await supabase.storage.from('images').remove([fileName]);

  if (error) {
    console.error('Error deleting image:', error); // 로그 추가
    throw new Error(error.message);
  }

  console.log('Image deleted:', fileName); // 로그 추가
}

// 아바타 업로드
export async function uploadAvatarToSupabase(file: File, path: string) {
  const supabase = await createSupabaseServerClient();
  const sanitizedFileName = sanitizeFileName(file.name);
  const fileName = `${path}/${sanitizedFileName}`;
  console.log('Uploading file:', fileName); // 로그 추가
  const { data, error } = await supabase.storage.from('avatars').upload(fileName, file);

  if (error) {
    console.error('Error uploading avatars:', error); // 로그 추가
    throw new Error(error.message);
  }

  const url = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
  console.log('avatars Uploaded file URL:', url); // 로그 추가

  return { url };
}

// 아바타 삭제
export async function deleteAvatarFromSupabase(url: string) {
  const supabase = await createSupabaseServerClient();
  // URL에서 폴더와 파일 이름을 추출
  const fileName = url.split('/').slice(-3).join('/'); // 마지막 두 개의 경로 요소를 조합하여 파일 경로 생성
  console.log('Deleting file:', fileName); // 로그 추가
  const { error } = await supabase.storage.from('avatars').remove([fileName]);

  if (error) {
    console.error('Error deleting avatars:', error); // 로그 추가
    throw new Error(error.message);
  }

  console.log('avatars deleted:', fileName); // 로그 추가
}
