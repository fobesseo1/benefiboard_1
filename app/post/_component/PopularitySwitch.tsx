// app/post/_component/PopularitySwitch.tsx

'use client';

import { useState } from 'react';

interface PopularitySwitchProps {
  onSwitch: (orderBy: 'views' | 'created_at') => void;
}

export default function PopularitySwitch({ onSwitch }: PopularitySwitchProps) {
  const [active, setActive] = useState<'views' | 'created_at'>('created_at');

  const handleSwitch = (orderBy: 'views' | 'created_at') => {
    console.log('Switch clicked:', orderBy);
    setActive(orderBy);
    onSwitch(orderBy);
  };

  return (
    <div className="grid grid-cols-2 h-12">
      <div
        className={`flex justify-center items-center cursor-pointer ${
          active === 'views'
            ? 'bg-white border-b-[1px] border-gray-400'
            : 'bg-white border-b-[1px] border-gray-200'
        }`}
        onClick={() => handleSwitch('views')}
      >
        <p className={`text-center ${active === 'views' ? 'font-bold' : 'font-light'}`}>인기</p>
      </div>
      <div
        className={`flex justify-center items-center cursor-pointer ${
          active === 'created_at'
            ? 'bg-white border-b-[1px] border-gray-400'
            : 'bg-white border-b-[1px] border-gray-200'
        }`}
        onClick={() => handleSwitch('created_at')}
      >
        <p className={`text-center ${active === 'created_at' ? 'font-bold' : 'font-light'}`}>
          최신
        </p>
      </div>
    </div>
  );
}
