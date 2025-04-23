import { z } from "zod";

// Define the filter criteria schema
export const FilterCriteriaSchema = z.object({
  conditions: z.array(
    z.object({
      field: z.string(),
      operator: z.enum([
        "equals", 
        "not_equals", 
        "contains", 
        "not_contains", 
        "starts_with", 
        "ends_with", 
        "greater_than", 
        "less_than",
        "in",
        "not_in"
      ]),
      value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.array(z.number())
      ])
    })
  ),
  logic: z.enum(["and", "or"]).default("and")
});

// Define the filter schema
export const FilterSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  criteria: FilterCriteriaSchema,
  is_active: z.boolean().default(true),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// Filter type definitions
export type FilterCriteria = z.infer<typeof FilterCriteriaSchema>;
export type Filter = z.infer<typeof FilterSchema>;

/**
 * Validates a filter against the schema
 * @param filter The filter to validate
 * @returns A result object with success flag and either the validated filter or error messages
 */
export function validateFilter(filter: any) {
  try {
    const validatedFilter = FilterSchema.parse(filter);
    return {
      success: true,
      data: validatedFilter,
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: '', message: 'Unknown validation error' }]
    };
  }
}

/**
 * Prepares a filter for saving to the database by removing any undefined values
 * and ensuring all required fields are present
 * @param filter The filter to prepare
 * @returns The prepared filter ready for database insertion/update
 */
export function prepareFilterForSave(filter: Partial<Filter>): Omit<Filter, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  
  // Set default values for any missing fields
  const preparedFilter = {
    name: filter.name || '',
    category: filter.category || '',
    criteria: filter.criteria || { conditions: [], logic: 'and' },
    is_active: filter.is_active !== undefined ? filter.is_active : true
  };
  
  // Validate the filter
  const validation = validateFilter(preparedFilter);
  if (!validation.success) {
    throw new Error(`Invalid filter: ${JSON.stringify(validation.errors)}`);
  }
  
  return preparedFilter;
}

/**
 * Applies a filter to a dataset
 * @param data The dataset to filter
 * @param filter The filter to apply
 * @returns The filtered dataset
 */
export function applyFilter<T>(data: T[], filter: Filter): T[] {
  const { criteria } = filter;
  
  return data.filter(item => {
    const results = criteria.conditions.map(condition => {
      const { field, operator, value } = condition;
      const itemValue = getNestedProperty(item, field);
      
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
    
    return criteria.logic === 'and'
      ? results.every(Boolean)
      : results.some(Boolean);
  });
}

/**
 * Helper function to check if an array includes a value
 * This handles the TypeScript error with the includes method
 */
function includesValue(array: any[], value: any): boolean {
  return array.some(item => item === value);
}

/**
 * Gets a nested property from an object using a dot-notation path
 * @param obj The object to get the property from
 * @param path The path to the property in dot notation (e.g., "user.address.city")
 * @returns The value at the specified path or undefined if not found
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
} 