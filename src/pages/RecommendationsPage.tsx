import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { getAvailableConsultants, getOverallocatedConsultants, getStaffingRecommendations } from '../services/dashboardService'
import type { ConsultantUtilization } from '../types/completetypes'

export default function RecommendationsPage() {
  const { state } = useAppContext()
  const { projects, skills } = state

  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [recommendations, setRecommendations] = useState<Awaited<ReturnType<typeof getStaffingRecommendations>>>([])
  const [availableConsultants, setAvailableConsultants] = useState<ConsultantUtilization[]>([])
  const [overallocatedConsultants, setOverallocatedConsultants] = useState<ConsultantUtilization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load available and overallocated consultants on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [available, overallocated] = await Promise.all([
          getAvailableConsultants(),
          getOverallocatedConsultants(),
        ])
        setAvailableConsultants(available)
        setOverallocatedConsultants(overallocated)
      } catch (err) {
        console.error('Failed to load consultant data:', err)
      }
    }
    loadData()
  }, [])

  // Get recommendations when a project is selected
  const handleGetRecommendations = async () => {
    if (!selectedProjectId) return
    setLoading(true)
    setError('')
    try {
      const recs = await getStaffingRecommendations(selectedProjectId)
      setRecommendations(recs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getSkillName = (skillId: string) => {
    const skill = skills.find((s) => s.skill_id === skillId)
    return skill?.skill_name || 'Unknown Skill'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Staffing Recommendations</h2>
        <p className="text-slate-600 mt-1">
          Find the best consultants for your projects based on skills and availability
        </p>
      </div>

      {/* Two-column layout: Recommendations Engine + Consultant Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Recommendations Engine (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Find Consultants for Project</h3>
            <div className="flex gap-3">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name} ({project.status})
                  </option>
                ))}
              </select>
              <button
                onClick={handleGetRecommendations}
                disabled={!selectedProjectId || loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Recommendations Results */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recommended Consultants
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Sorted by match score (skills + availability)
                </p>
              </div>
              <div className="divide-y divide-slate-200">
                {recommendations.map((rec, index) => (
                  <div key={rec.consultant.consultant_id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-slate-200 text-slate-600' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                        {/* Consultant Info */}
                        <div>
                          <div className="font-medium text-slate-900">
                            {rec.consultant.first_name} {rec.consultant.last_name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {rec.consultant.position} • {rec.consultant.capacity_hours_per_week}h/week capacity
                          </div>
                        </div>
                      </div>
                      {/* Match Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {rec.match_score}%
                        </div>
                        <div className="text-xs text-slate-500">match score</div>
                      </div>
                    </div>

                    {/* Skills Match */}
                    {rec.skills_match.length > 0 && (
                      <div className="mt-3 ml-12">
                        <div className="text-xs text-slate-500 mb-2">Matching skills:</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.skills_match.map((skillId) => (
                            <span
                              key={skillId}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {getSkillName(skillId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Hours */}
                    <div className="mt-3 ml-12 flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        Available hours: <span className="font-medium text-slate-900">{rec.available_hours}h/week</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No recommendations state */}
          {selectedProjectId && !loading && recommendations.length === 0 && !error && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Recommendations Found</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                This project may not have skill requirements defined, or there are no available consultants with matching skills.
              </p>
            </div>
          )}
        </div>

        {/* Right column: Consultant Status (1/3 width) */}
        <div className="space-y-6">
          {/* Available Consultants */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-green-50">
              <h3 className="text-sm font-semibold text-green-800">
                ✅ Available ({availableConsultants.length})
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {availableConsultants.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No available consultants
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {availableConsultants.map((c) => (
                    <div key={c.consultant_id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="font-medium text-sm text-slate-900">
                        {c.first_name} {c.last_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {c.position} • {c.current_allocation_pct}% allocated
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overallocated Consultants */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-red-50">
              <h3 className="text-sm font-semibold text-red-800">
                ⚠️ Overallocated ({overallocatedConsultants.length})
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {overallocatedConsultants.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No overallocated consultants
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {overallocatedConsultants.map((c) => (
                    <div key={c.consultant_id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="font-medium text-sm text-slate-900">
                        {c.first_name} {c.last_name}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {c.current_allocation_pct}% allocated
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
