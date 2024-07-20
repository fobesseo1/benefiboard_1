//app>api>scrapeBest>route.ts

import { NextResponse } from 'next/server';
import { scrapeAndSaveBest } from '@/app/actions/scrapeAndSaveBest';

export async function GET() {
  const result = await scrapeAndSaveBest();

  if (result.success) {
    return NextResponse.json({ message: 'Data successfully scraped and saved' });
  } else {
    return NextResponse.json(
      { message: 'Error scraping and saving data', error: result.error },
      { status: 500 }
    );
  }
}
