//app>post>_component>AdPopupWrapper.tsx

'use client';

import React, { useState, useEffect } from 'react';
import InPageAdPopup from './InPageAdPopup';
import { handleDonationPost } from '../_action/adPointSupabase';
import { CurrentUserType } from '@/types/types';

const AD_COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AdPopupWrapperProps {
  currentUser: CurrentUserType | null;
  postId: string;
  authorId: string;
  donationPoints: number;
}

export default function AdPopupWrapper({
  currentUser,
  postId,
  authorId,
  donationPoints,
}: AdPopupWrapperProps) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkAdCooldown = () => {
      const lastAdTime = localStorage.getItem(`lastAdTime_${postId}`);
      const currentTime = new Date().getTime();

      if (lastAdTime) {
        const timeSinceLastAd = currentTime - parseInt(lastAdTime, 10);
        if (timeSinceLastAd < AD_COOLDOWN_TIME) {
          return false;
        }
      }

      localStorage.setItem(`lastAdTime_${postId}`, currentTime.toString());
      return true;
    };

    if (checkAdCooldown()) {
      setShowPopup(true);
      const processDonation = async () => {
        console.log('adPopup');
        const result = await handleDonationPost(currentUser, donationPoints);
        if (result) {
          console.log(`Donation post handled successfully with ${donationPoints} points`);
        } else {
          console.log('Failed to handle donation post or no donation was made');
        }
      };

      processDonation();
    }
  }, [postId, currentUser, donationPoints]);

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <InPageAdPopup
        currentUser={currentUser}
        postId={postId}
        authorId={authorId}
        onClose={handleClose}
      />
    </>
  );
}
