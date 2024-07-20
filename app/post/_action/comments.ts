// _action/comments.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

// 댓글 작성
export async function addComment(
  postId: string,
  userId: string,
  author: string,
  content: string,
  parentId: number | null = null
) {
  const supabase = await createSupabaseServerClient();

  // 댓글 추가
  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .insert([{ post_id: postId, user_id: userId, author, content, parent_id: parentId }]);

  if (commentError) {
    throw new Error(commentError.message);
  }

  // 기존 댓글 수 가져오기
  const { data: postData, error: fetchError } = await supabase
    .from('post')
    .select('comments')
    .eq('id', postId)
    .single();

  if (fetchError) {
    throw new Error('Failed to fetch post comments count');
  }

  // 댓글 수 증가
  const newCommentsCount = (postData.comments || 0) + 1;

  const { error: updateError } = await supabase
    .from('post')
    .update({ comments: newCommentsCount })
    .eq('id', postId);

  if (updateError) {
    throw new Error('Failed to update post comments count');
  }

  return commentData;
}

// 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('comments').update({ content }).eq('id', commentId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// 댓글 삭제
export async function deleteComment(commentId: number) {
  const supabase = await createSupabaseServerClient();

  // 댓글을 먼저 가져와서 post_id를 얻음
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('post_id')
    .eq('id', commentId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // 댓글 삭제
  const { data, error } = await supabase.from('comments').delete().eq('id', commentId);

  if (error) {
    throw new Error(error.message);
  }

  // 기존 댓글 수 가져오기
  const { data: postData, error: fetchPostError } = await supabase
    .from('post')
    .select('comments')
    .eq('id', comment.post_id)
    .single();

  if (fetchPostError) {
    throw new Error('Failed to fetch post comments count');
  }

  // 댓글 수 감소
  const newCommentsCount = (postData.comments || 0) - 1;

  const { error: updateError } = await supabase
    .from('post')
    .update({ comments: newCommentsCount })
    .eq('id', comment.post_id);

  if (updateError) {
    throw new Error('Failed to update post comments count');
  }

  return data;
}

// 댓글 가져오기
export const fetchCommentsByPostId = async (postId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
