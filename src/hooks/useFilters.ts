import { useState, useEffect, useCallback } from 'react';
import { Filter, prepareFilterForSave } from '@/lib/filters';

interface UseFiltersOptions {
  category?: string;
  autoFetch?: boolean;
}

interface UseFiltersReturn {
  filters: Filter[];
  loading: boolean;
  error: string | null;
  fetchFilters: () => Promise<Filter[]>;
  createFilter: (filter: Partial<Filter>) => Promise<Filter>;
  applyFilters: <T>(data: T[]) => T[];
}

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { category, autoFetch = true } = options;
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all filters for the current user, optionally filtered by category
   */
  const fetchFilters = useCallback(async (): Promise<Filter[]> => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/filters';
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch filters');
      }
      
      const data = await response.json();
      setFilters(data.filters);
      return data.filters;
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching filters');
      return [];
    } finally {
      setLoading(false);
    }
  }, [category]);


  /**
   * Create a new filter
   */
  const createFilter = async (filter: Partial<Filter>): Promise<Filter> => {
    try {
      setError(null);
      
      // Validate and prepare the filter
      const preparedFilter = prepareFilterForSave(filter);
      
      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedFilter),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create filter');
      }
      
      const data = await response.json();
      
      // Update local state
      setFilters(prevFilters => [...prevFilters, data.filter]);
      
      return data.filter;
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the filter');
      throw err;
    }
  };


  /**
   * Apply all current filters to a dataset
   */
  const applyFilters = <T>(data: T[]): T[] => {
    if (filters.length === 0) return data;
    
    let filteredData = [...data];
    
    // Apply each filter sequentially
    filters.forEach(filter => {
      if (filter.is_active) {
        filteredData = filteredData.filter(item => {
          const { criteria } = filter;
          
          // Map over conditions and check if they match
          const conditionResults = criteria.conditions.map(condition => {
            const { field, operator, value } = condition;
            const itemValue = getNestedValue(item, field);
            
            switch (operator) {
              case 'equals':
                return itemValue === value;
              case 'not_equals':
                return itemValue !== value;
              case 'contains':
                return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
              case 'not_contains':
                return !String(itemValue).toLowerCase().includes(String(value).toLowerCase());
              case 'starts_with':
                return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
              case 'ends_with':
                return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
              case 'greater_than':
                return Number(itemValue) > Number(value);
              case 'less_than':
                return Number(itemValue) < Number(value);
              case 'in':
                return Array.isArray(value) && includesValue(value, itemValue);
              case 'not_in':
                return Array.isArray(value) && !includesValue(value, itemValue);
              default:
                return false;
            }
          });
          
          // If logic is 'and', all conditions must be true
          // If logic is 'or', at least one condition must be true
          return criteria.logic === 'and'
            ? conditionResults.every(Boolean)
            : conditionResults.some(Boolean);
        });
      }
    });
    
    return filteredData;
  };

  /**
   * Helper function to check if an array includes a value
   * This handles the TypeScript error with the includes method
   */
  function includesValue(array: any[], value: any): boolean {
    return array.some(item => item === value);
  }

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((prev, curr) => {
      return prev && typeof prev === 'object' ? prev[curr] : undefined;
    }, obj);
  };

  // Auto-fetch filters on mount
  useEffect(() => {
    if (autoFetch) {
      fetchFilters();
    }
  }, [fetchFilters, autoFetch]);

  return {
    filters,
    loading,
    error,
    fetchFilters,
    createFilter,
    applyFilters
  };
} 