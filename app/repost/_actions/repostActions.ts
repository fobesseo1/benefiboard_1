// app/repost/_actions/repostActions.ts
'use server';

import { cache } from 'react';
import createSupabaseServerClient from '@/lib/supabse/server';
import { RepostType } from '@/types/types';

const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

function buildSearchQuery(query: string | null) {
  if (!query) return null;
  const trimmedQuery = query.trim();
  return trimmedQuery.length === 0 ? null : trimmedQuery;
}

export const fetchReposts = cache(
  async (query: string | null, page: number = 1, pageSize: number = 20, sites: string[] = []) => {
    const supabase = await createSupabaseServerClient();

    let supabaseQuery = supabase.from('repost_data').select('*', { count: 'exact' });

    const searchTerm = buildSearchQuery(query);
    if (searchTerm) {
      supabaseQuery = supabaseQuery.filter('title', 'ilike', `%${searchTerm}%`);
    }

    if (sites.length > 0) {
      supabaseQuery = supabaseQuery.in('site', sites);
    }

    const { data, error, count } = await supabaseQuery
      .order('batch', { ascending: false })
      .order('order', { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Error fetching reposts:', error);
      throw new Error('Failed to fetch reposts');
    }

    return { data: data as RepostType[], totalCount: count };
  }
);

export const fetchBestReposts = cache(
  async (query: string | null, page: number = 1, pageSize: number = 20, sites: string[] = []) => {
    const supabase = await createSupabaseServerClient();

    let supabaseQuery = supabase.from('repost_best_data').select('*', { count: 'exact' });

    const searchTerm = buildSearchQuery(query);
    if (searchTerm) {
      supabaseQuery = supabaseQuery.filter('title', 'ilike', `%${searchTerm}%`);
    }

    if (sites.length > 0) {
      supabaseQuery = supabaseQuery.in('site', sites);
    }

    const { data, error, count } = await supabaseQuery
      .order('batch', { ascending: false })
      .order('order', { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Error fetching best reposts:', error);
      throw new Error('Failed to fetch best reposts');
    }

    return { data: data as RepostType[], totalCount: count };
  }
);
