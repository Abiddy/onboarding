import { useState, useEffect, useCallback } from 'react';
import { getKeywords, addKeyword, deleteKeyword } from '@/lib/supabase';

interface Keyword {
  id: number;
  keyword: string;
  category: string;
  created_at: string;
}

export const useKeywords = (category: string) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch keywords
  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKeywords();
      
      // Filter by category if provided
      const filteredData = category 
        ? data.filter((kw: Keyword) => kw.category === category) 
        : data;
        
      setKeywords(filteredData);
    } catch (err) {
      console.error('Error in fetchKeywords:', err);
      setError('Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Add a new keyword
  const handleAddKeyword = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return;
    
    try {
      const newKeyword = await addKeyword(keyword.trim(), category);
      if (newKeyword) {
        setKeywords(prev => [...prev, newKeyword as Keyword]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding keyword:', err);
      setError('Failed to add keyword');
      return false;
    }
  }, [category]);

  // Delete a keyword
  const handleDeleteKeyword = useCallback(async (id: number) => {
    try {
      const success = await deleteKeyword(id);
      if (success) {
        setKeywords(prev => prev.filter(kw => kw.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting keyword:', err);
      setError('Failed to delete keyword');
      return false;
    }
  }, []);

  // Load keywords on initial mount and when category changes
  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return {
    keywords,
    loading,
    error,
    addKeyword: handleAddKeyword,
    deleteKeyword: handleDeleteKeyword,
    refreshKeywords: fetchKeywords
  };
}; 