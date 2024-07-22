// app/datafetch/DataFetchClient.tsx
'use client';

import { useState } from 'react';
import { scrapeAndSave, scrapeAndSaveBest } from '../actions/scrapeActions';

const DataFetchClient = () => {
  const [message, setMessage] = useState<string>('');

  const handleScrape = async (action: 'scrape' | 'scrapeBest') => {
    setMessage('Scraping in progress...');
    try {
      const result = action === 'scrape' ? await scrapeAndSave() : await scrapeAndSaveBest();

      setMessage(
        result.success
          ? result.message || 'Operation completed successfully'
          : `Error: ${result.error || 'An unknown error occurred'}`
      );
    } catch (error) {
      setMessage('An unexpected error occurred');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Fetch Page</h1>
      <div className="space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleScrape('scrape')}
        >
          Scrape Data
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleScrape('scrapeBest')}
        >
          Scrape Best Data
        </button>
      </div>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default DataFetchClient;
