import { supabase } from './supabase'
import type { Project, ProjectSkill, Skill, Client, Consultant } from '../types/completetypes'

// ==========================================
// 1. LIST
// ==========================================

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }

  return data as Project[]
}

export async function getActiveProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active projects:', error)
    throw new Error('Failed to fetch active projects')
  }

  return data as Project[]
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('fk_client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects by client:', error)
    throw new Error('Failed to fetch projects by client')
  }

  return data as Project[]
}

// ==========================================
// 2. GET ONE
// ==========================================

export async function getProjectById(id: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    if (error.code === 'PGRST116') throw new Error('Project not found')
    throw new Error('Failed to fetch project')
  }

  if (!data) throw new Error('Project not found')
  return data as Project
}

export interface ProjectWithDetails {
  project: Project
  client: Client | null
  manager: Consultant | null
  skills: (ProjectSkill & { skill: Skill })[]
}

export async function getProjectWithDetails(id: string): Promise<ProjectWithDetails> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients (*),
      manager:consultants (*),
      project_skills (
        *,
        skill:skills (*)
      )
    `)
    .eq('project_id', id)
    .single()

  if (error) {
    console.error('Error fetching project details:', error)
    if (error.code === 'PGRST116') throw new Error('Project not found')
    throw new Error('Failed to fetch project details')
  }

  if (!data) throw new Error('Project not found')

  return {
    project: data,
    client: data.client ?? null,
    manager: data.manager ?? null,
    skills: data.project_skills ?? [],
  }
}

// ==========================================
// 3. CREATE
// ==========================================

export async function createProject(
  project: Omit<Project, 'project_id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }

  return data as Project
}

// ==========================================
// 4. UPDATE
// ==========================================

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('project_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    if (error.code === 'PGRST116') throw new Error('Project not found')
    throw new Error('Failed to update project')
  }

  return data as Project
}

// ==========================================
// 5. DELETE
// ==========================================

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('project_id', id)

  if (error) {
    console.error('Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}

// ==========================================
// 6. SKILLS MANAGEMENT
// ==========================================

export async function addSkillToProject(
  projectId: string,
  skillId: string,
  requiredLevel: number,
  hoursRequired: number
): Promise<ProjectSkill> {
  const { data, error } = await supabase
    .from('project_skills')
    .insert({
      fk_project_id: projectId,
      fk_skill_id: skillId,
      required_level: requiredLevel,
      hours_required: hoursRequired,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding skill to project:', error)
    throw new Error('Failed to add skill to project')
  }

  return data as ProjectSkill
}

export async function removeSkillFromProject(projectSkillId: string): Promise<void> {
  const { error } = await supabase
    .from('project_skills')
    .delete()
    .eq('project_skill_id', projectSkillId)

  if (error) {
    console.error('Error removing skill from project:', error)
    throw new Error('Failed to remove skill from project')
  }
}

export async function updateProjectSkill(
  projectSkillId: string,
  updates: Partial<Pick<ProjectSkill, 'required_level' | 'hours_required'>>
): Promise<ProjectSkill> {
  const { data, error } = await supabase
    .from('project_skills')
    .update(updates)
    .eq('project_skill_id', projectSkillId)
    .select()
    .single()

  if (error) {
    console.error('Error updating project skill:', error)
    throw new Error('Failed to update project skill')
  }

  return data as ProjectSkill
}
