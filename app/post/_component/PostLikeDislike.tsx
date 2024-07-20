import { useState, useEffect } from 'react';
import { BiDislike, BiLike } from 'react-icons/bi';
import { fetchLikesDislikes, toggleLike } from '../_action/like';

interface Props {
  post_id: string;
  user_id: string | null;
}

export default function PostLikeDislike({ post_id, user_id }: Props) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLike, setUserLike] = useState<boolean | null>(null); // null: no action, true: liked, false: disliked

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { likes, dislikes, likeUsers } = await fetchLikesDislikes(post_id);
        setLikes(likes);
        setDislikes(dislikes);

        // 현재 사용자가 좋아요를 눌렀는지 확인
        if (likeUsers.some((likeUser) => likeUser.user_id === user_id && likeUser.liked === true)) {
          setUserLike(true);
        } else if (
          likeUsers.some((likeUser) => likeUser.user_id === user_id && likeUser.liked === false)
        ) {
          setUserLike(false);
        } else {
          setUserLike(null);
        }
      } catch (error) {
        console.error('Error fetching likes/dislikes:', error);
      }
    };

    fetchData();
  }, [post_id, user_id]);

  const handleLike = async () => {
    if (!user_id) {
      console.log('User is not logged in');
      return; // 로그인하지 않은 사용자는 클릭 이벤트 무시
    }

    try {
      const newLikeState = userLike === true ? null : true;
      setUserLike(newLikeState);
      if (newLikeState === true) {
        setLikes((prev) => prev + 1);
        if (userLike === false) {
          setDislikes((prev) => prev - 1);
        }
      } else {
        setLikes((prev) => prev - 1);
      }
      await toggleLike(post_id, user_id, newLikeState);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDislike = async () => {
    if (!user_id) {
      console.log('User is not logged in');
      return; // 로그인하지 않은 사용자는 클릭 이벤트 무시
    }

    try {
      const newDislikeState = userLike === false ? null : false;
      setUserLike(newDislikeState);
      if (newDislikeState === false) {
        setDislikes((prev) => prev + 1);
        if (userLike === true) {
          setLikes((prev) => prev - 1);
        }
      } else {
        setDislikes((prev) => prev - 1);
      }
      await toggleLike(post_id, user_id, newDislikeState);
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  return (
    <div className="flex w-4/5 h-12 items-center justify-center gap-4  mx-auto">
      <div className="flex w-full justify-center gap-3 items-center">
        <div
          className={`flex gap-2 items-center cursor-pointer ${
            userLike === true ? 'text-red-600' : ''
          }`}
          onClick={handleLike}
        >
          <BiLike size={24} />
          <p>좋아요</p>
        </div>
        <p className={`flex-shrink-0 ${userLike === true ? 'text-red-600' : ''}`}>{likes}</p>
      </div>

      <p className="text-gray-400 font-semibold">|</p>

      <div className="flex w-full justify-center gap-3 items-center">
        <div
          className={`flex gap-2 items-center cursor-pointer ${
            userLike === false ? 'text-gray-600' : 'text-gray-400'
          }`}
          onClick={handleDislike}
        >
          <BiDislike size={24} />
          <p>싫어요</p>
        </div>
        <p className={`flex-shrink-0 ${userLike === false ? 'text-gray-600' : 'text-gray-400'}`}>
          {dislikes}
        </p>
      </div>
    </div>
  );
}
