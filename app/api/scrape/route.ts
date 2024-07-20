//app>api>scrape>route.ts

import { NextResponse } from 'next/server';
import { scrapeAndSave } from '@/app/actions/scrapeAndSave';

export async function GET() {
  const result = await scrapeAndSave();

  if (result.success) {
    return NextResponse.json({ message: 'Data successfully scraped and saved' });
  } else {
    return NextResponse.json(
      { message: 'Error scraping and saving data', error: result.error },
      { status: 500 }
    );
  }
}
