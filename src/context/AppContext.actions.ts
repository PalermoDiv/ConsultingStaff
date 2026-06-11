import type { Dispatch } from 'react'
import type { AppAction } from './AppContext.types'

import {
  getAllClients,
  createClient,
  updateClient,
  deactivateClient,
} from '../services/clientService'

import {
  getAllConsultants,
  createConsultant,
  updateConsultant,
  deactivateConsultant,
} from '../services/consultantService'

import {
  getAllSkills,
  createSkill,
  updateSkill,
  deactivateSkill,
} from '../services/skillService'

import {
  getAllProjects,
  createProject,
  updateProject,
  deactivateProject,
} from '../services/projectService'

import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deactivateAssignment,
} from '../services/assignmentService'

import { getConsultantUtilization } from '../services/dashboardService'

import type { Client, Consultant, Skill, Project, Assignment } from '../types/completetypes'

// ============================================
// CLIENT ACTIONS
// ============================================

export async function loadClients(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const clients = await getAllClients()
    dispatch({ type: 'SET_CLIENTS', payload: clients })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load clients' })
  }
}

export async function addClient(dispatch: Dispatch<AppAction>, client: Omit<Client, 'client_id' | 'created_at' | 'updated_at'>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const newClient = await createClient(client)
    dispatch({ type: 'ADD_CLIENT', payload: newClient })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create client' })
  }
}

export async function editClient(dispatch: Dispatch<AppAction>, id: string, updates: Partial<Client>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const updated = await updateClient(id, updates)
    dispatch({ type: 'UPDATE_CLIENT', payload: updated })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update client' })
  }
}

export async function removeClient(dispatch: Dispatch<AppAction>, id: string) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    await deactivateClient(id)
    dispatch({ type: 'REMOVE_CLIENT', payload: id })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove client' })
  }
}

// ============================================
// CONSULTANT ACTIONS
// ============================================

export async function loadConsultants(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const consultants = await getAllConsultants()
    dispatch({ type: 'SET_CONSULTANTS', payload: consultants })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load consultants' })
  }
}

export async function addConsultant(dispatch: Dispatch<AppAction>, consultant: Omit<Consultant, 'consultant_id' | 'created_at' | 'updated_at'>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const newConsultant = await createConsultant(consultant)
    dispatch({ type: 'ADD_CONSULTANT', payload: newConsultant })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create consultant' })
  }
}

export async function editConsultant(dispatch: Dispatch<AppAction>, id: string, updates: Partial<Consultant>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const updated = await updateConsultant(id, updates)
    dispatch({ type: 'UPDATE_CONSULTANT', payload: updated })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update consultant' })
  }
}

export async function removeConsultant(dispatch: Dispatch<AppAction>, id: string) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    await deactivateConsultant(id)
    dispatch({ type: 'REMOVE_CONSULTANT', payload: id })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove consultant' })
  }
}

// ============================================
// SKILL ACTIONS
// ============================================

export async function loadSkills(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const skills = await getAllSkills()
    dispatch({ type: 'SET_SKILLS', payload: skills })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load skills' })
  }
}

export async function addSkill(dispatch: Dispatch<AppAction>, skill: Omit<Skill, 'skill_id' | 'created_at'>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const newSkill = await createSkill(skill)
    dispatch({ type: 'ADD_SKILL', payload: newSkill })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create skill' })
  }
}

export async function editSkill(dispatch: Dispatch<AppAction>, id: string, updates: Partial<Skill>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const updated = await updateSkill(id, updates)
    dispatch({ type: 'UPDATE_SKILL', payload: updated })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update skill' })
  }
}

export async function removeSkill(dispatch: Dispatch<AppAction>, id: string) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    await deactivateSkill(id)
    dispatch({ type: 'REMOVE_SKILL', payload: id })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove skill' })
  }
}

// ============================================
// PROJECT ACTIONS
// ============================================

export async function loadProjects(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const projects = await getAllProjects()
    dispatch({ type: 'SET_PROJECTS', payload: projects })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load projects' })
  }
}

export async function addProject(dispatch: Dispatch<AppAction>, project: Omit<Project, 'project_id' | 'created_at' | 'updated_at'>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const newProject = await createProject(project)
    dispatch({ type: 'ADD_PROJECT', payload: newProject })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create project' })
  }
}

export async function editProject(dispatch: Dispatch<AppAction>, id: string, updates: Partial<Project>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const updated = await updateProject(id, updates)
    dispatch({ type: 'UPDATE_PROJECT', payload: updated })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update project' })
  }
}

export async function removeProject(dispatch: Dispatch<AppAction>, id: string) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    await deactivateProject(id)
    dispatch({ type: 'REMOVE_PROJECT', payload: id })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove project' })
  }
}

// ============================================
// ASSIGNMENT ACTIONS
// ============================================

export async function loadAssignments(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const assignments = await getAllAssignments()
    dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load assignments' })
  }
}

export async function addAssignment(dispatch: Dispatch<AppAction>, assignment: Omit<Assignment, 'assignment_id' | 'created_at' | 'updated_at'>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const newAssignment = await createAssignment(assignment)
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create assignment' })
  }
}

export async function editAssignment(dispatch: Dispatch<AppAction>, id: string, updates: Partial<Assignment>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const updated = await updateAssignment(id, updates)
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updated })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update assignment' })
  }
}

export async function removeAssignment(dispatch: Dispatch<AppAction>, id: string) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    await deactivateAssignment(id)
    dispatch({ type: 'REMOVE_ASSIGNMENT', payload: id })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove assignment' })
  }
}

// ============================================
// UTILIZATION ACTIONS
// ============================================

export async function loadUtilization(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const utilization = await getConsultantUtilization()
    dispatch({ type: 'SET_UTILIZATION', payload: utilization })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load utilization' })
  }
}

// ============================================
// LOAD EVERYTHING (initial app load)
// ============================================

export async function loadAllData(dispatch: Dispatch<AppAction>) {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    const [clients, consultants, skills, projects, assignments, utilization] = await Promise.all([
      getAllClients(),
      getAllConsultants(),
      getAllSkills(),
      getAllProjects(),
      getAllAssignments(),
      getConsultantUtilization(),
    ])

    dispatch({ type: 'SET_CLIENTS', payload: clients })
    dispatch({ type: 'SET_CONSULTANTS', payload: consultants })
    dispatch({ type: 'SET_SKILLS', payload: skills })
    dispatch({ type: 'SET_PROJECTS', payload: projects })
    dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments })
    dispatch({ type: 'SET_UTILIZATION', payload: utilization })
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load data' })
  }
}
