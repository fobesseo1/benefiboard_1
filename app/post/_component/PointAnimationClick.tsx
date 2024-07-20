//app>post>_components>PointAnimationClick.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PointAnimationClick({
  points,
  onAnimationEnd,
  userId,
}: {
  points: number;
  onAnimationEnd: (points: number) => void;
  userId: string | null;
}) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onAnimationEnd(points);
    }, 2000);

    return () => clearTimeout(timer);
  }, [points, onAnimationEnd]);

  if (!showAnimation) return null;

  return (
    <div
      className={`fixed flex flex-col justify-center items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-move-up ${
        userId ? 'bg-blue-600' : 'bg-red-600'
      } rounded-full p-4 w-60 h-60 aspect-square`}
    >
      <p className="text-6xl font-bold text-white">
        <span className="text-4xl">+</span>
        {points}
      </p>
      {userId ? (
        <p className="text-2xl text-white text-center">포인트 적립!!!</p>
      ) : (
        <p className="text-2xl text-white text-center">로그인하면 적립!!</p>
      )}
    </div>
  );
}
