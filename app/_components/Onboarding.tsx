// app/_components/Onboarding.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../_css-module/Onboarding.module.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeout1 = setTimeout(() => setStep(1), 1500);
    const timeout2 = setTimeout(() => setStep(2), 3000);
    const timeout3 = setTimeout(() => setStep(3), 4500);
    const timeout4 = setTimeout(() => {
      setStep(4);
      onComplete(); // 온보딩이 완료되었음을 알림
    }, 7000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.onboardingContainer} h-screen w-screen`}>
      {/* 새로운 GamifiedPointsSystem 컴포넌트 */}
      {/* <GamifiedPointsSystem /> */}

      {/* 기존 코드 (주석 처리) */}

      <div className={`${styles.logo} ${step >= 1 ? styles.visible : ''}`}>
        <Image src="/logo-benefiboard-white.svg" alt="Benefiboard Logo" width={240} height={36} />
      </div>
      <div className={`${styles.welcomeMessage} ${step >= 2 ? styles.visible : ''}`}>
        새로운 방식의 컨텐츠 플랫폼을 경험해보세요
      </div>
      <div className={`${styles.features} ${step >= 3 ? styles.visible : ''}`}>
        <div className={styles.feature}>컨텐츠를 소비하는 것만으로도 가치 있는 활동입니다</div>
        <div className={styles.feature}>
          플랫폼 수익의 50%를 유저, 크리에이터, 기부 파트너와 공유합니다.
          <div className={styles.feature}>이제 시작합니다.</div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
