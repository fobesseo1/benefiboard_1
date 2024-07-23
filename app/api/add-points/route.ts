// app/api/add-points/route.ts
import { NextResponse } from 'next/server';
import { addPointsServerAction } from '@/app/post/_action/adPointSupabase';

export async function POST(request: Request) {
  const { authorId, userId, donationId } = await request.json();

  try {
    const result = await addPointsServerAction(authorId, userId, donationId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('포인트 추가 중 오류 발생:', error);
    return NextResponse.json({ success: false, error: '포인트 추가 실패' }, { status: 500 });
  }
}
