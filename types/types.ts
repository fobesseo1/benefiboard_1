export type CurrentUserType = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
  donation_id: string | null;
  partner_name: string | null;
  unread_messages_count: number;
};

export type PostType = {
  id: string;
  title: string;
  created_at: string;
  views: number;
  comments: number;
  author_id: string;
  author_name: string;
  author_email: string;
  author_avatar_url: string;
  parent_category_id: string;
  child_category_id: string;
  likes: number;
  dislikes: number;
  parent_category_name: string;
  child_category_name: string;
};

export type RepostType = {
  id: number;
  link: string;
  title: string;
  site: string;
  created_at: string;
  batch: number;
  order: number;
};
