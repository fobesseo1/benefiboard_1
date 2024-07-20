// _component/ClientPostDetail.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PostLikeDislike from './PostLikeDislike';
import PostActions from './PostActions';
import Comments from './Comments';
import CommentDialog from './CommentDialog';
import { incrementViews } from '../_action/incrementViews';
import { deletePostById } from '../_action/post';
import {
  fetchCommentsByPostId,
  addComment,
  updateComment,
  deleteComment,
} from '../_action/comments';
import { CurrentUserType } from '@/types/types';

interface Comment {
  id: number;
  author: string;
  content: string;
  user_id: string;
  parent_id: number | null;
  children?: Comment[];
}

interface PostDetailPageProps {
  postId: string;
  initialUser: CurrentUserType | null;
  initialPost: any;
}

export default function ClientPostDetail({
  postId,
  initialUser,
  initialPost,
}: PostDetailPageProps) {
  const router = useRouter();
  const [showNumber, setShowNumber] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(
    null
  );
  const [views, setViews] = useState<number>(initialPost.views || 0);
  const [replyTo, setReplyTo] = useState<number | undefined>(undefined);
  const [user_id, setUser_id] = useState<string | null>(initialUser?.id || null);
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(initialUser);

  useEffect(() => {
    const updateViews = async () => {
      try {
        const newViews = await incrementViews(postId);
        setViews(newViews);
      } catch (error) {
        console.error('Failed to update views:', error);
      }
    };

    updateViews();
  }, [postId]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchCommentsByPostId(postId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    getComments();
  }, [postId]);

  const handleDeleteConfirm = async () => {
    if (user_id === initialPost?.author_id) {
      try {
        await deletePostById(postId);
        alert('게시물이 성공적으로 삭제되었습니다.');
        router.push('/post');
      } catch (error) {
        console.error('게시물 삭제 중 오류 발생:', error);
        alert('게시물 삭제 중 오류가 발생했습니다.');
      }
    } else {
      alert('이 게시물을 삭제할 권한이 없습니다.');
    }
  };

  const handleDialogSubmit = async (content: string, parentId: number | null = null) => {
    if (!user_id) {
      console.error('User ID is null');
      return;
    }

    const authorName = currentUser?.username || currentUser?.email || 'Unknown';

    try {
      if (editingComment) {
        await updateComment(editingComment.id, content);
      } else {
        await addComment(postId, user_id, authorName, content, parentId);
      }
      const data = await fetchCommentsByPostId(postId);
      setComments(data);
      setEditingComment(null);
      setReplyTo(undefined);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      const data = await fetchCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const openEditDialog = (comment: { id: number; content: string }) => {
    setEditingComment(comment);
    setIsDialogOpen(true);
  };

  const openReplyDialog = (commentId: number) => {
    setReplyTo(commentId);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 ">
      {user_id === initialPost?.author_id && (
        <PostActions id={postId} onConfirmDelete={handleDeleteConfirm} />
      )}
      <hr />
      <PostLikeDislike post_id={postId} user_id={user_id ?? ''} />
      <hr className="mb-8" />
      <div className="flex flex-col pt-4 border-t-[1px] border-gray-200">
        <Comments
          comments={comments}
          onDelete={handleDeleteComment}
          onEdit={openEditDialog}
          onReply={openReplyDialog}
          currentUser={
            currentUser || {
              id: '',
              username: null,
              email: '',
              avatar_url: null,
              current_points: 0,
            }
          }
        />
        <Button variant="outline" className="mt-4 shadow-md" onClick={() => setIsDialogOpen(true)}>
          댓글달기
        </Button>
      </div>

      {/* <Advertisement onButtonClick={() => setShowNumber(true)} /> */}
      <CommentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setReplyTo(undefined);
        }}
        onSubmit={handleDialogSubmit}
        initialContent={editingComment ? editingComment.content : ''}
        isEdit={!!editingComment}
        parentId={replyTo}
      />
    </div>
  );
}
