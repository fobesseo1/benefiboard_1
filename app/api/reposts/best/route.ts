import { NextResponse } from 'next/server';
import { fetchBestReposts } from '../../../actions/mainPageActions';

export async function GET() {
  const posts = await fetchBestReposts();
  return NextResponse.json(posts);
}
