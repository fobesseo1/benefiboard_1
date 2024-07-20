// app/repost/_components/SiteFilter.tsx
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

export const siteColors: { [key: string]: string } = {
  전체: 'gray',
  웃대: 'red',
  펨코: 'orange',
  인벤: 'amber',
  엠팍: 'green',
  루리: 'emerald',
  오유: 'teal',
  SLR: 'cyan',
  '82쿡': 'sky',
  클리앙: 'indigo',
  인티: 'violet',
  보배: 'purple',
  더쿠: 'fuchsia',
  디씨: 'stone',
  유머픽: 'lime',
  뽐뿌: 'rose',
};

type SiteFilterProps = {
  selectedSites: string[];
  onSiteToggle: (site: string) => void;
};

export default function SiteFilter({ selectedSites, onSiteToggle }: SiteFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {Object.entries(siteColors).map(([site, color]) => (
        <Badge
          key={site}
          className={`cursor-pointer ${
            selectedSites.length === 0 && site === '전체'
              ? `bg-${color}-500`
              : selectedSites.includes(site)
                ? `bg-${color}-500`
                : 'bg-gray-300'
          }`}
          onClick={() => onSiteToggle(site)}
        >
          {site}
        </Badge>
      ))}
    </div>
  );
}
