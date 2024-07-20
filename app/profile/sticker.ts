export interface StickerType {
  id: string;
  url: string;
  position: { x: number; y: number };
  size: number;
}

export interface ProfileType {
  avatar_url?: string;
  email: string;
  id: string;
  username?: string;
  stickers?: StickerType[];
}
