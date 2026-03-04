-- Create professions salary table
CREATE TABLE IF NOT EXISTS professions_salary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  min_salary DECIMAL(10,2),
  max_salary DECIMAL(10,2),
  avg_salary DECIMAL(10,2),
  median_salary DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'BYN',
  source VARCHAR(255),
  region VARCHAR(100),
  year INTEGER DEFAULT 2025,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_professions_category ON professions_salary(category);
CREATE INDEX IF NOT EXISTS idx_professions_name ON professions_salary(profession_name);

-- Enable Row Level Security
ALTER TABLE professions_salary ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON professions_salary
  FOR SELECT USING (true);

-- Insert sample data (this will be populated from parsing)
-- Data will be inserted via application code
