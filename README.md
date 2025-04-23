# Onboarding Flow Application

A step-by-step onboarding flow built with Next.js, Shadcn/UI, and Supabase for data persistence. This application demonstrates a multi-step validation process with a progress tracker and real-time data storage.

![Onboarding Screenshot](https://placeholder-for-screenshot.png)

## Features

- **Multi-step onboarding process** with validation between steps
- **Progress tracking** with visual indicators
- **Database persistence** of user inputs using Supabase
- **Form validation** ensuring required fields are completed
- **Responsive design** for all screen sizes
- **Reusable components** for consistent UI
- **RESTful API** for filter persistence and retrieval

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - For type safety and better developer experience
- **Shadcn/UI** - Component library for modern UI elements
- **Supabase** - Backend-as-a-service for database and authentication
- **Tailwind CSS** - For styling and responsive design
- **Zod** - For schema validation and type safety

## Project Structure

```
onboarding-demo/
├── src/
│   ├── app/ - Next.js app router pages
│   │   ├── api/ - API routes
│   │   │   └── filters/ - Filter API endpoints
│   ├── components/ - Reusable UI components
│   │   ├── ui/ - Shadcn UI components
│   │   ├── CompanyProfileComponent.tsx - Step 1 component
│   │   ├── PersonasComponent.tsx - Step 2 component
│   │   ├── AuthorityLevelsComponent.tsx - Step 3 component
│   │   └── InviteUsersComponent.tsx - Step 4 component
│   ├── hooks/ - Custom React hooks
│   │   ├── useKeywords.ts - Hook for keyword management
│   │   └── useFilters.ts - Hook for filter management
│   └── lib/ - Utility functions and services
│       ├── supabase.ts - Supabase client configuration
│       └── filters.ts - Filter validation and utilities
├── public/ - Static assets
└── supabase-setup.sql - Database schema setup
```

## API Documentation

### Filter API

The application provides a comprehensive RESTful API for managing filters:

#### `GET /api/filters`
- **Description**: Retrieve all filters for the current user
- **Query Parameters**:
  - `category` (optional): Filter by category
- **Response**: `{ filters: Filter[] }`

#### `POST /api/filters`
- **Description**: Create a new filter
- **Request Body**:
  ```json
  {
    "name": "Filter Name",
    "category": "personas",
    "criteria": {
      "conditions": [
        {
          "field": "title",
          "operator": "contains",
          "value": "Chief"
        }
      ],
      "logic": "and"
    }
  }
  ```
- **Response**: `{ filter: Filter }`

#### `GET /api/filters/[id]`
- **Description**: Retrieve a specific filter by ID
- **Response**: `{ filter: Filter }`

#### `PATCH /api/filters/[id]`
- **Description**: Update a specific filter
- **Request Body**: Partial filter object
- **Response**: `{ filter: Filter }`

#### `DELETE /api/filters/[id]`
- **Description**: Delete a specific filter
- **Response**: `{ success: true }`

### Filter Schema

Filters follow this schema:

```typescript
{
  id: number;
  name: string;
  category: string;
  criteria: {
    conditions: Array<{
      field: string;
      operator: string; // "equals", "contains", etc.
      value: string | number | boolean | string[] | number[];
    }>;
    logic: "and" | "or";
  };
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

## Implementation Steps

1. **Project Setup**
   - Created a Next.js application with TypeScript
   - Integrated Shadcn UI for component library
   - Set up Supabase for database persistence

2. **Onboarding Flow Architecture**
   - Implemented a step-based navigation system
   - Created a sidebar with progress tracking
   - Designed form validation between steps

3. **Form Components**
   - Built form components for each step of the onboarding process
   - Added validation for required fields
   - Implemented state management for form data

4. **Supabase Integration**
   - Created database tables for storing user data
   - Implemented hooks for data persistence
   - Added real-time synchronization capabilities

5. **KeywordInput Component**
   - Developed a reusable component for tag/keyword input
   - Added persistence of keywords to Supabase
   - Implemented category-based organization

6. **Progress Indicator**
   - Created a circular progress indicator
   - Added visual feedback for completed steps
   - Implemented percentage calculation for overall progress

7. **Navigation Logic**
   - Added validation to control progression between steps
   - Implemented step availability based on completion status
   - Added back/next navigation with appropriate controls

8. **Filter API Development**
   - Designed RESTful API endpoints for filter management
   - Implemented validation with Zod schema
   - Created client-side hooks for API interaction
   - Added filter application functionality

## Getting Started

### Prerequisites

- Node.js 18 or higher
- NPM or Yarn
- Supabase account for database functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/onboarding-demo.git
   cd onboarding-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file with Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the application

### Supabase Setup

Run the database schema setup script found in `supabase-setup.sql` in your Supabase SQL editor to create the necessary tables.

## Using the Filter API

Here's an example of using the filter hook in a component:

```tsx
import { useFilters } from '@/hooks/useFilters';

export default function FilterPage() {
  const { 
    filters, 
    loading, 
    error, 
    createFilter, 
    updateFilter, 
    deleteFilter 
  } = useFilters({ category: 'personas' });
  
  const handleCreateFilter = async () => {
    await createFilter({
      name: 'Executive Filter',
      category: 'personas',
      criteria: {
        conditions: [
          { field: 'title', operator: 'contains', value: 'CEO' },
          { field: 'title', operator: 'contains', value: 'CTO' }
        ],
        logic: 'or'
      }
    });
  };
  
  return (
    <div>
      {loading ? (
        <p>Loading filters...</p>
      ) : (
        <ul>
          {filters.map(filter => (
            <li key={filter.id}>{filter.name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleCreateFilter}>Add Filter</button>
    </div>
  );
}
```

## Lessons Learned

During this project, we:

1. **Managed React state effectively** with hooks like useState, useEffect, and useCallback
2. **Prevented infinite update loops** by carefully managing dependencies in useEffect
3. **Built a validation system** for multi-step forms
4. **Created reusable components** that maintain their own state while communicating with parent components
5. **Implemented TypeScript** for better type safety and documentation
6. **Integrated Supabase** for real-time database operations
7. **Designed a RESTful API** following best practices for data management
8. **Implemented schema validation** with Zod for type safety

## Future Improvements

- Add user authentication for personalized onboarding
- Implement undo/redo functionality for form edits
- Add data visualization for company profiles
- Create a dashboard view after onboarding completion
- Add comprehensive testing with Jest and React Testing Library
- Implement filter sharing capabilities between users

## License

This project is licensed under the MIT License - see the LICENSE file for details.
