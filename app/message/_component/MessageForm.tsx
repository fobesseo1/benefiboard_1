'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createMessage, searchUsers, fetchUserById } from '../_action/message';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';

export type UserPropsType = {
  sender_id: string;
  sender_name?: string;
  sender_email?: string;
  sender_avatar_url?: string;
};

export default function MessageForm({
  sender_id,
  sender_name,
  sender_avatar_url,
  sender_email,
}: UserPropsType) {
  const [receiverId, setReceiverId] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState<
    { id: string; username: string }[]
  >([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverIdFromParams = searchParams.get('receiver_id');
  const titleFromParams = searchParams.get('title');

  useEffect(() => {
    if (receiverIdFromParams) {
      (async () => {
        const user = await fetchUserById(receiverIdFromParams);
        if (user) {
          setReceiverId(user.id);
          setReceiverUsername(user.username);
        }
      })();
    }

    if (titleFromParams) {
      setTitle(decodeURIComponent(titleFromParams));
    }
  }, [receiverIdFromParams, titleFromParams]);

  const handleUsernameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setReceiverUsername(query);

    if (query.length > 1) {
      const users = await searchUsers(query);
      setUsernameSuggestions(users);
    } else {
      setUsernameSuggestions([]);
    }
  };

  const handleUserSelect = (userId: string, username: string) => {
    setReceiverId(userId);
    setReceiverUsername(username);
    setUsernameSuggestions([]);
  };

  const totalFormData = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    formData.append('sender_id', sender_id);
    formData.append('receiver_id', receiverId);
    formData.append('title', title);
    formData.append('content', content);
    if (sender_name) {
      formData.append('sender_name', sender_name);
    }
    if (sender_avatar_url) {
      formData.append('sender_avatar_url', sender_avatar_url);
    }
    if (sender_email) {
      formData.append('sender_email', sender_email);
    }

    try {
      await createMessage(formData);
      setDialogMessage('메시지가 성공적으로 전송되었습니다.');
    } catch (error) {
      setDialogMessage('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    router.push('/message');
  };

  return (
    <div className="mt-4 mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">쪽지 작성 페이지</h1>
      <form onSubmit={totalFormData} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="receiver_username">
            받는 사람
            <span className=" ml-2 text-xs text-gray-600">＊유저의 닉네임을 입력해주세요＊</span>
          </Label>
          <Input
            type="text"
            name="receiver_username"
            id="receiver_username"
            required
            value={receiverUsername}
            onChange={handleUsernameChange}
            disabled={!!receiverIdFromParams}
          />
          {usernameSuggestions.length > 0 && !receiverIdFromParams && (
            <ul className="bg-white border border-gray-200 mt-2">
              {usernameSuggestions.map((user) => (
                <li
                  key={user.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleUserSelect(user.id, user.username)}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">내용</Label>
          <Textarea
            name="content"
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Button type="submit">쪽지 보내기</Button>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>쪽지 전송 결과</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={handleDialogClose}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
