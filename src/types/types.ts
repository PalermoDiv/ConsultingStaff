export type consultantPosition = 'Junior Consultant' | 'Consultant' | 'Senior Consultant' | 'Principal' | 'Partner' | 'Project Manager';
export type assigment_status = 'Pending' | 'Active' | 'Completed' | 'Cancelled';

export interface Consultant {
  consultant_id: string;  // UUID in PostgreSQL
  first_name: string;
  last_name: string;
  email: string;
  position: consultantPosition;
  hourly_rate: number | null;
  capacity_hours_per_week: number;
  is_active: boolean;
  created_at: string;     // TIMESTAMP WITH TIME ZONE
  updated_at: string;
}

export interface Clients {
  client_id: string;
  client_name: string;
  industry: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
};

export interface Skills {
  skill_id: string;
  skill_name: string;
  category: string;
  created_at: string;
};

export interface Projects {
  project_id: string;
  project_name: string;
  description: string;
  fk_client_id: 
}
