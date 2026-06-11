import type { Client, Consultant, Skill, Project, Assignment, ConsultantUtilization } from '../types/completetypes'

// ============================================
// 1. STATE SHAPE (what the app remembers)
// ============================================

export interface AppState {
  // Data
  clients: Client[]
  consultants: Consultant[]
  skills: Skill[]
  projects: Project[]
  assignments: Assignment[]
  utilization: ConsultantUtilization[]

  // UI state
  loading: boolean
  error: string | null
}

// Starting state
export const initialState: AppState = {
  clients: [],
  consultants: [],
  skills: [],
  projects: [],
  assignments: [],
  utilization: [],
  loading: false,
  error: null,
}

// ============================================
// 2. ACTIONS (what you can do)
// ============================================

export type AppAction =
  // Loading & Error
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

  // Clients
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'REMOVE_CLIENT'; payload: string } // client_id

  // Consultants
  | { type: 'SET_CONSULTANTS'; payload: Consultant[] }
  | { type: 'ADD_CONSULTANT'; payload: Consultant }
  | { type: 'UPDATE_CONSULTANT'; payload: Consultant }
  | { type: 'REMOVE_CONSULTANT'; payload: string } // consultant_id

  // Skills
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'REMOVE_SKILL'; payload: string } // skill_id

  // Projects
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string } // project_id

  // Assignments
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'REMOVE_ASSIGNMENT'; payload: string } // assignment_id

  // Utilization
  | { type: 'SET_UTILIZATION'; payload: ConsultantUtilization[] }
