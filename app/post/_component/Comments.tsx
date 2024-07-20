import IconToggle from './IconToggleComments';
import React from 'react';
import { CurrentUserType } from '@/types/types';

interface Comment {
  id: number;
  author: string;
  content: string;
  user_id: string;
  parent_id: number | null;
  children?: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  onDelete: (commentId: number) => void;
  onEdit: (comment: { id: number; content: string }) => void;
  onReply: (commentId: number) => void;
  currentUser: Partial<CurrentUserType>;
}

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap: { [key: number]: Comment } = {};
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    comment.children = [];
    commentMap[comment.id] = comment;

    if (comment.parent_id === null) {
      roots.push(comment);
    } else {
      const parentComment = commentMap[comment.parent_id];
      if (parentComment) {
        parentComment.children!.push(comment);
      }
    }
  });

  return roots;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  onDelete,
  onEdit,
  onReply,
  currentUser,
}) => {
  const renderComments = (comments: Comment[]) => {
    return comments.map((comment, index) => (
      <React.Fragment key={comment.id}>
        <div className="my-4 flex flex-col">
          <div className="flex">
            <div className="flex-1 flex flex-col items-start">
              <div className="font-semibold">{comment.author}</div>
              <div>{comment.content}</div>
            </div>
            <IconToggle
              onEdit={() => onEdit({ id: comment.id, content: comment.content })}
              onDelete={() => onDelete(comment.id)}
              onReply={() => onReply(comment.id)}
              showEditDelete={comment.user_id === currentUser.id}
            />
          </div>
          {comment.children && comment.children.length > 0 && (
            <div className="ml-4 mt-2">{renderComments(comment.children)}</div>
          )}
        </div>
        {index < comments.length - 1 && <hr className="border-t border-gray-200 my-2" />}
      </React.Fragment>
    ));
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div>
      {commentTree.length === 0 ? (
        <p className="text-gray-600 mb-4">댓글 {comments.length}</p>
      ) : (
        <>
          <p className="text-gray-600 mb-4">댓글 {comments.length}</p>
          <hr className="border-t border-gray-200 mb-4" />
          {renderComments(commentTree)}
        </>
      )}
    </div>
  );
};

export default Comments;
