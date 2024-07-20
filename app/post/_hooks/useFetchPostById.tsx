// hooks/useFetchPostById.ts
import { useState, useEffect } from 'react';
import { fetchPostById } from '../_action/post';

export const useFetchPostById = (id: string) => {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
        if (!data) {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, error, loading };
};
