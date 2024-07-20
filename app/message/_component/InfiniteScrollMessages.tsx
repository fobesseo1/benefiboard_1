'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchMessages,
  deleteMessage,
  markMessageAsRead,
  toggleStarMessage,
} from '../_action/message';
import { BiReply, BiStar, BiTrash } from 'react-icons/bi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type MessageType = {
  id: string;
  sender_id: string;
  receiver_id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
  is_starred_by_sender: boolean;
  is_starred_by_receiver: boolean;
  deleted_by_sender: boolean;
  deleted_by_receiver: boolean;
  userdata: {
    username: string;
    avatar_url: string;
  };
};

type InfiniteScrollMessagesProps = {
  initialMessages: MessageType[];
  filter: 'received' | 'sent' | 'starred';
  currentUserId: string;
};

function formatKoreanDate(dateString: string): string {
  return dateString.replace('T', ' ').substring(0, 19);
}

export default function InfiniteScrollMessages({
  initialMessages,
  filter,
  currentUserId,
}: InfiniteScrollMessagesProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2); // Page 1 is already loaded in initialMessages
  const [hasMore, setHasMore] = useState(true); // 메시지가 더 있는지 여부
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    console.log('messages:', messages); // 확인을 위해 콘솔 로그 추가
  }, [messages]);

  const handleObserver = async (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      setLoading(true);
      const newMessages = await fetchMessages(page, filter, currentUserId);
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
        setPage((prev) => prev + 1); // Increment page number
      } else {
        setHasMore(false); // 더 이상 로드할 메시지가 없으면 false로 설정
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    });

    if (ref.current && hasMore) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [loading, hasMore]);

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id, currentUserId);
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  };

  const handleReadMessage = async (id: string) => {
    await markMessageAsRead(id, currentUserId);
    setMessages((prevMessages) =>
      prevMessages.map((message) => (message.id === id ? { ...message, read: true } : message))
    );
  };

  const handleToggleStarMessage = async (e: React.MouseEvent, id: string, isStarred: boolean) => {
    e.stopPropagation(); // 이벤트 전파 중지
    await toggleStarMessage(id, isStarred, currentUserId);
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id
          ? {
              ...message,
              is_starred_by_sender:
                message.sender_id === currentUserId ? !isStarred : message.is_starred_by_sender,
              is_starred_by_receiver:
                message.receiver_id === currentUserId ? !isStarred : message.is_starred_by_receiver,
            }
          : message
      )
    );
  };

  const handleReply = (message: MessageType) => {
    const replyTitle = `Re: ${message.title}`;
    const encodedTitle = encodeURIComponent(replyTitle);
    router.push(`/message/create?receiver_id=${message.sender_id}&title=${encodedTitle}`);
  };

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Dialog key={message.id} onOpenChange={() => handleReadMessage(message.id)}>
            <DialogTrigger asChild>
              <div className="py-4 flex items-center gap-4 bg-white border-b-[1px] border-gray-200 cursor-pointer">
                {/* 좋아요 아이콘*/}
                <BiStar
                  size={24}
                  className={
                    message.sender_id === currentUserId
                      ? message.is_starred_by_sender
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                      : message.is_starred_by_receiver
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                  }
                  onClick={(e) =>
                    handleToggleStarMessage(
                      e,
                      message.id,
                      message.sender_id === currentUserId
                        ? message.is_starred_by_sender
                        : message.is_starred_by_receiver
                    )
                  }
                />
                {/* 제목 보낸이 시간 */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-semibold line-clamp-1">{message.title}</p>
                  <div className="flex gap-2">
                    <p className="text-xs text-gray-600">{message.userdata.username}</p>
                    <p className="text-xs text-gray-600">{formatKoreanDate(message.created_at)}</p>
                  </div>
                </div>
                {/* 답장 및 삭제 아이콘 */}
                <div className="flex gap-1">
                  <BiReply size={24} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={(e) => e.stopPropagation()}>
                        <BiTrash size={24} />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>삭제 확인</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        정말로 이 메시지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </DialogDescription>
                      <div className="mt-4 flex justify-end space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">취소</Button>
                        </DialogTrigger>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={message.userdata.avatar_url || '/default-avatar.png'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{message.userdata.username}</p>
                    <p className="text-sm text-gray-600">{formatKoreanDate(message.created_at)}</p>
                  </div>
                </div>
                <DialogHeader>
                  <DialogTitle>{message.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {message.content} {message.userdata.username} 님이 작성한 메시지입니다.
                </DialogDescription>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReply(message)}>
                  <BiReply className="mr-1" /> 답장
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <BiTrash className="mr-1" /> 삭제
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>삭제 확인</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      정말로 이 메시지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </DialogDescription>
                    <div className="mt-4 flex justify-end space-x-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">취소</Button>
                      </DialogTrigger>
                      <Button variant="destructive" onClick={() => handleDeleteMessage(message.id)}>
                        삭제
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogContent>
          </Dialog>
        ))
      ) : (
        <p className="hover:text-red-200 text-blue-400">No messages</p>
      )}
      {loading && <p>Loading...</p>}
      <div ref={ref} />
    </div>
  );
}
