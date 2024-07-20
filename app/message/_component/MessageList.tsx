// MessageList.tsx

'use client';

import { useState, useEffect } from 'react';
import { fetchMessages } from '../_action/message';
import InfiniteScrollMessages from './InfiniteScrollMessages';
import FixedIconMessage from './FixedIconMessage';
import MessageFilter from './MessageFilter';
import { MessageType } from './InfiniteScrollMessages';

interface MessageListProps {
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ currentUserId }) => {
  const [initialMessages, setInitialMessages] = useState<MessageType[]>([]);
  const [filter, setFilter] = useState<'received' | 'sent' | 'starred'>('received');

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const messages = await fetchMessages(1, filter, currentUserId);
      setInitialMessages(messages);
    };

    fetchInitialMessages();
  }, [filter, currentUserId]);

  useEffect(() => {
    console.log('initialMessages:', initialMessages); // 확인을 위해 콘솔 로그 추가
  }, [initialMessages]);

  return (
    <div>
      <MessageFilter filter={filter} setFilter={setFilter} />
      <div className=" flex flex-col px-4 pt-4 ">
        <InfiniteScrollMessages
          initialMessages={initialMessages}
          filter={filter}
          currentUserId={currentUserId}
        />
      </div>
      <FixedIconMessage />
    </div>
  );
};

export default MessageList;
