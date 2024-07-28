import { NextResponse } from 'next/server';
import { fetchBasicReposts } from '../../../actions/mainPageActions';

export async function GET() {
  const posts = await fetchBasicReposts();
  return NextResponse.json(posts);
}
