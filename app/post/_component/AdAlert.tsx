//app/post/_component/AdAlert.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { PointAnimation, calculatePoints } from './PointAnimation';
import { AdContentCard } from './AdContent';
import { useDrag } from '@/hooks/useDrag';
import { CurrentUserType } from '@/types/types';
import { BalloonAnimation } from './BalloonAnimation';

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
  /* const [showBalloons, setShowBalloons] = useState(false);

  useEffect(() => {
    if (showAnimation || showAdClickAnimation) {
      setShowBalloons(true);
      const timer = setTimeout(() => setShowBalloons(false), 10000); // 10초 후에 풍선 애니메이션 숨기기
      return () => clearTimeout(timer);
    }
  }, [showAnimation, showAdClickAnimation]); */

  const handleAdClose = useCallback(() => {
    setShowAd(false);
  }, []);

  const { getTransformStyle, isDragging } = useDrag(handleAdClose);

  const addPointsAsync = useCallback(
    (newPoints: number) => {
      if (pointsAddedRef.current) return;

      pointsAddedRef.current = true;

      if (userId) {
        const data = {
          userId,
          points: newPoints,
        };

        navigator.sendBeacon('/api/add-user-points', JSON.stringify(data));
        setPoints((prevPoints) => prevPoints + newPoints);
        console.log(`Sent request to add ${newPoints} points to user ${userId}`);
      }
    },
    [userId]
  );

  const handleAdClick = useCallback(() => {
    if (adClickExecutedRef.current) return;
    adClickExecutedRef.current = true;

    const readerClickPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    setAdClickPoints(readerClickPoints);

    // sendBeacon을 사용하여 포인트 적립 요청 전송
    if (userId && currentUser) {
      const data = {
        userId,
        authorId: author_id,
        readerClickPoints,
        donationId: currentUser.donation_id,
      };
      navigator.sendBeacon('/api/add-ad-click-points', JSON.stringify(data));
    }

    // 즉시 애니메이션 표시
    setShowAdClickAnimation(true);

    // 광고 닫기
    setShowAd(false);

    // 0.8초 후에 새 창에서 광고 URL 열기
    setTimeout(() => {
      window.open(AD_URL, '_blank');
    }, 800);
  }, [userId, author_id, currentUser]);

  useEffect(() => {
    earnedPointsRef.current = calculatePoints();
    setShowAnimation(true);

    if (earnedPointsRef.current >= 3) {
      // 애니메이션 시작 직후 광고 표시 예약
      setTimeout(() => setShowAd(true), 500);
    }

    addPointsTimeoutRef.current = setTimeout(() => {
      if (!pointsAddedRef.current) {
        addPointsAsync(earnedPointsRef.current);
      }
    }, 100);

    return () => {
      if (addPointsTimeoutRef.current) {
        clearTimeout(addPointsTimeoutRef.current);
      }
    };
  }, [addPointsAsync]);

  const handleAnimationEnd = useCallback(() => {
    if (!pointsAddedRef.current) {
      addPointsAsync(earnedPointsRef.current);
    }
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
              adClickExecutedRef.current = false;
            }}
            isAdClick={true}
          />
        </div>
      )}
    </>
  );
}
