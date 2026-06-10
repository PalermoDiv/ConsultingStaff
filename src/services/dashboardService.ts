import { supabase } from './supabase'
import type { ConsultantUtilization, Project, Consultant } from '../types/completetypes'

// ==========================================
// 1. UTILIZATION DATA
// ==========================================

export async function getConsultantUtilization(): Promise<ConsultantUtilization[]> {
  const { data, error } = await supabase
    .from('consultant_utilization')
    .select('*')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching utilization:', error)
    throw new Error('Failed to fetch consultant utilization')
  }

  return data as ConsultantUtilization[]
}

export async function getAvailableConsultants(): Promise<ConsultantUtilization[]> {
  const { data, error } = await supabase
    .from('consultant_utilization')
    .select('*')
    .eq('availability_status', 'Available')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching available consultants:', error)
    throw new Error('Failed to fetch available consultants')
  }

  return data as ConsultantUtilization[]
}

export async function getOverallocatedConsultants(): Promise<ConsultantUtilization[]> {
  const { data, error } = await supabase
    .from('consultant_utilization')
    .select('*')
    .gt('current_allocation_pct', 100)
    .order('current_allocation_pct', { ascending: false })

  if (error) {
    console.error('Error fetching overallocated consultants:', error)
    throw new Error('Failed to fetch overallocated consultants')
  }

  return data as ConsultantUtilization[]
}

// ==========================================
// 2. PROJECT STATISTICS
// ==========================================

export async function getProjectCountByStatus(): Promise<{ status: string; count: number }[]> {
  const { error } = await supabase
    .from('projects')
    .select('status', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching project counts:', error)
    throw new Error('Failed to fetch project counts')
  }

  // Note: This returns raw data, your component will aggregate it
  // For better results, you might want a custom view or RPC function
  const { data: rawData } = await supabase
    .from('projects')
    .select('status')

  if (!rawData) return []

  const counts: Record<string, number> = {}
  rawData.forEach((project: { status: string }) => {
    counts[project.status] = (counts[project.status] || 0) + 1
  })

  return Object.entries(counts).map(([status, count]) => ({ status, count }))
}

// ==========================================
// 3. STAFFING RECOMMENDATIONS
// ==========================================

export interface StaffingRecommendation {
  consultant: Consultant
  match_score: number // How well they match the project requirements
  available_hours: number
  skills_match: string[] // Which skills they have that match
}

export async function getStaffingRecommendations(
  projectId: string
): Promise<StaffingRecommendation[]> {
  // Step 1: Get project requirements
  const { data: projectSkills } = await supabase
    .from('project_skills')
    .select('fk_skill_id, required_level')
    .eq('fk_project_id', projectId)

  if (!projectSkills || projectSkills.length === 0) {
    return []
  }

  const requiredSkillIds = projectSkills.map((ps) => ps.fk_skill_id)

  // Step 2: Get available consultants
  const { data: availableConsultants } = await supabase
    .from('consultant_utilization')
    .select('consultant_id')
    .in('availability_status', ['Available', 'Partially Allocated'])

  if (!availableConsultants || availableConsultants.length === 0) {
    return []
  }

  const consultantIds = availableConsultants.map((c) => c.consultant_id)

  // Step 3: Get consultants with their skills
  const { data: consultantsWithSkills } = await supabase
    .from('consultants')
    .select(`
      *,
      consultant_skills (
        proficiency_level,
        fk_skill_id
      )
    `)
    .in('consultant_id', consultantIds)
    .eq('is_active', true)

  if (!consultantsWithSkills) return []

  // Step 4: Calculate match scores
  const recommendations: StaffingRecommendation[] = consultantsWithSkills.map((consultant: Consultant & { consultant_skills: { proficiency_level: number; fk_skill_id: string }[] }) => {
    const consultantSkillIds = consultant.consultant_skills.map((cs) => cs.fk_skill_id)
    const matchingSkills = requiredSkillIds.filter((skillId) =>
      consultantSkillIds.includes(skillId)
    )

    const matchScore = (matchingSkills.length / requiredSkillIds.length) * 100
    const availableHours = consultant.capacity_hours_per_week * (1 - 0 / 100) // Simplified

    return {
      consultant,
      match_score: Math.round(matchScore),
      available_hours: availableHours,
      skills_match: matchingSkills, // In production, you'd look up skill names
    }
  })

  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.match_score - a.match_score)
}

// ==========================================
// 4. KPI SUMMARY
// ==========================================

export interface DashboardKPIs {
  total_consultants: number
  active_consultants: number
  total_projects: number
  active_projects: number
  total_assignments: number
  active_assignments: number
  average_utilization: number
  available_count: number
  overallocated_count: number
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  // Fetch all counts in parallel
  const [
    consultantsResult,
    projectsResult,
    assignmentsResult,
    utilizationResult,
  ] = await Promise.all([
    supabase.from('consultants').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('consultant_utilization').select('*'),
  ])

  const totalConsultants = consultantsResult.count ?? 0
  const activeConsultants = consultantsResult.data?.filter((c: Consultant) => c.is_active).length ?? 0

  const totalProjects = projectsResult.count ?? 0
  const activeProjects = projectsResult.data?.filter((p: Project) => p.status === 'Active').length ?? 0

  const totalAssignments = assignmentsResult.count ?? 0
  const activeAssignments = assignmentsResult.data?.filter((a: { status: string }) => a.status === 'Active').length ?? 0

  const utilizationData = utilizationResult.data as ConsultantUtilization[] | null
  const averageUtilization = utilizationData
    ? utilizationData.reduce((sum, u) => sum + u.current_allocation_pct, 0) / (utilizationData.length || 1)
    : 0

  const availableCount = utilizationData?.filter((u) => u.availability_status === 'Available').length ?? 0
  const overallocatedCount = utilizationData?.filter((u) => u.current_allocation_pct > 100).length ?? 0

  return {
    total_consultants: totalConsultants,
    active_consultants: activeConsultants,
    total_projects: totalProjects,
    active_projects: activeProjects,
    total_assignments: totalAssignments,
    active_assignments: activeAssignments,
    average_utilization: Math.round(averageUtilization),
    available_count: availableCount,
    overallocated_count: overallocatedCount,
  }
}
