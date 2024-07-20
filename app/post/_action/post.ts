// app>post>_action>post.ts

'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImageToSupabase, deleteImageFromSupabase } from './image';

export async function createPost(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // FormData에서 개별 값 추출
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const content_type = formData.get('content_type') as string; // 추가: 콘텐츠 타입
  const user_id = formData.get('user_id') as string;
  const user_name = formData.get('user_name') as string;
  const user_avatar_url = formData.get('user_avatar_url') as string;
  const user_email = formData.get('user_email') as string;
  const linkUrl1 = formData.get('linkUrl1') as string;
  const linkUrl2 = formData.get('linkUrl2') as string;
  const parent_category_id = formData.get('parent_category_id') as string;
  const child_category_id = formData.get('child_category_id') as string;

  // FormData에서 이미지 파일 가져오기
  const imageFiles = formData.getAll('images') as File[];

  // 이미지 업로드
  let imageUrls: string[] = [];
  if (imageFiles.length > 0) {
    const validImageFiles = imageFiles.filter((image) => image.size > 0);

    if (validImageFiles.length > 0) {
      const uploadPromises = validImageFiles.map((image) => uploadImageToSupabase(image, user_id));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.url);
    }
  }

  // 데이터베이스에 삽입할 객체 생성
  const post = {
    title: title,
    content: content,
    content_type: content_type, // 추가: 콘텐츠 타입
    author_id: user_id,
    author_name: user_name,
    author_avatar_url: user_avatar_url,
    author_email: user_email,
    linkUrl1: linkUrl1,
    linkUrl2: linkUrl2,
    images: imageUrls.length > 0 ? imageUrls : null,
    parent_category_id: parent_category_id || null,
    child_category_id: child_category_id || null,
  };

  // Supabase에 데이터 삽입
  const { data, error } = await supabase.from('post').insert([post]);

  if (error) {
    throw new Error(error.message);
  } else {
    revalidatePath('/post');
    redirect('/post');
  }
}

export async function fetchPostById(post_id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('post').select('*').eq('id', post_id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePostById(formData: FormData, id: string, user_id: string) {
  console.log('formData:', formData); // 로그 추가
  const supabase = await createSupabaseServerClient();

  // FormData에서 개별 값 추출
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const linkUrl1 = formData.get('linkUrl1') as string;
  const linkUrl2 = formData.get('linkUrl2') as string;
  const deletedImages = JSON.parse(formData.get('deletedImages') as string) as string[];
  console.log('Updating post for id:', id); // 로그 추가

  // 기존 포스트의 데이터를 가져오기
  const { data: existingPost, error: fetchError } = await supabase
    .from('post')
    .select('images')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching existing post:', fetchError); // 로그 추가
    throw new Error(fetchError.message);
  }

  // 기존 이미지에서 삭제할 이미지를 제거하고 스토리지에서 삭제
  const remainingImages = (existingPost.images || []).filter((url: string) => {
    const shouldDelete = deletedImages.includes(url);
    if (shouldDelete) {
      deleteImageFromSupabase(url); // 스토리지에서 파일 삭제
    }
    return !shouldDelete;
  });

  // FormData에서 이미지 파일 가져오기
  const imageFiles = formData.getAll('images') as File[];
  console.log('Updating imageFiles:', imageFiles); // 로그 추가

  // 이미지 업로드
  let newImageUrls: string[] = [];
  if (imageFiles.length > 0) {
    // 파일 배열을 용량이 0이 아닌 파일만 남기도록 필터링
    const validImageFiles = imageFiles.filter((image) => image.size > 0);

    if (validImageFiles.length > 0) {
      const uploadPromises = validImageFiles.map((image) => uploadImageToSupabase(image, user_id));
      const uploadResults = await Promise.all(uploadPromises);
      newImageUrls = uploadResults.map((result) => result.url);
      newImageUrls.forEach((url) => console.log('Image URL:', url)); // 로그 추가
    } else {
      console.log('There are no valid image files to upload.');
    }
  } else {
    console.log('No image files provided.');
  }

  // 업데이트할 객체 생성
  const allImageUrls = [...remainingImages, ...newImageUrls];
  const updates = {
    title: title,
    content: content,
    linkUrl1: linkUrl1,
    linkUrl2: linkUrl2,
    images: allImageUrls.length > 0 ? allImageUrls : null, // 이미지 URL 포함
  };

  // Supabase에 데이터 업데이트
  const { data, error } = await supabase.from('post').update(updates).eq('id', id);

  if (error) {
    console.error('Error updating post:', error); // 로그 추가
    throw new Error(error.message);
  } else {
    console.log('Post updated successfully:', data); // 로그 추가
    revalidatePath('/post');
    redirect('/post');
  }

  return data;
}

export async function deletePostById(id: string) {
  const supabase = await createSupabaseServerClient();

  // 포스트에 연결된 이미지를 먼저 가져옵니다
  const { data: post, error: fetchError } = await supabase
    .from('post')
    .select('images')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching post:', fetchError); // 로그 추가
    throw new Error(fetchError.message);
  }

  // 이미지가 있는 경우 스토리지에서 삭제합니다
  if (post?.images) {
    const deletePromises = post.images.map((url: string) => deleteImageFromSupabase(url));
    await Promise.all(deletePromises);
  }

  // 포스트를 삭제합니다
  const { data, error } = await supabase.from('post').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  } else {
    console.log('Post deleted successfully:', data);
    revalidatePath('/post');
    redirect('/post');
  }

  return data;
}
