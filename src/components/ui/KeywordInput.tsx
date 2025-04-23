import { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useKeywords } from '@/hooks/useKeywords';

interface KeywordInputProps {
  category: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  initialKeywords?: string[];
}

export const KeywordInput = ({
  category,
  placeholder = "Type keyword and press enter",
  label,
  helpText,
  initialKeywords = []
}: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const { keywords, loading, addKeyword, deleteKeyword } = useKeywords(category);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize with default keywords if no keywords exist in the database
  useEffect(() => {
    const initializeDefaultKeywords = async () => {
      // Only initialize once and only if we have initialKeywords but no keywords from DB
      if (!isInitialized && initialKeywords.length > 0 && !loading && keywords.length === 0) {
        // Add each initial keyword to the database
        for (const keyword of initialKeywords) {
          await addKeyword(keyword);
        }
        setIsInitialized(true);
      }
      
      // If we already have keywords in DB, mark as initialized
      if (!isInitialized && !loading && keywords.length > 0) {
        setIsInitialized(true);
      }
    };
    
    initializeDefaultKeywords();
  }, [initialKeywords, keywords, loading, addKeyword, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Split multiple keywords by comma
      const newKeywordTexts = inputValue.split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      
      // Add each keyword to the database
      for (const text of newKeywordTexts) {
        await addKeyword(text);
      }
      
      setInputValue('');
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {label.endsWith('*') ? '' : <span className="text-red-500">*</span>}
        </label>
      )}
      
      {helpText && (
        <p className="text-xs text-gray-500 mb-2">{helpText}</p>
      )}
      
      <Input 
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
        disabled={loading}
      />
      
      <div className="flex flex-wrap gap-2 mt-3">
        {loading ? (
          <div className="flex items-center text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading keywords...
          </div>
        ) : keywords.length === 0 ? (
          <p className="text-sm text-gray-500">No keywords added yet</p>
        ) : (
          keywords.map((keyword) => (
            <Badge 
              key={keyword.id}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1"
            >
              {keyword.keyword}
              <span 
                className="cursor-pointer" 
                onClick={() => deleteKeyword(keyword.id)}
              >
                ×
              </span>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default KeywordInput; 