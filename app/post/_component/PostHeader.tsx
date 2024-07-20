import { postformatDate } from '@/lib/utils/formDate';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import AuthorProfileCard from './AuthProfileCard';
import Link from 'next/link';

const PostHeader = ({
  title,
  author,
  author_name,
  author_email,
  author_avatar_url,
  author_id,
  views,
  comments,
  created_at,
  point,
}: {
  title: string;
  author: string;
  author_name: string;
  author_avatar_url: string;
  author_email: string;
  author_id: string;
  views: number;
  comments: number;
  created_at: string;
  point: number;
}) => (
  <div className="flex flex-col justify-center gap-2 py-2 ">
    {/* 작성자 정보 */}
    <div className="flex items-center author">
      <Link href={`/profile/${author_id}`}>
        <img
          src={author_avatar_url || '/money-3d-main.png'}
          alt=""
          className="w-12 h-12 ring-1 rounded-full object-cover cursor-pointer"
        />
      </Link>

      <div className="flex-1 h-10 ml-2 bg-white flex flex-col justify-center ">
        <Link href={`/profile/${author_id}`}>
          <p className="text-sm text-gray-600 font-bold leading-tight tracking-tighter line-clamp-1 cursor-pointer">
            {author_name || author_email || 'unknown'}
          </p>
        </Link>
      </div>
      <Link href={`/message/create?receiver_id=${author_id}`}>
        <BiDotsVerticalRounded size={24} />
      </Link>
    </div>

    <hr />
    {/* 제목 및 포스트 정보 */}
    <div className="flex flex-col">
      <h2 className=" font-semibold mb-2 ">{title}</h2>
      <div className="flex gap-2">
        <p className="text-gray-600 text-xs font-semibold">조회수 {views || 0}</p>
        <p className="text-gray-600 text-xs font-semibold">댓글 {comments || 0}</p>
        <p className="text-gray-600 text-xs font-light">{postformatDate(created_at) || 0}</p>
      </div>
    </div>

    <hr />
  </div>
);

export default PostHeader;
