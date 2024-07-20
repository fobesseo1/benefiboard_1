'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { MessageType } from '../_component/InfiniteScrollMessages';

export async function fetchMessages(
  page: number,
  filter: 'received' | 'sent' | 'starred',
  userId: string
): Promise<MessageType[]> {
  const supabase = await createSupabaseServerClient();
  const pageSize = 10; // 페이지당 메시지 수

  let query = supabase
    .from('message')
    .select(
      `
      id,
      sender_id,
      receiver_id,
      title,
      content,
      created_at,
      is_starred_by_sender,
      is_starred_by_receiver,
      read,
      deleted_by_sender,
      deleted_by_receiver,
      userdata:userdata!message_sender_id_fkey (
        username,
        avatar_url
      )
    `
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filter === 'received') {
    query = query.eq('receiver_id', userId).eq('deleted_by_receiver', false);
  } else if (filter === 'sent') {
    query = query.eq('sender_id', userId).eq('deleted_by_sender', false);
  } else if (filter === 'starred') {
    query = query.or(
      `and(sender_id.eq.${userId},is_starred_by_sender.eq.true,deleted_by_sender.eq.false),and(receiver_id.eq.${userId},is_starred_by_receiver.eq.true,deleted_by_receiver.eq.false)`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  console.log('Fetched messages:', data);

  // Map userdata to correct type
  const formattedData = data.map((message: any) => ({
    ...message,
    userdata: {
      username: message.userdata.username,
      avatar_url: message.userdata.avatar_url,
    },
  }));

  return formattedData as MessageType[];
}

export async function toggleStarMessage(messageId: string, isStarred: boolean, userId: string) {
  const supabase = await createSupabaseServerClient();

  // 메시지 정보 가져오기
  const { data: message, error: fetchError } = await supabase
    .from('message')
    .select('sender_id, receiver_id')
    .eq('id', messageId)
    .single();

  if (fetchError) {
    console.error('Error fetching message:', fetchError);
    throw fetchError;
  }

  // 적절한 필드 업데이트
  const updateFields =
    message.sender_id === userId
      ? { is_starred_by_sender: !isStarred }
      : { is_starred_by_receiver: !isStarred };

  const { data, error } = await supabase.from('message').update(updateFields).eq('id', messageId);

  if (error) {
    console.error('Error toggling star on message:', error);
    throw error;
  }

  return data;
}

/* 메세지 작성 */
export async function createMessage(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const sender_id = formData.get('sender_id');
  const receiver_id = formData.get('receiver_id');

  if (!sender_id || !receiver_id) {
    throw new Error('Invalid sender_id or receiver_id');
  }

  const { data, error } = await supabase.from('message').insert({
    sender_id: sender_id,
    receiver_id: receiver_id,
    title: formData.get('title'),
    content: formData.get('content'),
    sender_name: formData.get('sender_name'),
    sender_avatar_url: formData.get('sender_avatar_url'),
    sender_email: formData.get('sender_email'),
  });

  if (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

/*  */
export async function deleteMessage(messageId: string, userId: string) {
  const supabase = await createSupabaseServerClient();

  // 메시지 정보 가져오기
  const { data: message, error: fetchError } = await supabase
    .from('message')
    .select('sender_id, receiver_id')
    .eq('id', messageId)
    .single();

  if (fetchError) {
    console.error('Error fetching message:', fetchError);
    throw fetchError;
  }

  // 적절한 필드 업데이트
  const updateFields =
    message.sender_id === userId ? { deleted_by_sender: true } : { deleted_by_receiver: true };

  const { data, error } = await supabase.from('message').update(updateFields).eq('id', messageId);

  if (error) {
    console.error('Error updating delete status on message:', error);
    throw error;
  }

  return data;
}

export async function markMessageAsRead(messageId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('message')
    .update({ read: true })
    .eq('id', messageId)
    .eq('receiver_id', userId);

  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }

  return data;
}

/* 메세지 받을 사람 이름으로 찾기 */
export async function searchUsers(query: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('userdata')
    .select('id, username')
    .ilike('username', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data;
}

/* 메세지 받을 사람 ID로 찾기 */
export async function fetchUserById(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('userdata')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }

  return data;
}
