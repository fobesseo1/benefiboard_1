'use client';

import React, { useState, useEffect } from 'react';

const NOTICE_ID = 'static-notice-2024-07-19';

export default function TodayNoticePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastShownDate = localStorage.getItem(`notice_${NOTICE_ID}_lastShown`);
    const today = new Date().toDateString();

    if (lastShownDate !== today) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleDontShowToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`notice_${NOTICE_ID}_lastShown`, today);
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  ">
      <div className="bg-white  rounded-lg  w-full mx-4 overflow-y-auto max-h-[90vh] max-w-[360px] sm:max-w-[600px] p-4 py-8 ">
        <div className="sm:hidden">
          <h2 className="text-2xl font-bold mb-4">
            Benefiboard에
            <br />
            오신 것을 환영합니다!
          </h2>
          <p className="mb-4 leading-normal">
            Benefiboard는
            <br />
            여러분의 콘텐츠 소비 경험을
            <br />
            혁신적으로 바꿀 새로운 플랫폼입니다.
          </p>
        </div>
        <div className="sm:block hidden">
          <h2 className="text-2xl font-bold mb-4">Benefiboard에 오신 것을 환영합니다!</h2>
          <p className="mb-4 leading-normal">
            Benefiboard는 여러분의 콘텐츠 소비 경험을 혁신적으로 바꿀 새로운 플랫폼입니다.
          </p>
        </div>

        <div className="grid grid-cols-1  gap-4 mb-4">
          {/* 1. 공정한 수익 분배 */}
          <div className="border p-4 rounded-lg flex flex-col justify-center gap-4  sm:flex-row sm:justify-normal sm:grid sm:grid-cols-2">
            <div className="">
              <h3 className="font-bold mb-2">1. 공정한 수익 분배</h3>
              <p>
                플랫폼 수익의 50%
                <br /> 유저, 크리에이터, 기부 파트너와 공유
              </p>
            </div>
            <div className="flex items-center justify-center animate-fade-in">
              <img src="/mainPopupIcons/share50_icon.svg" alt="shareIcon" />
            </div>
          </div>

          {/* 2. 공정한 수익 분배 */}
          <div className="border p-4 rounded-lg flex flex-col justify-center gap-4  sm:flex-row sm:justify-normal sm:grid sm:grid-cols-2">
            <div className="">
              <h3 className="font-bold mb-2">2. 콘텐츠 소비 보상</h3>
              <p>콘텐츠를 단지 즐기는 것만으로도 보상</p>
            </div>
            <div className="flex items-center justify-center animate-fade-in">
              <img src="/mainPopupIcons/smartview_icon.svg" alt="smartviewIcon" />
            </div>
          </div>
          {/* 3. 의미 있는 기부 */}
          <div className="border p-4 rounded-lg flex flex-col justify-center gap-4  sm:flex-row sm:justify-normal sm:grid sm:grid-cols-2">
            <div className="">
              <h3 className="font-bold mb-2">3. 의미 있는 기부</h3>
              <p>쉽고 간편하게 기부 참여</p>
            </div>
            <div className="flex items-center justify-center animate-fade-in">
              <img src="/mainPopupIcons/donation_icon.svg" alt="donationIcon" />
            </div>
          </div>
        </div>
        <p className="mb-4 leading-normal sm:hidden">
          베네피보드에서는 콘텐츠를 즐기는 것은
          <br />
          정말 가치 있는 활동입니다.
          <br />
          모두가 행복한 컨텐츠 플랫폼을 만들어 갑니다.
          <br />
          이제 베네피보드를 시작해보세요!
        </p>
        <p className="mb-4 leading-relaxed sm:block hidden">
          베네피보드에서는 콘텐츠를 즐기는 것은 정말 가치 있는 활동입니다.
          <br />
          모두가 행복한 컨텐츠 플랫폼을 만들어 갑니다.
          <br />
          이제 베네피보드를 시작해보세요!
        </p>
        <div className="flex justify-end">
          {/* <button onClick={handleClose} className="text-blue-500">
            그냥 닫기
          </button> */}
          <button
            onClick={handleDontShowToday}
            className="bg-blue-500 text-white px-4 py-4 rounded"
          >
            오늘 하루 보지 않고 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
