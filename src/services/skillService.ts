import { supabase } from './supabase'
import type { Skill } from '../types/completetypes'

// ==========================================
// 1. LIST
// ==========================================

export async function getAllSkills(includeInactive = false): Promise<Skill[]> {
  let query = supabase
    .from('skills')
    .select('*')
    .order('skill_name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching skills:', error)
    throw new Error('Failed to fetch skills')
  }

  return data as Skill[]
}

export async function getSkillsByCategory(category: string, includeInactive = false): Promise<Skill[]> {
  let query = supabase
    .from('skills')
    .select('*')
    .eq('category', category)
    .order('skill_name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching skills by category:', error)
    throw new Error('Failed to fetch skills by category')
  }

  return data as Skill[]
}

// ==========================================
// 2. GET ONE
// ==========================================

export async function getSkillById(id: string): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('skill_id', id)
    .single()

  if (error) {
    console.error('Error fetching skill:', error)
    if (error.code === 'PGRST116') throw new Error('Skill not found')
    throw new Error('Failed to fetch skill')
  }

  if (!data) throw new Error('Skill not found')
  return data as Skill
}

// ==========================================
// 3. CREATE
// ==========================================

export async function createSkill(
  skill: Omit<Skill, 'skill_id' | 'created_at'>
): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single()

  if (error) {
    console.error('Error creating skill:', error)
    throw new Error('Failed to create skill')
  }

  return data as Skill
}

// ==========================================
// 4. UPDATE
// ==========================================

export async function updateSkill(
  id: string,
  updates: Partial<Skill>
): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('skill_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating skill:', error)
    if (error.code === 'PGRST116') throw new Error('Skill not found')
    throw new Error('Failed to update skill')
  }

  return data as Skill
}

// ==========================================
// 5. SOFT DELETE (Deactivate - safer than hard delete)
// ==========================================

export async function deactivateSkill(id: string): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('skill_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deactivating skill:', error)
    throw new Error('Failed to deactivate skill')
  }

  return data as Skill
}

// ==========================================
// 6. HARD DELETE (Only for admin use - dangerous!)
// ==========================================

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('skill_id', id)

  if (error) {
    console.error('Error deleting skill:', error)
    throw new Error('Failed to delete skill')
  }
}
