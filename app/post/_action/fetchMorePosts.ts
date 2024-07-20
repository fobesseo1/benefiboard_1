'use server';

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import { PostType } from '@/types/types';
import { findCategoryNameById } from './category';

const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

export const fetchMorePosts = cache(
  async (page: number, categoryId?: string): Promise<PostType[]> => {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from('post')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);

    if (categoryId) {
      query = query.eq('parent_category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    const postsWithCategories = await Promise.all(
      data.map(
        async (post): Promise<PostType> => ({
          ...post,
          parent_category_name: await findCategoryNameById(post.parent_category_id),
          child_category_name: await findCategoryNameById(post.child_category_id),
        })
      )
    );

    return postsWithCategories;
  }
);

export const fetchSearchPosts = cache(
  async (searchTerm: string, page: number): Promise<PostType[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('post')
      .select('*')
      .ilike('title', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);

    if (error) {
      console.error('Error fetching search posts:', error);
      return [];
    }

    const postsWithCategories = await Promise.all(
      data.map(
        async (post): Promise<PostType> => ({
          ...post,
          parent_category_name: await findCategoryNameById(post.parent_category_id),
          child_category_name: await findCategoryNameById(post.child_category_id),
        })
      )
    );

    return postsWithCategories;
  }
);
