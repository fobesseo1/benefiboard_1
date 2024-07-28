// app/api/reposts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchBestReposts, fetchBasicReposts } from '../../actions/mainPageActions';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');

  let data;
  if (type === 'bestReposts') {
    data = await fetchBestReposts();
  } else if (type === 'basicReposts') {
    data = await fetchBasicReposts();
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  return NextResponse.json(data);
}
