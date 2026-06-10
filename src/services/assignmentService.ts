import { supabase } from './supabase'
import type { Assignment, Consultant, Project } from '../types/completetypes'

// ==========================================
// 1. LIST
// ==========================================

export async function getAllAssignments(includeInactive = false): Promise<Assignment[]> {
  let query = supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching assignments:', error)
    throw new Error('Failed to fetch assignments')
  }

  return data as Assignment[]
}

export async function getAssignmentsByProject(projectId: string, includeInactive = false): Promise<Assignment[]> {
  let query = supabase
    .from('assignments')
    .select('*')
    .eq('fk_project_id', projectId)
    .order('created_at', { ascending: false })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching assignments by project:', error)
    throw new Error('Failed to fetch assignments by project')
  }

  return data as Assignment[]
}

export async function getAssignmentsByConsultant(consultantId: string, includeInactive = false): Promise<Assignment[]> {
  let query = supabase
    .from('assignments')
    .select('*')
    .eq('fk_consultant_id', consultantId)
    .order('created_at', { ascending: false })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching assignments by consultant:', error)
    throw new Error('Failed to fetch assignments by consultant')
  }

  return data as Assignment[]
}

export async function getActiveAssignmentsByConsultant(consultantId: string): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('fk_consultant_id', consultantId)
    .eq('is_active', true)
    .eq('status', 'Active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active assignments:', error)
    throw new Error('Failed to fetch active assignments')
  }

  return data as Assignment[]
}

// ==========================================
// 2. GET ONE
// ==========================================

export async function getAssignmentById(id: string): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('assignment_id', id)
    .single()

  if (error) {
    console.error('Error fetching assignment:', error)
    if (error.code === 'PGRST116') throw new Error('Assignment not found')
    throw new Error('Failed to fetch assignment')
  }

  if (!data) throw new Error('Assignment not found')
  return data as Assignment
}

export interface AssignmentWithDetails {
  assignment: Assignment
  consultant: Consultant
  project: Project
}

export async function getAssignmentWithDetails(id: string): Promise<AssignmentWithDetails> {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      consultant:consultants (*),
      project:projects (*)
    `)
    .eq('assignment_id', id)
    .single()

  if (error) {
    console.error('Error fetching assignment details:', error)
    if (error.code === 'PGRST116') throw new Error('Assignment not found')
    throw new Error('Failed to fetch assignment details')
  }

  if (!data) throw new Error('Assignment not found')

  return {
    assignment: data,
    consultant: data.consultant,
    project: data.project,
  }
}

// ==========================================
// 3. CREATE (with utilization check)
// ==========================================

export async function createAssignment(
  assignment: Omit<Assignment, 'assignment_id' | 'created_at' | 'updated_at'>
): Promise<Assignment> {
  // Step 1: Check current utilization
  const { data: utilization } = await supabase
    .from('consultant_utilization')
    .select('current_allocation_pct')
    .eq('consultant_id', assignment.fk_consultant_id)
    .single()

  const currentAllocation = utilization?.current_allocation_pct ?? 0

  // Step 2: Check if new assignment would exceed 100%
  if (currentAllocation + assignment.allocation_percentage > 100) {
    throw new Error(
      `Cannot assign: Consultant is already ${currentAllocation}% allocated. ` +
      `Adding ${assignment.allocation_percentage}% would exceed 100%.`
    )
  }

  // Step 3: Create the assignment
  const { data, error } = await supabase
    .from('assignments')
    .insert(assignment)
    .select()
    .single()

  if (error) {
    console.error('Error creating assignment:', error)
    throw new Error('Failed to create assignment')
  }

  return data as Assignment
}

// ==========================================
// 4. UPDATE
// ==========================================

export async function updateAssignment(
  id: string,
  updates: Partial<Assignment>
): Promise<Assignment> {
  // If allocation percentage is being updated, check utilization
  if (updates.allocation_percentage) {
    const { data: assignment } = await supabase
      .from('assignments')
      .select('fk_consultant_id')
      .eq('assignment_id', id)
      .single()

    if (assignment) {
      const { data: utilization } = await supabase
        .from('consultant_utilization')
        .select('current_allocation_pct')
        .eq('consultant_id', assignment.fk_consultant_id)
        .single()

      const currentAllocation = utilization?.current_allocation_pct ?? 0

      // Note: This is a simplified check. In production, you'd subtract the old allocation first
      if (currentAllocation + updates.allocation_percentage > 100) {
        throw new Error(
          `Cannot update: Consultant would be over-allocated. ` +
          `Current: ${currentAllocation}%, Requested: ${updates.allocation_percentage}%`
        )
      }
    }
  }

  const { data, error } = await supabase
    .from('assignments')
    .update(updates)
    .eq('assignment_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating assignment:', error)
    if (error.code === 'PGRST116') throw new Error('Assignment not found')
    throw new Error('Failed to update assignment')
  }

  return data as Assignment
}

// ==========================================
// 5. UPDATE STATUS
// ==========================================

export async function updateAssignmentStatus(
  id: string,
  status: Assignment['status']
): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .update({ status })
    .eq('assignment_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating assignment status:', error)
    throw new Error('Failed to update assignment status')
  }

  return data as Assignment
}

// ==========================================
// 6. SOFT DELETE (Deactivate - safer than hard delete)
// ==========================================

export async function deactivateAssignment(id: string): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .update({ is_active: false, status: 'Cancelled', updated_at: new Date().toISOString() })
    .eq('assignment_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deactivating assignment:', error)
    throw new Error('Failed to deactivate assignment')
  }

  return data as Assignment
}

// ==========================================
// 7. HARD DELETE (Only for admin use - dangerous!)
// ==========================================

export async function deleteAssignment(id: string): Promise<void> {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('assignment_id', id)

  if (error) {
    console.error('Error deleting assignment:', error)
    throw new Error('Failed to delete assignment')
  }
}
