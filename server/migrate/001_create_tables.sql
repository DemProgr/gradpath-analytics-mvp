-- ============================================================
-- GradPath MVP — Neon Database Schema
-- Database schema for GradPath
-- Run this in Neon SQL Editor (https://console.neon.tech)
-- ============================================================

-- Drop tables if they exist (for clean re-run)
DROP TABLE IF EXISTS admission_stats CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS salary_statistics CASCADE;
DROP TABLE IF EXISTS salary_stats CASCADE;
DROP TABLE IF EXISTS professions_salary CASCADE;
DROP TABLE IF EXISTS profession_salaries CASCADE;
DROP TABLE IF EXISTS profession_forecasts CASCADE;
DROP TABLE IF EXISTS vacancies CASCADE;
DROP TABLE IF EXISTS parsing_sessions CASCADE;
DROP TABLE IF EXISTS career_paths CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS institutes CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;
DROP TABLE IF EXISTS universities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS region_salary_stats CASCADE;

-- ============================================================
-- 1. UNIVERSITIES
-- ============================================================
CREATE TABLE universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  short_name_en TEXT,
  short_name_be TEXT,
  full_name_en TEXT,
  full_name_be TEXT,
  average_mark DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. FACULTIES (id changed to TEXT in later migrations)
-- ============================================================
CREATE TABLE faculties (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  name_en TEXT,
  name_be TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. INSTITUTES
-- ============================================================
CREATE TABLE institutes (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. SPECIALTIES (id, faculty_id changed to TEXT)
-- ============================================================
CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  faculty_id TEXT,
  institute_id TEXT,
  university_id TEXT,
  name TEXT NOT NULL,
  code TEXT,
  degree_type TEXT NOT NULL DEFAULT 'bachelor',
  duration_years INTEGER NOT NULL DEFAULT 4,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. ADMISSION_STATS
-- ============================================================
CREATE TABLE admission_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  budget_places INTEGER,
  paid_places INTEGER,
  min_score NUMERIC(5,2),
  avg_score NUMERIC(5,2),
  paid_min_score NUMERIC(5,2),
  applications_count INTEGER,
  enrolled_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. VACANCIES
-- ============================================================
CREATE TABLE vacancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  city TEXT,
  category TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'BYN',
  experience_required TEXT,
  employment_type TEXT,
  description TEXT,
  source_url TEXT,
  parsed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. SALARY_STATS
-- ============================================================
CREATE TABLE salary_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  specialty_name TEXT,
  city TEXT,
  avg_salary INTEGER NOT NULL,
  min_salary INTEGER,
  max_salary INTEGER,
  vacancies_count INTEGER,
  demand_level TEXT DEFAULT 'medium',
  career_growth_potential TEXT DEFAULT 'medium',
  year INTEGER NOT NULL,
  month INTEGER,
  source TEXT DEFAULT 'rabota.by',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. CAREER_PATHS
-- ============================================================
CREATE TABLE career_paths (
  id TEXT PRIMARY KEY,
  specialty_category TEXT NOT NULL,
  level_name TEXT NOT NULL,
  level_order INTEGER NOT NULL,
  typical_salary_min NUMERIC,
  typical_salary_max NUMERIC,
  years_experience TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. PARSING_SESSIONS
-- ============================================================
CREATE TABLE parsing_sessions (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'running',
  total_pages INTEGER DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  total_found INTEGER DEFAULT 0,
  new_vacancies INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. PROFESSION_FORECASTS
-- ============================================================
CREATE TABLE profession_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profession_name TEXT NOT NULL,
  category TEXT NOT NULL,
  demand_level TEXT NOT NULL,
  forecast_year INTEGER NOT NULL,
  source TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  related_specialties JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 11. PROFESSION_SALARIES
-- ============================================================
CREATE TABLE profession_salaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profession_name TEXT NOT NULL,
  search_query TEXT,
  avg_salary INTEGER,
  min_salary INTEGER,
  max_salary INTEGER,
  vacancies_count INTEGER,
  city TEXT NOT NULL DEFAULT 'Минск',
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'rabota.by',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. PROFESSIONS_SALARY
-- ============================================================
CREATE TABLE professions_salary (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. SALARY_STATISTICS
-- ============================================================
CREATE TABLE salary_statistics (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER,
  quarter INTEGER,
  region_type VARCHAR(20) NOT NULL,
  region_name VARCHAR(100) NOT NULL,
  industry_code VARCHAR(20),
  industry_name VARCHAR(200) NOT NULL,
  industry_category VARCHAR(100),
  avg_salary DECIMAL(12,2),
  median_salary DECIMAL(12,2),
  min_salary DECIMAL(12,2),
  max_salary DECIMAL(12,2),
  vacancies_count INTEGER,
  employees_count INTEGER,
  growth_rate DECIMAL(6,2),
  source VARCHAR(200),
  source_url VARCHAR(500),
  data_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. REGION_SALARY_STATS
-- ============================================================
CREATE TABLE region_salary_stats (
  id SERIAL PRIMARY KEY,
  region_name VARCHAR(100) NOT NULL,
  region_type VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER,
  avg_salary DECIMAL(10,2),
  median_salary DECIMAL(10,2),
  min_salary DECIMAL(10,2),
  max_salary DECIMAL(10,2),
  source VARCHAR(200),
  source_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. USERS (for our custom auth)
-- ============================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_faculties_university ON faculties(university_id);
CREATE INDEX idx_specialties_faculty ON specialties(faculty_id);
CREATE INDEX idx_specialties_university ON specialties(university_id);
CREATE INDEX idx_admission_stats_specialty ON admission_stats(specialty_id);
CREATE INDEX idx_admission_stats_year ON admission_stats(year);
CREATE INDEX idx_vacancies_category ON vacancies(category);
CREATE INDEX idx_vacancies_city ON vacancies(city);
CREATE INDEX idx_salary_stats_category ON salary_stats(category);
CREATE INDEX idx_salary_stats_year ON salary_stats(year);
CREATE INDEX idx_profession_forecasts_name ON profession_forecasts(profession_name);
CREATE INDEX idx_profession_salaries_name ON profession_salaries(profession_name);
