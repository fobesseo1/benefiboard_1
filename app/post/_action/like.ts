// app/post/_action/likes.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

// 좋아요 싫어요 불러오기
export const fetchLikesDislikes = async (post_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('post_likes')
    .select('liked, user_id')
    .eq('post_id', post_id);

  if (error) {
    console.error('Error fetching likes/dislikes:', error);
    throw error;
  }

  const likes = data.filter((item) => item.liked).length;
  const dislikes = data.filter((item) => !item.liked).length;
  const likeUsers = data; // 좋아요를 누른 사용자 리스트 반환

  return { likes, dislikes, likeUsers };
};

// 좋아요 싫어요 토글하기
export const toggleLike = async (post_id: string, user_id: string, liked: boolean | null) => {
  const supabase = await createSupabaseServerClient();
  const { data: existingLike, error } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', post_id)
    .eq('user_id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching like/dislike:', error);
    throw error; // Ignore "Row not found" error
  }

  const { data: postData, error: postError } = await supabase
    .from('post')
    .select('likes, dislikes')
    .eq('id', post_id)
    .single();

  if (postError) {
    console.error('Error fetching post:', postError);
    throw postError;
  }

  let newLikes = postData.likes;
  let newDislikes = postData.dislikes;

  if (existingLike) {
    // Toggle existing like/dislike
    if (liked === null) {
      // 좋아요/싫어요를 취소할 경우
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error deleting like/dislike:', deleteError);
        throw deleteError;
      }

      if (existingLike.liked) {
        newLikes = Math.max(0, newLikes - 1);
      } else {
        newDislikes = Math.max(0, newDislikes - 1);
      }
    } else {
      // 좋아요에서 싫어요 또는 그 반대로 변경할 경우
      const { error: updateError } = await supabase
        .from('post_likes')
        .update({ liked })
        .eq('id', existingLike.id);

      if (updateError) {
        console.error('Error updating like/dislike:', updateError);
        throw updateError;
      }

      if (liked) {
        newLikes += 1;
        newDislikes = Math.max(0, newDislikes - 1);
      } else {
        newLikes = Math.max(0, newLikes - 1);
        newDislikes += 1;
      }
    }
  } else {
    // Insert new like/dislike
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({ post_id, user_id, liked });

    if (insertError) {
      console.error('Error inserting like/dislike:', insertError);
      throw insertError;
    }

    if (liked) {
      newLikes += 1;
    } else {
      newDislikes += 1;
    }
  }

  const { error: updatePostError } = await supabase
    .from('post')
    .update({ likes: newLikes, dislikes: newDislikes })
    .eq('id', post_id);

  if (updatePostError) {
    console.error('Error updating post likes/dislikes:', updatePostError);
    throw updatePostError;
  }
};
