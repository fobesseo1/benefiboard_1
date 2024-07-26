//app>datafetch>DataFetchClient.tsx

'use client';

import React, { useState } from 'react';
import { scrapeAndSave, scrapeAndSaveBest } from '../actions/scrapeActions';

interface ScrapeResult {
  success: boolean;
  message: string;
  nextIndex: number;
  totalItems: number;
  error?: string;
}

const DataFetchClient: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScrape = async (action: 'scrape' | 'scrapeBest') => {
    setIsLoading(true);
    setMessage('Scraping in progress...');
    let nextIndex = 0;
    let isFreshStart = true;

    try {
      while (true) {
        const result: ScrapeResult =
          action === 'scrape'
            ? await scrapeAndSave(nextIndex, isFreshStart)
            : await scrapeAndSaveBest(nextIndex, isFreshStart);

        if (!result.success) {
          setMessage(`Error: ${result.error || 'An unknown error occurred'}`);
          break;
        }

        nextIndex = result.nextIndex;
        const progress = Math.round((nextIndex / result.totalItems) * 100);
        setMessage(`Scraping in progress... ${progress}% complete`);

        if (nextIndex >= result.totalItems) {
          setMessage(result.message);
          break;
        }

        isFreshStart = false;
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Fetch Page</h1>
      <div className="space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleScrape('scrape')}
          disabled={isLoading}
        >
          Scrape Data
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleScrape('scrapeBest')}
          disabled={isLoading}
        >
          Scrape Best Data
        </button>
      </div>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default DataFetchClient;
