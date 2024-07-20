// scripts/auto-scrape-test.ts (또는 .mjs)
import cron from 'node-cron';
import { scrapeAndSave } from '../app/actions/scrapeAndSave';
import { scrapeAndSaveBest } from '../app/actions/scrapeAndSaveBest';

console.log('Starting automatic scraping test...');

// 테스트를 위한 실행 간격 설정 (기본값: 5분)
const testInterval = process.env.TEST_INTERVAL || '*/5 * * * *';

cron.schedule(testInterval, async () => {
  console.log('Running scheduled scraping test at', new Date().toLocaleString());

  try {
    console.log('Running scrapeAndSave...');
    const resultBasic = await scrapeAndSave();
    console.log('Basic scraping result:', resultBasic);

    console.log('Running scrapeAndSaveBest...');
    const resultBest = await scrapeAndSaveBest();
    console.log('Best scraping result:', resultBest);

    console.log('Scheduled scraping test completed successfully');
  } catch (error) {
    console.error('Error occurred during scheduled scraping test:', error);
  }
});

console.log(`Automatic scraping test is running every ${testInterval}. Press Ctrl+C to stop.`);
