import { Database } from './database.types';

declare global {
  type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];
  type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
}
