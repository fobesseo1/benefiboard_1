// app/actions/scrapeActions.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import axios from 'axios';
import cheerio from 'cheerio';

const CHUNK_SIZE = 50;
const MAX_ITEMS_POPULAR = 300;
const MAX_ITEMS_BEST = 40;

interface ScrapedItem {
  site: string;
  link: string;
  title: string;
  order: number;
  batch: number;
}

interface ScrapeResult {
  success: boolean;
  message: string;
  nextIndex: number;
  totalItems: number;
  error?: string;
}

async function scrapeChunk(
  items: ScrapedItem[],
  startIndex: number,
  supabase: any,
  tableName: string
): Promise<{ success: boolean; nextIndex: number; error?: string }> {
  const endIndex = Math.min(startIndex + CHUNK_SIZE, items.length);
  const chunk = items.slice(startIndex, endIndex);

  const { error } = await supabase.from(tableName).insert(chunk);

  if (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    return { success: false, nextIndex: startIndex, error: error.message };
  }

  return { success: true, nextIndex: endIndex };
}

async function scrapeWebsite(
  url: string,
  newBatch: number,
  maxItems: number
): Promise<ScrapedItem[]> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const items: ScrapedItem[] = [];

  $('.common_list li').each((index, element) => {
    if (items.length >= maxItems) return false;

    const site = $(element).find('.badge').text();
    const link = $(element).find('a').attr('href');
    const title = $(element).find('a').text();

    if (link && title && site) {
      items.push({ site, link, title, order: index + 1, batch: newBatch });
    }
  });

  return items;
}

async function getLatestBatch(supabase: any, tableName: string): Promise<number> {
  const { data, error } = await supabase
    .from(tableName)
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (error) {
    console.error(`Error fetching latest batch from ${tableName}:`, error);
    throw error;
  }

  return data.length > 0 ? data[0].batch : 0;
}

async function deleteOldBatch(supabase: any, tableName: string, batchToDelete: number) {
  const { error } = await supabase.from(tableName).delete().eq('batch', batchToDelete);
  if (error) {
    console.error(`Error deleting batch ${batchToDelete} from ${tableName}:`, error);
    throw error;
  }
}

export async function scrapeAndSave(startIndex = 0, isFreshStart = false): Promise<ScrapeResult> {
  const supabase = await createSupabaseServerClient();
  const tableName = 'repost_data';

  try {
    let items: ScrapedItem[];
    let newBatch: number;

    if (isFreshStart) {
      const latestBatch = await getLatestBatch(supabase, tableName);
      newBatch = latestBatch + 1;
      items = await scrapeWebsite('https://gorani.kr/popular/main', newBatch, MAX_ITEMS_POPULAR);

      // Save all scraped items to the database
      const { error } = await supabase.from(tableName).insert(items);
      if (error) {
        throw new Error('Error saving scraped items to database');
      }
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('batch', { ascending: false })
        .limit(MAX_ITEMS_POPULAR);

      if (error) {
        throw new Error('Error fetching latest batch');
      }

      newBatch = data[0]?.batch || 1;
      items = data;
    }

    const totalItems = items.length;
    const endIndex = Math.min(startIndex + CHUNK_SIZE, totalItems);

    if (startIndex >= totalItems) {
      if (newBatch >= 9) {
        await deleteOldBatch(supabase, tableName, newBatch - 8);
      }
      return {
        success: true,
        message: 'All data successfully scraped and saved',
        nextIndex: totalItems,
        totalItems: totalItems,
      };
    } else {
      return {
        success: true,
        message: 'Partial data scraped',
        nextIndex: endIndex,
        totalItems: totalItems,
      };
    }
  } catch (error: unknown) {
    console.error('Error in scrapeAndSave:', error);
    return {
      success: false,
      message: 'An unknown error occurred',
      nextIndex: startIndex,
      totalItems: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function scrapeAndSaveBest(
  startIndex = 0,
  isFreshStart = false
): Promise<ScrapeResult> {
  const supabase = await createSupabaseServerClient();
  const tableName = 'repost_best_data';

  try {
    let items: ScrapedItem[];
    let newBatch: number;

    if (isFreshStart) {
      const latestBatch = await getLatestBatch(supabase, tableName);
      newBatch = latestBatch + 1;
      items = await scrapeWebsite('https://gorani.kr/best/main/gorani', newBatch, MAX_ITEMS_BEST);
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('batch', { ascending: false })
        .limit(1);

      if (error) {
        throw new Error('Error fetching latest batch');
      }

      newBatch = data[0]?.batch || 1;
      items = data;
    }

    const result = await scrapeChunk(items, startIndex, supabase, tableName);
    if (!result.success) {
      return {
        success: false,
        message: 'Error scraping chunk',
        nextIndex: result.nextIndex,
        totalItems: items.length,
        error: result.error,
      };
    }

    if (result.nextIndex < items.length) {
      return {
        success: true,
        message: 'Partial best data scraped',
        nextIndex: result.nextIndex,
        totalItems: items.length,
      };
    } else {
      if (newBatch >= 9) {
        await deleteOldBatch(supabase, tableName, newBatch - 8);
      }
      return {
        success: true,
        message: 'All best data successfully scraped and saved',
        nextIndex: items.length,
        totalItems: items.length,
      };
    }
  } catch (error: unknown) {
    console.error('Error in scrapeAndSaveBest:', error);
    return {
      success: false,
      message: 'An unknown error occurred',
      nextIndex: startIndex,
      totalItems: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
