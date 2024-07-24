//app/post/_component/AdAlert.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
  addDonationPoints,
  addUserClickPoints,
  addUserPoints,
  addWritingClickPoints,
} from '../_action/adPointSupabase';
import { PointAnimation, calculatePoints } from './PointAnimation';
import { AdContentCard } from './AdContent';
import { useDrag } from '@/hooks/useDrag';
import { CurrentUserType } from '@/types/types';

const AD_URL = 'https://link.coupang.com/a/bKbEkY';

export default function AdAlert({
  userId,
  postId,
  author_id,
  initialPoints,
  currentUser,
}: {
  userId: string | null;
  postId: string | null;
  author_id: string | null;
  initialPoints: number;
  currentUser: CurrentUserType | null;
}) {
  const [showAd, setShowAd] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [points, setPoints] = useState(initialPoints);
  const [adClickPoints, setAdClickPoints] = useState(0);
  const [showAdClickAnimation, setShowAdClickAnimation] = useState(false);
  const adClickExecutedRef = useRef(false);
  const earnedPointsRef = useRef(0);
  const pointsAddedRef = useRef(false);
  const addPointsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAdClose = useCallback(() => {
    setShowAd(false);
  }, []);

  const { getTransformStyle, isDragging } = useDrag(handleAdClose);

  const addPointsAsync = useCallback(
    async (newPoints: number) => {
      if (userId && !pointsAddedRef.current) {
        try {
          await addUserPoints(userId, newPoints);
          setPoints((prevPoints) => prevPoints + newPoints);
          console.log(`Added ${newPoints} points to user ${userId}`);
          pointsAddedRef.current = true;
        } catch (error) {
          console.error('Error adding points:', error);
        }
      }

      if (newPoints >= 3) {
        setShowAd(true);
      }
    },
    [userId]
  );

  const handleAdClick = useCallback(async () => {
    if (adClickExecutedRef.current) return;
    adClickExecutedRef.current = true;

    const readerClickPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    setAdClickPoints(readerClickPoints);

    if (userId) {
      await addUserClickPoints(userId, readerClickPoints);
    }

    if (author_id) {
      const writerPoints = 500;
      await addWritingClickPoints(author_id);
    }

    if (currentUser && currentUser.donation_id) {
      const donationPoints = 500;
      try {
        await addDonationPoints(currentUser.id, currentUser.donation_id, donationPoints);
      } catch (error) {
        console.error('Error adding donation points:', error);
      }
    }

    setShowAdClickAnimation(true);

    setTimeout(() => {
      window.open(AD_URL, '_blank');
      setShowAd(false);
    }, 2500);
  }, [userId, author_id, currentUser]);

  useEffect(() => {
    earnedPointsRef.current = calculatePoints();
    setShowAnimation(true);

    // 포인트 추가를 지연시키고 타임아웃을 저장
    addPointsTimeoutRef.current = setTimeout(() => {
      if (!pointsAddedRef.current) {
        addPointsAsync(earnedPointsRef.current);
      }
    }, 1000); // 1초 지연

    return () => {
      // 컴포넌트 언마운트 시 타임아웃 클리어
      if (addPointsTimeoutRef.current) {
        clearTimeout(addPointsTimeoutRef.current);
      }
    };
  }, [addPointsAsync]);

  const handleAnimationEnd = useCallback(() => {
    // 애니메이션이 끝나면 즉시 포인트 추가
    if (!pointsAddedRef.current) {
      addPointsAsync(earnedPointsRef.current);
    }
    // 지연된 포인트 추가 취소
    if (addPointsTimeoutRef.current) {
      clearTimeout(addPointsTimeoutRef.current);
    }
  }, [addPointsAsync]);

  return (
    <>
      {showAnimation && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <PointAnimation
            userId={userId}
            currentUser={currentUser}
            initialPoints={initialPoints}
            earnedPoints={earnedPointsRef.current}
            donationPoints={5}
            onAnimationEnd={handleAnimationEnd}
            isAdClick={false}
          />
        </div>
      )}

      {showAd && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-75 z-[1001]" />
          <AlertDialog open={showAd} onOpenChange={handleAdClose}>
            <div
              className={`fixed inset-0 flex items-center justify-center z-[1002] ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative" style={{ transform: getTransformStyle() }}>
                <p>컨텐트카드</p>
                <AdContentCard handleAdClick={handleAdClick} handleAdClose={handleAdClose} />
              </div>
            </div>
          </AlertDialog>
        </>
      )}
      {showAdClickAnimation && (
        <div className="fixed inset-0 z-[1003] pointer-events-none">
          <PointAnimation
            userId={userId}
            currentUser={currentUser}
            initialPoints={points}
            earnedPoints={adClickPoints}
            donationPoints={500}
            onAnimationEnd={() => {
              setShowAdClickAnimation(false);
              adClickExecutedRef.current = false; // Reset for potential future ad clicks
            }}
            isAdClick={true}
          />
        </div>
      )}
    </>
  );
}
