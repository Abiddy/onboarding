# Supabase Setup for Onboarding Keywords Management

This guide will help you set up your Supabase project to enable the keywords management functionality in the onboarding flow.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project and note down your:
   - Supabase URL
   - Supabase anon key (public)

## 2. Configure Environment Variables

1. Update the `.env.local` file in your project with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Set Up Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the SQL from the `supabase-setup.sql` file in this project
3. Run the SQL to create the necessary tables, indexes, and policies

## 4. Configure Authentication (Optional)

For user-specific keywords:

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure your preferred sign-up methods (Email, OAuth providers, etc.)
3. Update your application to include authentication as needed

## 5. Test Your Setup

1. Run your application with `npm run dev`
2. Navigate to the Company Profile step
3. Try adding keywords by typing in the input and pressing Enter
4. Verify the keywords are saved to the database and persist across page reloads

## Database Schema

### Keywords Table

Stores all keywords across different categories:

```sql
CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Keyword Categories Table

Defines available categories for keywords:

```sql
CREATE TABLE keyword_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## How It Works

- Each set of keywords is associated with a specific category
- For opportunity keywords: `opportunity_keywords`
- For target personas: `target_personas`
- For authority level filters: `authority_title_filters` and `authority_department_filters`
- For persona-specific filters: Dynamic categories based on the persona name

## Troubleshooting

- **Keywords not appearing**: Check your browser console for errors, ensure Supabase credentials are correct
- **Database errors**: Verify the tables were created correctly using the SQL Editor in Supabase
- **Authentication issues**: Check if row-level security policies are correctly configured

## Next Steps

- Implement user authentication to enable user-specific keywords
- Add bulk import/export functionality for keywords
- Create admin tools for managing keywords across users 