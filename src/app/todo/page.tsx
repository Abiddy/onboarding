'use client';

import { useState, useEffect } from 'react';
import KeywordInput from '@/components/ui/KeywordInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getKeywords, addKeyword, deleteKeyword } from '@/lib/supabase';

export default function TodoApp() {
  const [categoryKeywords, setCategoryKeywords] = useState({
    'Task Categories': [],
    'Priority Levels': []
  });
  const [loading, setLoading] = useState(true);

  // Load keywords from Supabase on component mount
  useEffect(() => {
    const loadKeywords = async () => {
      setLoading(true);
      try {
        const keywords = await getKeywords();
        
        // Group keywords by category
        const groupedKeywords = keywords.reduce((acc, kw) => {
          if (!acc[kw.category]) {
            acc[kw.category] = [];
          }
          acc[kw.category].push(kw);
          return acc;
        }, {});
        
        setCategoryKeywords({
          'Task Categories': groupedKeywords['Task Categories'] || [],
          'Priority Levels': groupedKeywords['Priority Levels'] || []
        });
      } catch (error) {
        console.error('Error loading keywords:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadKeywords();
  }, []);

  // Handle adding a new keyword
  const handleAddKeyword = async (text: string, category: string) => {
    try {
      const newKeyword = await addKeyword(text, category);
      if (newKeyword) {
        setCategoryKeywords(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), newKeyword]
        }));
      }
      return newKeyword?.id;
    } catch (error) {
      console.error(`Error adding keyword to ${category}:`, error);
      return null;
    }
  };

  // Handle deleting a keyword
  const handleDeleteKeyword = async (id: number, category: string) => {
    try {
      const success = await deleteKeyword(id);
      if (success) {
        setCategoryKeywords(prev => ({
          ...prev,
          [category]: prev[category].filter(kw => kw.id !== id)
        }));
      }
      return success;
    } catch (error) {
      console.error(`Error deleting keyword from ${category}:`, error);
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <KeywordInput 
              category="Task Categories"
              label="Task Categories"
              placeholder="Add a category and press Enter"
              helpText="Add categories like 'Work', 'Personal', 'Shopping'"
              initialKeywords={categoryKeywords['Task Categories']?.map(k => k.keyword) || []}
              onAddKeyword={(text) => handleAddKeyword(text, 'Task Categories')}
              onDeleteKeyword={(id) => handleDeleteKeyword(id, 'Task Categories')}
              loading={loading}
            />

            <KeywordInput 
              category="Priority Levels"
              label="Priority Levels"
              placeholder="Add a priority level and press Enter"
              helpText="Add priorities like 'High', 'Medium', 'Low'"
              initialKeywords={categoryKeywords['Priority Levels']?.map(k => k.keyword) || []}
              onAddKeyword={(text) => handleAddKeyword(text, 'Priority Levels')}
              onDeleteKeyword={(id) => handleDeleteKeyword(id, 'Priority Levels')}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Todo Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Todo functionality will go here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 