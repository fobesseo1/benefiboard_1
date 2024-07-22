// app/actions/scrapeActions.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import axios from 'axios';
import cheerio from 'cheerio';

async function scrapeWithTimeout(scrapeFunc: () => Promise<any>, timeout = 25000) {
  return Promise.race([
    scrapeFunc(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Scraping timed out')), timeout)),
  ]);
}

export async function scrapeAndSave() {
  const supabase = await createSupabaseServerClient();

  try {
    const result = await scrapeWithTimeout(async () => {
      // 최신 회차 값을 가져오기
      const { data: latestBatchData, error: latestBatchError } = await supabase
        .from('repost_data')
        .select('batch')
        .order('batch', { ascending: false })
        .limit(1);

      if (latestBatchError) {
        console.error('Error fetching latest batch:', latestBatchError);
        return { success: false, error: latestBatchError };
      }

      const latestBatch = latestBatchData.length > 0 ? latestBatchData[0].batch : 0;
      const newBatch = latestBatch + 1;

      // HTML 가져오기
      const { data } = await axios.get('https://gorani.kr/popular/main');

      // HTML 파싱
      const $ = cheerio.load(data);
      const items: { site: string; link: string; title: string; order: number; batch: number }[] =
        [];

      $('.common_list li').each((index, element) => {
        const site = $(element).find('.badge').text();
        const link = $(element).find('a').attr('href');
        const title = $(element).find('a').text();

        if (link && title && site) {
          items.push({ site, link, title, order: index + 1, batch: newBatch });
        }
      });

      // 데이터 삽입
      for (const item of items) {
        const { error } = await supabase.from('repost_data').insert([
          {
            link: item.link,
            title: item.title,
            site: item.site,
            order: item.order,
            batch: item.batch,
          },
        ]);

        if (error) {
          console.error('Error inserting data:', error);
          return { success: false, error };
        }
      }

      // 오래된 회차 삭제
      if (newBatch >= 9) {
        const batchToDelete = newBatch - 8;
        const { error } = await supabase.from('repost_data').delete().eq('batch', batchToDelete);

        if (error) {
          console.error(`Error deleting batch ${batchToDelete}:`, error);
          return { success: false, error };
        }
      }

      return { success: true };
    });

    return { success: true, message: 'Data successfully scraped and saved' };
  } catch (error: unknown) {
    console.error('Error in scrapeAndSave:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function scrapeAndSaveBest() {
  const supabase = await createSupabaseServerClient();

  try {
    const result = await scrapeWithTimeout(async () => {
      // 최신 회차 값을 가져오기
      const { data: latestBatchData, error: latestBatchError } = await supabase
        .from('repost_best_data')
        .select('batch')
        .order('batch', { ascending: false })
        .limit(1);

      if (latestBatchError) {
        console.error('Error fetching latest batch:', latestBatchError);
        return { success: false, error: latestBatchError };
      }

      const latestBatch = latestBatchData.length > 0 ? latestBatchData[0].batch : 0;
      const newBatch = latestBatch + 1;

      // HTML 가져오기
      const { data } = await axios.get('https://gorani.kr/best/main/gorani');

      // HTML 파싱
      const $ = cheerio.load(data);
      const items: { site: string; link: string; title: string; order: number; batch: number }[] =
        [];

      $('.common_list li').each((index, element) => {
        const site = $(element).find('.badge').text();
        const link = $(element).find('a').attr('href');
        const title = $(element).find('a').text();

        if (link && title && site) {
          items.push({ site, link, title, order: index + 1, batch: newBatch });
        }
      });

      // 데이터 삽입
      for (const item of items) {
        const { error } = await supabase.from('repost_best_data').insert([
          {
            link: item.link,
            title: item.title,
            site: item.site,
            order: item.order,
            batch: item.batch,
          },
        ]);

        if (error) {
          console.error('Error inserting data:', error);
          return { success: false, error };
        }
      }

      // 오래된 회차 삭제
      if (newBatch >= 9) {
        const batchToDelete = newBatch - 8;
        const { error } = await supabase
          .from('repost_best_data')
          .delete()
          .eq('batch', batchToDelete);

        if (error) {
          console.error(`Error deleting batch ${batchToDelete}:`, error);
          return { success: false, error };
        }
      }

      return { success: true };
    });

    return { success: true, message: 'Best data successfully scraped and saved' };
  } catch (error: unknown) {
    console.error('Error in scrapeAndSaveBest:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
