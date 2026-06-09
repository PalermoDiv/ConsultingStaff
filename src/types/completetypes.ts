export type ConsultantPosition = 'Junior Consultant' | 'Consultant' | 'Senior Consultant' | 'Principal' | 'Partner' | 'Project Manager';
export type AssignmentStatus = 'Pending' | 'Active' | 'Completed' | 'Cancelled';
export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
export type AvailabilityStatus = 'Available' | 'Partially Allocated' | 'Fully Allocated';

export interface Client {
  client_id: string;
  client_name: string;
  industry: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultant {
  consultant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: ConsultantPosition;
  hourly_rate: number | null;
  capacity_hours_per_week: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  skill_id: string;
  skill_name: string;
  category: string | null;
  created_at: string;
}

export interface Project {
  project_id: string;
  project_name: string;
  description: string | null;
  fk_client_id: string | null;
  start_date: string | null;
  end_date: string | null;
  total_estimated_hours: number | null;
  status: ProjectStatus;
  fk_project_manager_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultantSkill {
  consultant_skill_id: string;
  fk_consultant_id: string;
  fk_skill_id: string;
  proficiency_level: number | null;
  years_of_experience: number | null;
  created_at: string;
}

export interface ProjectSkill {
  project_skill_id: string;
  fk_project_id: string;
  fk_skill_id: string;
  required_level: number | null;
  hours_required: number | null;
  created_at: string;
}

export interface Assignment {
  assignment_id: string;
  fk_consultant_id: string;
  fk_project_id: string;
  allocation_percentage: number;
  status: AssignmentStatus;
  start_date: string | null;
  end_date: string | null;
  total_hours: number | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultantUtilization {
  consultant_id: string;
  first_name: string;
  last_name: string;
  position: ConsultantPosition;
  capacity_hours_per_week: number;
  current_allocation_pct: number;
  availability_status: AvailabilityStatus;
}
