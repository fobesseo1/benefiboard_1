'use client';

import React, { useState, useEffect } from 'react';
import InPageAdPopup from './InPageAdPopup';
import { addDonationPoints, handleDonationPost } from '../_action/adPointSupabase';
import { CurrentUserType } from '@/types/types';

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
  }, [postId, currentUser, donationPoints]); // postId가 변경될 때마다 (즉, 새 포스트를 볼 때마다) 실행됩니다.

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
