// app/repost/_component/RepostItem.tsx

import React from 'react';
import { CurrentUserType, RepostType } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { listformatDate } from '@/lib/utils/formDate';
import { siteColors } from './SiteFilter';
import classNames from 'classnames';

interface RepostItemProps {
  post: RepostType;
  currentUser: CurrentUserType | null;
  onPostClick: (post: RepostType) => void;
  isRead: boolean;
}

const RepostItem: React.FC<RepostItemProps> = ({ post, currentUser, onPostClick, isRead }) => {
  const getBadgeColor = (site: string) => {
    return siteColors[site] || 'gray';
  };

  return (
    <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 mx-auto">
      <div className="flex justify-between items-center">
        <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
          <div className="flex items-center">
            <Badge className={classNames(`bg-${getBadgeColor(post.site)}-500`)}>
              {post.site || '아무거나'}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-gray-600">{listformatDate(post.created_at) || 'No time'}</p>
      </div>
      <div className="flex-1 pt-2 pb-2 cursor-pointer" onClick={() => onPostClick(post)}>
        <p
          className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
            isRead ? 'text-gray-400' : ''
          }`}
        >
          {post.title}
        </p>
      </div>
    </div>
  );
};

export default RepostItem;
