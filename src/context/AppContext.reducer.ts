import type { AppState, AppAction } from './AppContext.types'

// ============================================
// REDUCER: how state changes based on actions
// ============================================

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ========== LOADING & ERROR ==========
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    // ========== CLIENTS ==========
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, loading: false }

    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] }

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.client_id === action.payload.client_id ? action.payload : c
        ),
      }

    case 'REMOVE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((c) => c.client_id !== action.payload),
      }

    // ========== CONSULTANTS ==========
    case 'SET_CONSULTANTS':
      return { ...state, consultants: action.payload, loading: false }

    case 'ADD_CONSULTANT':
      return { ...state, consultants: [...state.consultants, action.payload] }

    case 'UPDATE_CONSULTANT':
      return {
        ...state,
        consultants: state.consultants.map((c) =>
          c.consultant_id === action.payload.consultant_id ? action.payload : c
        ),
      }

    case 'REMOVE_CONSULTANT':
      return {
        ...state,
        consultants: state.consultants.filter((c) => c.consultant_id !== action.payload),
      }

    // ========== SKILLS ==========
    case 'SET_SKILLS':
      return { ...state, skills: action.payload, loading: false }

    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] }

    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((s) =>
          s.skill_id === action.payload.skill_id ? action.payload : s
        ),
      }

    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((s) => s.skill_id !== action.payload),
      }

    // ========== PROJECTS ==========
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false }

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.project_id === action.payload.project_id ? action.payload : p
        ),
      }

    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.project_id !== action.payload),
      }

    // ========== ASSIGNMENTS ==========
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload, loading: false }

    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] }

    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map((a) =>
          a.assignment_id === action.payload.assignment_id ? action.payload : a
        ),
      }

    case 'REMOVE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter((a) => a.assignment_id !== action.payload),
      }

    // ========== UTILIZATION ==========
    case 'SET_UTILIZATION':
      return { ...state, utilization: action.payload, loading: false }

    // ========== DEFAULT ==========
    default:
      return state
  }
}
