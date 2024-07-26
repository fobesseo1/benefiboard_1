// app/_components/OnboardingLogicWrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';
import { CurrentUserType } from '@/types/types';
import Ad_Rectangle_Updown from './Ad-Rectangle_Updown';
import Link from 'next/link';

interface OnboardingLogicWrapperProps {
  currentUser: CurrentUserType | null;
  children: React.ReactNode;
}

export default function OnboardingLogicWrapper({
  currentUser,
  children,
}: OnboardingLogicWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const lastOnboardingTime = localStorage.getItem('lastOnboardingTime');
    const currentTime = new Date().getTime();
    if (!lastOnboardingTime || currentTime - parseInt(lastOnboardingTime) > 24 * 60 * 60 * 1000) {
      setShowOnboarding(true);
      localStorage.setItem('lastOnboardingTime', currentTime.toString());
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 lg:w-[948px] lg:mx-auto">
      <WelcomeBanner />
      <Ad_Rectangle_Updown />
      {currentUser && <CurrentPoints points={currentUser.current_points} />}
      <hr className="mx-auto border-gray-200 w-full" />
      <div className="w-full flex flex-col grid-cols-2 gap-12 lg:gap-8 lg:grid">{children}</div>
      <hr className="my-4 mx-auto border-gray-200 w-full" />
      {/* <CommunityHighlight />
      <hr className="my-4 mx-auto border-gray-200 w-full" />
      <Ad_Rectangle_Updown /> */}
    </div>
  );
}

const WelcomeBanner = () => (
  <div className="w-[calc(100%-32px)] mt-4 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl text-white lg:w-full]">
    <h1 className="text-xl font-semibold lg:text-2xl">베네피보드에 오신 것을 환영합니다</h1>
    <p className="tracking-tighter text-sm lg:text-lg">
      ♡ 탐험하고, 소통하며, 다양한 보상을 받으세요 ♡
    </p>
  </div>
);

const CurrentPoints = ({ points }: { points: number }) => (
  <div className="w-full flex justify-end lg:hidden">
    <p className="font-semibold mr-4">현재 포인트: {points}</p>
  </div>
);

const CommunityHighlight = () => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-bold lg:my-4 my-2">커뮤니티 하이라이트</h2>
    <Link href="/community-events">
      <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-blue-200 p-1 mt-4 rounded-xl">
        <img src="/communityEventsAd.jpg" alt="Community Events" />
      </div>
    </Link>
  </div>
);
