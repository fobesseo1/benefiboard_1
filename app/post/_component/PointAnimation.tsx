import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculatePoints } from '../_action/adPoint';
import { saveUserRoundData } from '../_action/adPointSupabase';
import AnimatedPointCounter from '@/app/_components/PointSlotAnimation';
import { CurrentUserType } from '@/types/types';
import { EmojiHaha, EmojiSad } from '@/app/_emoji-gather/emoji-gather';

interface PointAnimationProps {
  userId: string | null;
  currentUser: CurrentUserType | null;
  initialRoundData: any;
  initialPoints: number;
  onAnimationEnd?: (points: number) => void;
}

const MINIMUM_DISPLAY_TIME = 200; // 0.2초를 밀리초 단위로 표현

export function PointAnimation({
  userId,
  currentUser,
  initialRoundData,
  initialPoints,
  onAnimationEnd,
}: PointAnimationProps) {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [roundData, setRoundData] = useState(initialRoundData);
  const [totalPoints, setTotalPoints] = useState(initialPoints);
  const startTimeRef = useRef(0);
  const pointsEarnedRef = useRef(0);
  const pointsAddedRef = useRef(false);

  const addPoints = useCallback(
    async (points: number) => {
      if (pointsAddedRef.current) return;
      pointsAddedRef.current = true;

      setTotalPoints((prev) => prev + points);
      if (onAnimationEnd) {
        onAnimationEnd(points);
      }
    },
    [onAnimationEnd]
  );

  const initializeRound = useCallback(async () => {
    let roundPoints: number[] = roundData.round_points;
    let currentRoundIndex = roundData.current_round_index;

    if (!roundPoints.length) {
      roundPoints = calculatePoints();
      if (userId) {
        await saveUserRoundData(userId, currentRoundIndex, roundPoints);
      }
      setRoundData({ round_points: roundPoints, current_round_index: currentRoundIndex });
    }

    const number = roundPoints[currentRoundIndex];
    setRandomNumber(number);
    pointsEarnedRef.current = number;

    currentRoundIndex += 1;
    if (userId) {
      await saveUserRoundData(userId, currentRoundIndex, roundPoints);
    }

    if (currentRoundIndex >= roundPoints.length) {
      if (userId) {
        await saveUserRoundData(userId, 0, calculatePoints());
      }
    }

    startTimeRef.current = Date.now();

    // 포인트가 3 이상이면 0.3초 후에 애니메이션 종료, 그렇지 않으면 3초 후에 종료
    const animationDuration = number >= 3 && number < 100 ? 300 : 3000;

    setTimeout(() => {
      setRandomNumber(null);
      addPoints(number);
    }, animationDuration);
  }, [userId, roundData, addPoints]);

  useEffect(() => {
    initializeRound();

    return () => {
      // 컴포넌트가 언마운트될 때 실행되는 클린업 함수
      const displayTime = Date.now() - startTimeRef.current;
      if (displayTime >= MINIMUM_DISPLAY_TIME && !pointsAddedRef.current) {
        addPoints(pointsEarnedRef.current);
      }
    };
  }, [initializeRound, addPoints]);

  const handleAnimationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      {randomNumber !== null && (
        <div className="fixed flex flex-col items-center top-16 left-0 -translate-x-1/2 -translate-y-1/2 gap-4 z-50 ">
          <div className="flex items-center justify-center ">
            {randomNumber === 0 ? <EmojiSad /> : <EmojiHaha />}
          </div>
          {currentUser && (
            <div className="w-72 h-16 rounded-xl bg-gradient-to-b from-pink-100 to-pink-200 flex items-center justify-center ">
              <p className="text-pink-400 text-xl font-semibold">
                ♡ {currentUser?.partner_name}
                <span className="text-sm"> 님에게 기부</span> ♡
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <div
              className={` flex flex-col justify-center items-center gap-4  ${
                randomNumber === 0
                  ? 'bg-gray-200'
                  : 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-4 border-emerald-100'
              } -mr-2 rounded-full p-2 w-40 h-40 relative `}
              onClick={handleAnimationClick}
            >
              <p className="text-4xl font-bold text-emerald-400">
                <span className="text-4xl">+</span>
                {randomNumber}
              </p>
              <p className="text-xl text-emerald-400 text-center">
                {randomNumber === 0
                  ? '이번엔 꽝'
                  : randomNumber >= 10
                    ? '빅포인트!!'
                    : '포인트 적립'}
              </p>
              {userId ? (
                <p className=" font-semibold text-center text-emerald-400 leading-tight">
                  {randomNumber === 0 ? '다음 기회를' : '적립완료'}
                </p>
              ) : (
                <p className=" font-semibold text-center text-emerald-400 leading-tight">
                  로그인시 적립
                </p>
              )}
            </div>
            <div className="-ml-2 rounded-full p-2 w-40 h-40 flex flex-col justify-center items-center gap-4 bg-gradient-to-r from-pink-200 to-pink-400  border-4 border-pink-200">
              <p className="text-4xl font-bold text-pink-600">
                <span className="text-4xl">+</span>
                {randomNumber < 100 ? 5 : 500}
              </p>
              <p className="text-xl text-pink-600 text-center">포인트 기부</p>
              {userId ? (
                <p className=" font-semibold text-center text-pink-600 leading-tight">기부완료</p>
              ) : (
                <p className=" font-semibold text-center text-pink-600 leading-tight">
                  로그인시 기부
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed -top-48 left-0 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[1005]"
        onClick={handleAnimationClick}
      >
        <AnimatedPointCounter
          currentPoints={totalPoints}
          addedPoints={randomNumber || 0}
          onAnimationComplete={() => {}}
          isLoggedIn={!!userId}
        />
      </div>
    </>
  );
}
