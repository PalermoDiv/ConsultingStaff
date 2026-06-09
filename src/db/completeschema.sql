-- ============================================
-- Consultant Staffing & Capacity Planner
-- PostgreSQL Schema for Supabase
-- ============================================

-- Enable UUID extension (standard for Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ENUMS & TYPES
-- ============================================

CREATE TYPE consultant_position AS ENUM (
  'Junior Consultant',
  'Consultant',
  'Senior Consultant',
  'Principal',
  'Partner',
  'Project Manager'
);

CREATE TYPE assignment_status AS ENUM (
  'Pending',
  'Active',
  'Completed',
  'Cancelled'
);

-- ============================================
-- 2. CORE TABLES
-- ============================================

-- Clients table (for whom are we making each project?)
CREATE TABLE clients (
  client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultants table
CREATE TABLE consultants (
  consultant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  position consultant_position NOT NULL DEFAULT 'Consultant',
  hourly_rate DECIMAL(10, 2),
  capacity_hours_per_week INTEGER DEFAULT 40, -- Standard 40h week
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL UNIQUE,
  category TEXT, -- e.g., 'Technical', 'Soft Skill', 'Domain'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  description TEXT,
  fk_client_id UUID REFERENCES clients(client_id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  total_estimated_hours INTEGER,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'On Hold', 'Completed', 'Cancelled')),
  fk_project_manager_id UUID REFERENCES consultants(consultant_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. JUNCTION / MANY-TO-MANY TABLES
-- ============================================

-- Consultant skills (many-to-many)
CREATE TABLE consultant_skills (
  consultant_skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_consultant_id UUID NOT NULL REFERENCES consultants(consultant_id) ON DELETE CASCADE,
  fk_skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1=Beginner, 5=Expert
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fk_consultant_id, fk_skill_id) -- Prevent duplicate entries
);

-- Project skills (many-to-many)
CREATE TABLE project_skills (
  project_skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  fk_skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
  required_level INTEGER CHECK (required_level BETWEEN 1 AND 5), -- 1=Nice to have, 5=Critical
  hours_required INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fk_project_id, fk_skill_id)
);

-- ============================================
-- 4. ASSIGNMENTS (THE CORE FEATURE)
-- ============================================

CREATE TABLE assignments (
  assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_consultant_id UUID NOT NULL REFERENCES consultants(consultant_id) ON DELETE CASCADE,
  fk_project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  allocation_percentage INTEGER NOT NULL CHECK (allocation_percentage > 0 AND allocation_percentage <= 100),
  status assignment_status DEFAULT 'Pending',
  start_date DATE,
  end_date DATE,
  total_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. VIEWS (for easy querying)
-- ============================================

-- View: Consultant current utilization
CREATE VIEW consultant_utilization AS
SELECT 
  c.consultant_id,
  c.first_name,
  c.last_name,
  c.position,
  c.capacity_hours_per_week,
  COALESCE(SUM(a.allocation_percentage), 0) AS current_allocation_pct,
  CASE 
    WHEN COALESCE(SUM(a.allocation_percentage), 0) >= 100 THEN 'Fully Allocated'
    WHEN COALESCE(SUM(a.allocation_percentage), 0) > 0 THEN 'Partially Allocated'
    ELSE 'Available'
  END AS availability_status
FROM consultants c
LEFT JOIN assignments a ON c.consultant_id = a.fk_consultant_id AND a.status = 'Active'
WHERE c.is_active = true
GROUP BY c.consultant_id, c.first_name, c.last_name, c.position, c.capacity_hours_per_week;

-- ============================================
-- 6. INDEXES (for performance)
-- ============================================

CREATE INDEX idx_consultant_skills_consultant ON consultant_skills(fk_consultant_id);
CREATE INDEX idx_consultant_skills_skill ON consultant_skills(fk_skill_id);
CREATE INDEX idx_project_skills_project ON project_skills(fk_project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(fk_skill_id);
CREATE INDEX idx_assignments_consultant ON assignments(fk_consultant_id);
CREATE INDEX idx_assignments_project ON assignments(fk_project_id);
CREATE INDEX idx_assignments_status ON assignments(status);

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) - Enable for Supabase
-- ============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (development)
CREATE POLICY "Allow all" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all" ON consultants FOR ALL USING (true);
CREATE POLICY "Allow all" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all" ON consultant_skills FOR ALL USING (true);
CREATE POLICY "Allow all" ON project_skills FOR ALL USING (true);
CREATE POLICY "Allow all" ON assignments FOR ALL USING (true);
