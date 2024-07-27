'use client';

import { useEffect } from 'react';

export default function Ad_Rectangle_Updown() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const banner = document.querySelector('.ad-banner');
      if (banner) {
        banner.classList.add('slide-highlight');
      }
    }, 1000); // 3초 후에 애니메이션 실행

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="ad-banner mx-auto h-24 flex flex-col relative  py-1 px-4 lg:px-0 overflow-hidden w-full">
        <h2 className="text-xs">Ad 무료공익광고 관심부탁드려요!!</h2>
        <div className="flex-1 w-full h-full bg-gradient-to-t from-blue-100 to-blue-50 p-4">
          <img
            src="/Logo_of_UNICEF.svg"
            alt="Ad"
            className="object-contain object-center w-full h-full "
          />
        </div>
      </div>
      {/* <hr className="mt-4" /> */}
    </>
  );
}
