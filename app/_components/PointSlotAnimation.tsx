// app/_components/PointSlotAnimation.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AnimatedPointCounterProps {
  currentPoints: number;
  addedPoints: number;
  onAnimationComplete?: () => void;
  isLoggedIn: boolean;
}

const PointSlotAnimation: React.FC<AnimatedPointCounterProps> = ({
  currentPoints,
  addedPoints,
  onAnimationComplete,
  isLoggedIn,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(currentPoints);
  const [isVisible, setIsVisible] = useState(true);
  const linkRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/auth');
  };

  useEffect(() => {
    const handleCapture = (e: Event) => {
      e.stopPropagation();
    };

    const linkElement = linkRef.current;
    if (linkElement) {
      linkElement.addEventListener('click', handleCapture, true);
    }

    return () => {
      if (linkElement) {
        linkElement.removeEventListener('click', handleCapture, true);
      }
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const generateRandomNumbers = () => {
    return Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
  };

  useEffect(() => {
    if (addedPoints > 0) {
      setIsAnimating(true);
      const finalValue = currentPoints + addedPoints;
      const totalDuration = 2000; // 총 애니메이션 시간 (ms)
      const spinDuration = 1500; // 숫자가 빠르게 변하는 시간 (ms)
      const finalDisplayDuration = 500; // 최종 값 표시 시간 (ms)
      const interval = 50; // 각 단계 사이의 간격 (ms)
      const spinSteps = spinDuration / interval;
      let step = 0;

      const spinTimer = setInterval(() => {
        if (step < spinSteps) {
          setDisplayedPoints(parseInt(generateRandomNumbers()));
          step++;
        } else {
          clearInterval(spinTimer);
          setDisplayedPoints(finalValue);

          // 최종 값 표시 후 애니메이션 완료 처리
          setTimeout(() => {
            setIsAnimating(false);
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }, finalDisplayDuration);
        }
      }, interval);

      const visibilityTimer = setTimeout(() => {
        setIsVisible(false);
      }, totalDuration + 3000); // 애니메이션 완료 후 1초 더 표시

      return () => {
        clearInterval(spinTimer);
        clearTimeout(visibilityTimer);
      };
    }
  }, [addedPoints, onAnimationComplete, currentPoints]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="z-[1006] fixed flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="relative flex flex-col items-center justify-center text-3xl font-semibold w-72 bg-emerald-300 rounded-lg px-4 py-2">
        <div className="text-base">포인트</div>
        <AnimatePresence>
          <motion.div
            key={isAnimating ? 'animating' : 'static'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            {formatNumber(displayedPoints)}
          </motion.div>
        </AnimatePresence>
        {!isLoggedIn && (
          <div className="text-sm mt-2 text-center z-[1007]" onClick={(e) => e.stopPropagation()}>
            <p>로그인하면 포인트 적립</p>
            <p
              className="text-red-600 underline cursor-pointer z-[1008]"
              onClick={handleLogin}
              ref={linkRef}
              style={{ pointerEvents: 'auto' }}
            >
              지금 로그인하러 가기
            </p>
          </div>
        )}
        <button
          onClick={handleClose}
          className="absolute -top-3 right-1 text-sm bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </div>
    </motion.div>
  );
};

export default PointSlotAnimation;
