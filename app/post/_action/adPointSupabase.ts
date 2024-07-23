//app>post>_action>adPointSupabase.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { CurrentUserType } from '@/types/types';

export async function saveUserRoundData(
  userId: string,
  currentRoundIndex: number,
  roundPoints: number[]
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_rounds').upsert({
    user_id: userId,
    current_round_index: currentRoundIndex,
    round_points: roundPoints,
  });

  if (error) {
    console.error('Error saving user round data:', error);
  }
  return data;
}

export async function addUserPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - addUserPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: data[0].total_points + points,
        current_points: data[0].current_points + points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user points:', updateError);
    } else {
      console.log('User points updated successfully Server', updateData);
      console.log('User points Server', points);
    }

    return updateData;
  } else {
    const { data: insertData, error: insertError } = await supabase.from('user_points').insert({
      user_id: userId,
      total_points: points,
      current_points: points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error adding user points:', insertError);
    }

    return insertData;
  }
}

export async function addWritingPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - addWritingPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: data[0].total_points + points,
        current_points: data[0].current_points + points,
        writing_points: (data[0].writing_points || 0) + points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user writing points:', updateError);
      return null;
    } else {
      console.log('User writing points updated successfully', updateData);
      return updateData;
    }
  } else {
    const { data: insertData, error: insertError } = await supabase.from('user_points').insert({
      user_id: userId,
      total_points: points,
      current_points: points,
      writing_points: points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error adding user writing points:', insertError);
      return null;
    }

    console.log('New user writing points record created', insertData);
    return insertData;
  }
}

export async function addUserClickPoints(userId: string, readerClickPoints: number) {
  await addUserPoints(userId, readerClickPoints);
  console.log(`Added ${readerClickPoints} points to reader (${userId})`);
}

export async function addWritingClickPoints(author_id: string) {
  const writerPoints = 500;
  await addWritingPoints(author_id, writerPoints);
  console.log(`Added ${writerPoints} points to writer (${author_id})`);
}

export async function useUserPoints(userId: string, points: number, type: 'use' | 'donate') {
  const column = type === 'use' ? 'total_used_points' : 'total_donated_points';

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - useUserPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    const updateValues: {
      current_points: number;
      updated_at: string;
      [key: string]: any;
    } = {
      current_points: data[0].current_points - points,
      updated_at: new Date().toISOString(),
    };

    updateValues[column] = data[0][column] + points;

    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update(updateValues)
      .eq('user_id', userId);

    if (updateError) {
      console.error(`Error ${type === 'use' ? 'using' : 'donating'} user points:`, updateError);
    }

    return updateData;
  } else {
    console.error(`No user points record found for user_id: ${userId}`);
    return null;
  }
}

//기본 광고볼 경우 도네이션
export async function addDonationPoints(donorId: string, receiverId: string, points: number) {
  const supabase = await createSupabaseServerClient();

  // Update receiver's points
  const { data: receiverData, error: receiverError } = await supabase
    .from('user_points')
    .select('total_donated_points, current_points, total_points')
    .eq('user_id', receiverId)
    .single();

  if (receiverError) {
    console.error('Error fetching receiver data:', receiverError);
    return null;
  }

  const newReceiverDonatedPoints = (receiverData?.total_donated_points || 0) + points;
  const newReceiverCurrentPoints = (receiverData?.current_points || 0) + points;
  const newReceiverTotalPoints = (receiverData?.total_points || 0) + points;

  const { error: receiverUpdateError } = await supabase
    .from('user_points')
    .update({
      total_donated_points: newReceiverDonatedPoints,
      current_points: newReceiverCurrentPoints,
      total_points: newReceiverTotalPoints,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', receiverId);

  if (receiverUpdateError) {
    console.error('Error updating receiver points:', receiverUpdateError);
    return null;
  }

  // Update donor's donation_points
  const { data: donorData, error: donorError } = await supabase
    .from('user_points')
    .select('donation_points')
    .eq('user_id', donorId)
    .single();

  if (donorError) {
    console.error('Error fetching donor data:', donorError);
    return null;
  }

  const newDonorPoints = (donorData?.donation_points || 0) + points;

  const { data: updatedDonorData, error: donorUpdateError } = await supabase
    .from('user_points')
    .update({
      donation_points: newDonorPoints,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', donorId)
    .select();

  if (donorUpdateError) {
    console.error('Error updating donor donation points:', donorUpdateError);
    return null;
  }

  console.log(`Added ${points} donation points from ${donorId} to ${receiverId}`);
  return {
    donorData: updatedDonorData,
    receiverData: {
      total_donated_points: newReceiverDonatedPoints,
      current_points: newReceiverCurrentPoints,
      total_points: newReceiverTotalPoints,
    },
  };
}

//로또와 같이 새로고침 시 마다 도네이션
export async function handleDonationPost(
  currentUser: CurrentUserType | null,
  donationPoints: number
) {
  if (currentUser && currentUser.donation_id) {
    try {
      const donationResult = await addDonationPoints(
        currentUser.id,
        currentUser.donation_id,
        donationPoints
      );
      if (donationResult) {
        console.log(
          `Added ${donationPoints} donation points from ${currentUser.id} to ${currentUser.donation_id}`
        );
        return true;
      } else {
        console.error(
          `Failed to add donation points from ${currentUser.id} to ${currentUser.donation_id}`
        );
        return false;
      }
    } catch (error) {
      console.error('Error adding donation points:', error);
      return false;
    }
  }
  return false;
}

//포스트 클릭시 작성자 및 도네이션 포인트 적립 서버액션
export async function addPointsServerAction(authorId: string, userId: string, donationId?: string) {
  try {
    await Promise.all([
      addWritingPoints(authorId, 5),
      donationId ? addDonationPoints(userId, donationId, 5) : Promise.resolve(),
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error adding points:', error);
    return { success: false, error: 'Failed to add points' };
  }
}
