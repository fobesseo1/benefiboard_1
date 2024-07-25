'use client';

import { CurrentUserType } from '@/types/types';
import React, { useEffect, useState } from 'react';
import { useSpring, animated, config } from 'react-spring';

const colors = ['#FBCFE8', '#F9A8D4', '#F472B6', '#F0ABFC', '#E879F9'];

type ContentType = 'earned' | 'donation' | 'partner';

interface BalloonProps {
  delay: number;
  maxWidth: number;
  content: React.ReactNode;
  contentType: ContentType;
}

const Balloon: React.FC<BalloonProps> = ({ delay, maxWidth, content, contentType }) => {
  const [randomColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [startX] = useState(Math.random() * maxWidth - maxWidth / 2);
  const [endX] = useState(startX + (Math.random() - 0.5) * 100);

  const props = useSpring({
    from: {
      transform: `translateX(${startX}px) translateY(20vh) scale(0.5)`,
      opacity: 0,
    },
    to: async (next) => {
      await next({ opacity: 0.75, transform: `translateX(${startX}px) translateY(0vh) scale(1)` });
      await next({ transform: `translateX(${endX}px) translateY(-40vh) scale(1)` });
    },
    config: { ...config.gentle, duration: 2000 }, // 애니메이션 시간을 3000ms로 줄임
    delay,
  });

  return (
    <animated.div
      style={{
        ...props,
        position: 'fixed',
        left: '50%',
        marginLeft: '-100px',
        width: '200px',
        height: '240px',
        background: randomColor,
        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: contentType === 'partner' ? '24px' : '48px',
        fontWeight: 'bold',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
      }}
    >
      {content}
    </animated.div>
  );
};

interface BalloonAnimationProps {
  userId: string | null;
  currentUser: CurrentUserType | null;
  earnedPoints: number;
  donationPoints: number;
}

export const BalloonAnimation: React.FC<BalloonAnimationProps> = ({
  userId,
  currentUser,
  earnedPoints,
  donationPoints,
}) => {
  const [balloons, setBalloons] = useState<
    Array<{ content: React.ReactNode; contentType: ContentType; key: string }>
  >([]);
  const [maxWidth, setMaxWidth] = useState(320);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setMaxWidth(window.innerWidth >= 1024 ? 640 : 320);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const newBalloons: [React.ReactNode, ContentType, string][] = [
      [
        <div key="earned1">
          <p className="text-4xl font-bold">
            <span className="text-2xl">+</span>
            {earnedPoints}
          </p>
          <p className="text-xl">
            {earnedPoints === 0 ? '이번엔 꽝' : earnedPoints >= 100 ? '빅포인트!!' : '포인트 적립'}
          </p>
          <p className="text-sm">
            {userId ? (earnedPoints === 0 ? '다음 기회를' : '적립완료') : '로그인시 적립'}
          </p>
        </div>,
        'earned',
        'earned1',
      ],
      [
        <div key="earned2">
          <p className="text-4xl font-bold">
            <span className="text-2xl">+</span>
            {earnedPoints}
          </p>
          <p className="text-xl">
            {earnedPoints === 0 ? '이번엔 꽝' : earnedPoints >= 100 ? '빅포인트!!' : '포인트 적립'}
          </p>
          <p className="text-sm">
            {userId ? (earnedPoints === 0 ? '다음 기회를' : '적립완료') : '로그인시 적립'}
          </p>
        </div>,
        'earned',
        'earned2',
      ],
      [
        <div key="donation1">
          <p className="text-4xl font-bold">
            <span className="text-2xl">+</span>
            {donationPoints}
          </p>
          <p className="text-xl">포인트 기부</p>
          <p className="text-sm">{userId ? '기부완료' : '로그인시 기부'}</p>
        </div>,
        'donation',
        'donation1',
      ],
      [
        <div key="donation2">
          <p className="text-4xl font-bold">
            <span className="text-2xl">+</span>
            {donationPoints}
          </p>
          <p className="text-xl">포인트 기부</p>
          <p className="text-sm">{userId ? '기부완료' : '로그인시 기부'}</p>
        </div>,
        'donation',
        'donation2',
      ],
      [
        <div key="partner">
          <p className="text-xl font-semibold">
            ♡ {currentUser?.partner_name}
            <span className="text-sm"> 님에게 기부</span> ♡
          </p>
        </div>,
        'partner',
        'partner',
      ],
    ];

    newBalloons.sort(() => Math.random() - 0.5);
    setBalloons(newBalloons.map(([content, contentType, key]) => ({ content, contentType, key })));
  }, [userId, currentUser, earnedPoints, donationPoints, isClient]);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2000 }}>
      {balloons.map((balloon) => (
        <Balloon
          key={balloon.key}
          delay={balloons.indexOf(balloon) * 200}
          maxWidth={maxWidth}
          content={balloon.content}
          contentType={balloon.contentType}
        />
      ))}
    </div>
  );
};
