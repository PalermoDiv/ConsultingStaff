import { supabase } from './supabase'
import type { Consultant, ConsultantSkill, Skill } from '../types/completetypes'

// ==========================================
// 1. LIST
// ==========================================

export async function getAllConsultants(includeInactive = false): Promise<Consultant[]> {
  let query = supabase
    .from('consultants')
    .select('*')
    .order('last_name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching consultants:', error)
    throw new Error('Failed to fetch consultants')
  }

  return data as Consultant[]
}

export async function getActiveConsultants(): Promise<Consultant[]> {
  const { data, error } = await supabase
    .from('consultants')
    .select('*')
    .eq('is_active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching active consultants:', error)
    throw new Error('Failed to fetch active consultants')
  }

  return data as Consultant[]
}

// ==========================================
// 2. GET ONE
// ==========================================

export async function getConsultantById(id: string): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .select('*')
    .eq('consultant_id', id)
    .single()

  if (error) {
    console.error('Error fetching consultant:', error)
    if (error.code === 'PGRST116') throw new Error('Consultant not found')
    throw new Error('Failed to fetch consultant')
  }

  if (!data) throw new Error('Consultant not found')
  return data as Consultant
}

export interface ConsultantWithDetails {
  consultant: Consultant
  skills: (ConsultantSkill & { skill: Skill })[]
}

export async function getConsultantWithDetails(id: string): Promise<ConsultantWithDetails> {
  const { data, error } = await supabase
    .from('consultants')
    .select(`
      *,
      consultant_skills (
        *,
        skill:skills (*)
      )
    `)
    .eq('consultant_id', id)
    .single()

  if (error) {
    console.error('Error fetching consultant details:', error)
    if (error.code === 'PGRST116') throw new Error('Consultant not found')
    throw new Error('Failed to fetch consultant details')
  }

  if (!data) throw new Error('Consultant not found')

  return {
    consultant: data,
    skills: data.consultant_skills ?? [],
  }
}

// ==========================================
// 3. CREATE
// ==========================================

export async function createConsultant(
  consultant: Omit<Consultant, 'consultant_id' | 'created_at' | 'updated_at'>
): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .insert(consultant)
    .select()
    .single()

  if (error) {
    console.error('Error creating consultant:', error)
    throw new Error('Failed to create consultant')
  }

  return data as Consultant
}

// ==========================================
// 4. UPDATE
// ==========================================

export async function updateConsultant(
  id: string,
  updates: Partial<Consultant>
): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .update(updates)
    .eq('consultant_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating consultant:', error)
    if (error.code === 'PGRST116') throw new Error('Consultant not found')
    throw new Error('Failed to update consultant')
  }

  return data as Consultant
}

// ==========================================
// 5. DEACTIVATE / DELETE
// ==========================================

export async function deactivateConsultant(id: string): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .update({ is_active: false })
    .eq('consultant_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deactivating consultant:', error)
    throw new Error('Failed to deactivate consultant')
  }

  return data as Consultant
}

export async function deleteConsultant(id: string): Promise<void> {
  const { error } = await supabase
    .from('consultants')
    .delete()
    .eq('consultant_id', id)

  if (error) {
    console.error('Error deleting consultant:', error)
    throw new Error('Failed to delete consultant')
  }
}

// ==========================================
// 6. SKILLS MANAGEMENT
// ==========================================

export async function addSkillToConsultant(
  consultantId: string,
  skillId: string,
  proficiencyLevel: number,
  yearsOfExperience: number
): Promise<ConsultantSkill> {
  const { data, error } = await supabase
    .from('consultant_skills')
    .insert({
      fk_consultant_id: consultantId,
      fk_skill_id: skillId,
      proficiency_level: proficiencyLevel,
      years_of_experience: yearsOfExperience,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding skill to consultant:', error)
    throw new Error('Failed to add skill to consultant')
  }

  return data as ConsultantSkill
}

export async function removeSkillFromConsultant(consultantSkillId: string): Promise<void> {
  const { error } = await supabase
    .from('consultant_skills')
    .delete()
    .eq('consultant_skill_id', consultantSkillId)

  if (error) {
    console.error('Error removing skill from consultant:', error)
    throw new Error('Failed to remove skill from consultant')
  }
}

export async function updateConsultantSkill(
  consultantSkillId: string,
  updates: Partial<Pick<ConsultantSkill, 'proficiency_level' | 'years_of_experience'>>
): Promise<ConsultantSkill> {
  const { data, error } = await supabase
    .from('consultant_skills')
    .update(updates)
    .eq('consultant_skill_id', consultantSkillId)
    .select()
    .single()

  if (error) {
    console.error('Error updating consultant skill:', error)
    throw new Error('Failed to update consultant skill')
  }

  return data as ConsultantSkill
}
