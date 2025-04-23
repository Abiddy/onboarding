-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'
);

-- Create keyword categories table
CREATE TABLE IF NOT EXISTS keyword_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO keyword_categories (name, description)
VALUES
  ('opportunity_keywords', 'Keywords for identifying opportunities'),
  ('target_personas', 'Target personas for filtering opportunities'),
  ('authority_title_filters', 'Filters for authority titles'),
  ('authority_department_filters', 'Filters for authority departments')
ON CONFLICT (name) DO NOTHING;

-- Alter RLS policies to be more permissive for demo
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- For demo purposes: Allow anyone to select/read keywords
CREATE POLICY keywords_select_policy ON keywords
  FOR SELECT USING (true);

-- Policy to allow users to insert, requiring user_id match
CREATE POLICY keywords_insert_policy ON keywords
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own keywords
CREATE POLICY keywords_update_policy ON keywords
  FOR UPDATE USING (true);

-- Policy to allow users to delete their own keywords
CREATE POLICY keywords_delete_policy ON keywords
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS keywords_category_idx ON keywords (category);
CREATE INDEX IF NOT EXISTS keywords_user_id_idx ON keywords (user_id);

-- Insert some sample keywords for demonstration
INSERT INTO keywords (keyword, category, user_id)
VALUES
  ('Higher education', 'opportunity_keywords', '00000000-0000-0000-0000-000000000000'),
  ('Student success', 'opportunity_keywords', '00000000-0000-0000-0000-000000000000'),
  ('Degree completion', 'opportunity_keywords', '00000000-0000-0000-0000-000000000000'),
  ('Student retention', 'opportunity_keywords', '00000000-0000-0000-0000-000000000000'),
  ('Academic pathways', 'opportunity_keywords', '00000000-0000-0000-0000-000000000000'),
  ('Education', 'target_personas', '00000000-0000-0000-0000-000000000000'),
  ('HR', 'target_personas', '00000000-0000-0000-0000-000000000000'),
  ('IT', 'target_personas', '00000000-0000-0000-0000-000000000000'); 