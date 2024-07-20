//app>post>[catergoryId]\page.tsx

import { getCurrentUser } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import { calculatePoints } from '../_action/adPoint';
import { findCategoryNameById } from '../_action/category';
import SearchBar from '../_component/SearchBar';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '@/types/types';
import PagedPosts from '../_component/PagedPosts';

interface PageProps {
  params: { categoryId: string };
  searchParams: { page?: string };
}

export default async function PostListPageByCategory({ params, searchParams }: PageProps) {
  const { categoryId } = params;
  const page = Number(searchParams.page) || 1;
  const pageSize = 20; // 페이지당 게시물 수

  const supabase = await createSupabaseServerClient();

  // 총 게시물 수 가져오기
  const { count, error: countError } = await supabase
    .from('post')
    .select('*', { count: 'exact', head: true })
    .eq('parent_category_id', categoryId);

  if (countError) {
    console.error('Error fetching post count:', countError);
    return <div>Error loading posts</div>;
  }

  const totalCount = count || 0;

  // 현재 페이지의 게시물 가져오기
  const { data: posts, error } = await supabase
    .from('post')
    .select('*')
    .eq('parent_category_id', categoryId)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const currentUser: CurrentUserType | null = await getCurrentUser();

  const postsData = posts || [];

  const initialPosts: PostType[] = await Promise.all(
    postsData.map(async (post) => {
      const parentCategoryName = await findCategoryNameById(post.parent_category_id);
      const childCategoryName = await findCategoryNameById(post.child_category_id);
      return {
        ...post,
        parent_category_name: parentCategoryName,
        child_category_name: childCategoryName,
      };
    })
  );

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  // Fetching the round data
  let roundData;
  if (currentUser) {
    const { data, error: roundError } = await supabase
      .from('user_rounds')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (roundError) {
      console.log('Error fetching user round data:', roundError.message);
    } else {
      roundData = data;
    }
  } else {
    // 로그인하지 않은 사용자의 경우 임시 라운드 데이터를 생성
    roundData = {
      round_points: calculatePoints(),
      current_round_index: 0,
    };
  }

  // 검색 제안을 위해 제목 목록 생성
  const searchSuggestions = Array.from(new Set(postsData.map((post) => post.title)));

  return (
    <div className="pt-4">
      <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />

      <div className="flex flex-col px-4 pt-4 ">
        <PagedPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
          categoryId={categoryId}
          totalCount={totalCount}
          currentPage={page}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
