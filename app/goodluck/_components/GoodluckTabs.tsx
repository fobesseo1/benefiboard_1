'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TitleComponent from './TitleComponent';
import LotteryComponent from './Lottery';
import PensionComponent from './Pension';

const GoodluckTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('lottery');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getTitle = (tab: string) => {
    switch (tab) {
      case 'lottery':
        return '로또';
      case 'pension':
        return '연금복권';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center w-96 px-6">
      <div className="self-start w-full">
        <TitleComponent title={getTitle(activeTab)} />
      </div>
      <Tabs defaultValue="lottery" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lottery">로또</TabsTrigger>
          <TabsTrigger value="pension">연금복권</TabsTrigger>
        </TabsList>
        <TabsContent value="lottery">
          <div className="flex items-center justify-center">
            <LotteryComponent />
          </div>
        </TabsContent>
        <TabsContent value="pension">
          <div className="flex items-center justify-center">
            <PensionComponent />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoodluckTabs;
