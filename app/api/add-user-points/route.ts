// app/api/add-user-points/route.ts
import { NextResponse } from 'next/server';
import { addUserPoints } from '@/app/post/_action/adPointSupabase';

export async function POST(request: Request) {
  const { userId, points } = await request.json();

  try {
    await addUserPoints(userId, points);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding user points:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add user points' },
      { status: 500 }
    );
  }
}
