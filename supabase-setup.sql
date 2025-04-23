-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  category TEXT NOT NULL,
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- Create the 'filters' table for storing filter definitions
CREATE TABLE IF NOT EXISTS filters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '{"conditions": [], "logic": "and"}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on filter category for faster retrieval
CREATE INDEX IF NOT EXISTS idx_filters_category ON filters(category);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp when a filter is updated
DROP TRIGGER IF EXISTS set_filters_updated_at ON filters;
CREATE TRIGGER set_filters_updated_at
BEFORE UPDATE ON filters
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS keywords_category_idx ON keywords (category);
CREATE INDEX IF NOT EXISTS keywords_user_id_idx ON keywords (user_id);

-- For demo purposes: Make permissions more open
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE filters ENABLE ROW LEVEL SECURITY;

-- Allow read access to filters and keywords for anyone
CREATE POLICY filters_select_policy ON filters
  FOR SELECT USING (true);
  
CREATE POLICY keywords_select_policy ON keywords
  FOR SELECT USING (true);

-- Allow insert, update, delete access
CREATE POLICY filters_insert_policy ON filters
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY filters_update_policy ON filters
  FOR UPDATE USING (true);
  
CREATE POLICY filters_delete_policy ON filters
  FOR DELETE USING (true);
  
CREATE POLICY keywords_insert_policy ON keywords
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY keywords_update_policy ON keywords
  FOR UPDATE USING (true);
  
CREATE POLICY keywords_delete_policy ON keywords
  FOR DELETE USING (true);

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