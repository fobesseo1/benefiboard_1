'use client';
import React, { useEffect, useState } from 'react';
import { calculatePoints } from '../post/_action/adPoint';
import AdAlert from '../post/_component/AdAlert';
import createSupabaseBrowserClient from '@/lib/supabse/client';
import { CurrentUserType } from '@/types/types';

interface RoundData {
  round_points: number[];
  current_round_index: number;
}

const Ad_Handler = ({
  postId,
  authorId,
  pagePath,
  currentUser,
}: {
  postId: string;
  authorId: string;
  pagePath: string;
  currentUser: CurrentUserType | null;
}) => {
  const [initialRoundData, setInitialRoundData] = useState<RoundData | null>(null);
  const [initialPoints, setInitialPoints] = useState<number>(
    currentUser ? currentUser.current_points : 0
  );

  useEffect(() => {
    const fetchRoundData = async () => {
      console.log('Fetching round data, currentUser:', currentUser);
      const supabase = createSupabaseBrowserClient();

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('user_rounds')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

          if (error) {
            console.error('Error fetching user round data:', error.message);
            if (error.code === 'PGRST116') {
              const newRoundData = {
                user_id: currentUser.id,
                round_points: calculatePoints(),
                current_round_index: 0,
              };
              const { data: insertedData, error: insertError } = await supabase
                .from('user_rounds')
                .insert(newRoundData)
                .single();

              if (insertError) {
                console.error('Error inserting new user round data:', insertError.message);
              } else {
                setInitialRoundData(insertedData);
                console.log('New initialRoundData created', insertedData);
              }
            }
          } else if (data) {
            setInitialRoundData(data);
            console.log('initialRoundData Login', data);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
        }
      } else {
        console.log('User not logged in, using temporary data');
        const tempRoundData = {
          round_points: calculatePoints(),
          current_round_index: 0,
        };
        setInitialRoundData(tempRoundData);
        console.log('initialRoundData NotLogin', tempRoundData);
      }
    };

    fetchRoundData();
  }, [currentUser]);

  const animationExecuted =
    typeof window !== 'undefined' && localStorage.getItem(`post${postId}_animation_executed`);

  console.log('Rendering Ad_Handler', { initialRoundData, currentUser, postId, animationExecuted });

  return (
    initialRoundData &&
    !animationExecuted && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999]">
        <AdAlert
          userId={currentUser?.id ?? null}
          postId={postId}
          initialRoundData={initialRoundData}
          author_id={authorId}
          initialPoints={initialPoints}
          currentUser={currentUser}
        />
      </div>
    )
  );
};

export default Ad_Handler;
