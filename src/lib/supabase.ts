import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Default anonymous user ID for demo purposes
const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

// Check if user is authenticated, otherwise use anonymous ID
const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || ANONYMOUS_USER_ID;
};

// Keywords related functions
export const getKeywords = async () => {
  const userId = await getUserId();
  
  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching keywords:', error);
    return [];
  }
  
  return data || [];
};

export const addKeyword = async (keyword: string, category: string) => {
  const userId = await getUserId();
  
  const { data, error } = await supabase
    .from('keywords')
    .insert([{ keyword, category, user_id: userId }])
    .select();
  
  if (error) {
    console.error('Error adding keyword:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteKeyword = async (id: number) => {
  const userId = await getUserId();
  
  const { error } = await supabase
    .from('keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting keyword:', error);
    return false;
  }
  
  return true;
};

// Categories for organizing keywords
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('keyword_categories')
    .select('*');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
}; 