'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { CurrentUserType } from '@/types/types';

const colors = ['#FBCFE8', '#F9A8D4', '#F472B6', '#F0ABFC', '#E879F9'];

type ContentType = 'earned' | 'donation' | 'partner';

interface BalloonProps {
  delay: number;
  maxWidth: number;
  content: React.ReactNode;
  contentType: ContentType;
}

const Balloon: React.FC<BalloonProps> = React.memo(({ delay, maxWidth, content, contentType }) => {
  const [randomColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [startX] = useState(Math.random() * maxWidth - maxWidth / 2);
  const [endX] = useState(startX + (Math.random() - 0.5) * 100);

  const props = useSpring({
    from: {
      transform: `translateX(${startX}px) translateY(80vh) scale(0.5)`,
      opacity: 0,
    },
    to: async (next) => {
      await next({ opacity: 0.75, transform: `translateX(${startX}px) translateY(20vh) scale(1)` });
      await next({ transform: `translateX(${endX}px) translateY(-40vh) scale(1)` });
    },
    config: { ...config.gentle, duration: 2000 },
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
});

Balloon.displayName = 'Balloon';

interface BalloonAnimationProps {
  userId: string | null;
  currentUser: CurrentUserType | null;
  earnedPoints: number;
  donationPoints: number;
  startAnimation: boolean;
}

export const BalloonAnimation: React.FC<BalloonAnimationProps> = React.memo(
  ({ userId, currentUser, earnedPoints, donationPoints, startAnimation }) => {
    const [maxWidth, setMaxWidth] = useState(320);

    useEffect(() => {
      const handleResize = () => {
        setMaxWidth(window.innerWidth >= 1024 ? 640 : 320);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const balloons = useMemo(() => {
      if (!startAnimation) return [];

      const newBalloons: [React.ReactNode, ContentType, string][] = [
        [
          <div key="earned1">
            <p className="text-4xl font-bold">
              <span className="text-2xl">+</span>
              {earnedPoints}
            </p>
            <p className="text-xl">
              {earnedPoints === 0
                ? '이번엔 꽝'
                : earnedPoints >= 100
                  ? '빅포인트!!'
                  : '포인트 적립'}
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
              {earnedPoints === 0
                ? '이번엔 꽝'
                : earnedPoints >= 100
                  ? '빅포인트!!'
                  : '포인트 적립'}
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

      return newBalloons.sort(() => Math.random() - 0.5);
    }, [startAnimation, earnedPoints, donationPoints, userId, currentUser]);

    if (!startAnimation) return null;

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2000 }}>
        {balloons.map(([content, contentType, key], index) => (
          <Balloon
            key={key}
            delay={index * 200}
            maxWidth={maxWidth}
            content={content}
            contentType={contentType as ContentType}
          />
        ))}
      </div>
    );
  }
);

BalloonAnimation.displayName = 'BalloonAnimation';
