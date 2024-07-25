//app>post>_component>PointAnimation.tsx

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PointSlotAnimation from '@/app/_components/PointSlotAnimation';
import { CurrentUserType } from '@/types/types';
import { EmojiHaha, EmojiSad } from '@/app/_emoji-gather/emoji-gather';

const DynamicBalloonAnimation = dynamic(
  () => import('./BalloonAnimation').then((mod) => mod.BalloonAnimation),
  { ssr: false }
);

interface PointAnimationProps {
  userId: string | null;
  currentUser: CurrentUserType | null;
  initialPoints: number;
  earnedPoints: number;
  donationPoints: number;
  onAnimationEnd?: (points: number) => void;
  isAdClick: boolean;
}

export const calculatePoints = (): number => {
  const random = Math.random();
  if (random < 1 / 8) return 0; // 1/8 확률로 0 포인트
  if (random < 3 / 8) return 1; // 2/8 확률로 1 포인트
  if (random < 5 / 8) return 2; // 2/8 확률로 2 포인트
  if (random < 7 / 8) return 3; // 2/8 확률로 3 포인트
  return 25; // 1/8 확률로 25 포인트
};

export function PointAnimation({
  userId,
  currentUser,
  initialPoints,
  earnedPoints,
  donationPoints,
  onAnimationEnd,
  isAdClick,
}: PointAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [totalPoints, setTotalPoints] = useState(initialPoints);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShowAnimation(false);
        if (onAnimationEnd) {
          onAnimationEnd(earnedPoints);
        }
      },
      isAdClick ? 800 : earnedPoints >= 3 && earnedPoints < 100 ? 800 : 5000
    );

    return () => clearTimeout(timer);
  }, [earnedPoints, onAnimationEnd, isAdClick]);

  const handleAnimationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  if (!showAnimation) return null;

  return (
    <>
      <div className="fixed flex flex-col items-center top-16 left-0 -translate-x-1/2 -translate-y-1/2 gap-4 z-50 ">
        <div className="flex items-center justify-center -mt-16">
          {earnedPoints === 0 ? <EmojiSad /> : <EmojiHaha />}
        </div>
        <div className="flex gap-8 mt-48">
          <div
            className={`flex flex-col justify-center items-center gap-2 ${
              earnedPoints === 0
                ? 'bg-gray-200'
                : 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-4 border-emerald-100'
            } -mr-2 rounded-full p-2 w-36 h-36 relative`}
            onClick={handleAnimationClick}
          >
            <p className="text-4xl font-bold text-emerald-400">
              <span className="text-2xl">+</span>
              {earnedPoints}
            </p>
            <p className="text-xl text-emerald-400 text-center">
              {earnedPoints === 0
                ? '이번엔 꽝'
                : earnedPoints >= 100
                  ? '빅포인트!!'
                  : '포인트 적립'}
            </p>
            {userId ? (
              <p className="font-semibold text-center text-sm text-emerald-400 leading-tight tracking-tighter">
                {earnedPoints === 0 ? '다음 기회를' : '적립완료'}
              </p>
            ) : (
              <p className="font-semibold text-center text-sm text-emerald-400 leading-tight tracking-tighter">
                로그인시 적립
              </p>
            )}
          </div>
          <div className="-ml-2 rounded-full p-2 w-36 h-36 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-pink-200 to-pink-400 border-4 border-pink-200">
            <p className="text-4xl font-bold text-pink-600">
              <span className="text-2xl">+</span>
              {donationPoints}
            </p>
            <p className="text-xl text-pink-600 text-center">포인트 기부</p>
            {userId ? (
              <p className="font-semibold text-center text-sm text-pink-600 leading-tight tracking-tighter">
                기부완료
              </p>
            ) : (
              <p className="font-semibold text-center text-sm text-pink-600 leading-tight tracking-tighter">
                로그인시 기부
              </p>
            )}
          </div>
        </div>
      </div>
      <DynamicBalloonAnimation
        userId={userId}
        currentUser={currentUser}
        earnedPoints={earnedPoints}
        donationPoints={donationPoints}
      />
      <div
        className="fixed -top-[264px] left-0 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[1005]"
        onClick={handleAnimationClick}
      >
        <PointSlotAnimation
          currentPoints={totalPoints}
          addedPoints={earnedPoints}
          onAnimationComplete={() => {}}
          isLoggedIn={!!userId}
        />
      </div>
    </>
  );
}
