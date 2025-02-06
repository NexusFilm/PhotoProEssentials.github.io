'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}; 