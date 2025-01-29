import { createBrowserClient } from '@supabase/ssr';

import { SUPABASEURL, SUPABASEKEY } from './supabase_credentials';

function createClient(supabaseUrl: string, supabaseAnonKey: string) {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient(SUPABASEURL, SUPABASEKEY);
