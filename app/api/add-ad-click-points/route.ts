// app/api/add-ad-click-points/route.ts
import { NextResponse } from 'next/server';
import {
  addUserClickPoints,
  addWritingClickPoints,
  addDonationPoints,
} from '@/app/post/_action/adPointSupabase';

export async function POST(request: Request) {
  const { userId, authorId, readerClickPoints, donationId } = await request.json();

  try {
    await Promise.all([
      addUserClickPoints(userId, readerClickPoints),
      addWritingClickPoints(authorId),
      donationId ? addDonationPoints(userId, donationId, 500) : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding ad click points:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add ad click points' },
      { status: 500 }
    );
  }
}
