import { useAppContext } from '../context/AppContext'

export default function DashboardPage() {
  const { state } = useAppContext()
  const { consultants, projects, assignments, utilization } = state

  // Calculate KPIs
  const totalConsultants = consultants.length
  const activeProjects = projects.filter((p) => p.status === 'Active').length
  const totalAssignments = assignments.length
  const avgUtilization = utilization.length > 0
    ? Math.round(utilization.reduce((sum, u) => sum + (u.current_allocation_pct || 0), 0) / utilization.length)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">Overview of your staffing operations and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Consultants"
          value={totalConsultants}
          subtitle={`${totalConsultants} total`}
          icon="👤"
        />
        <KpiCard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${projects.length} total projects`}
          icon="📁"
        />
        <KpiCard
          title="Assignments"
          value={totalAssignments}
          subtitle="Active allocations"
          icon="🔗"
        />
        <KpiCard
          title="Avg Utilization"
          value={`${avgUtilization}%`}
          subtitle="Team capacity used"
          icon="📊"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Status</h3>
          <div className="space-y-3">
            {(['Planning', 'Active', 'Completed', 'On Hold'] as const).map((status) => {
              const count = projects.filter((p) => p.status === status).length
              const totalProjects = projects.length
              const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0
              const projectStatusColors: Record<string, string> = {
                'Planning': 'bg-yellow-500',
                'Active': 'bg-blue-500',
                'Completed': 'bg-green-500',
                'On Hold': 'bg-slate-400',
              }
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${projectStatusColors[status]}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{status}</span>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${projectStatusColors[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Consultant Positions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Composition</h3>
          <div className="space-y-3">
            {(['Junior Consultant', 'Consultant', 'Senior Consultant', 'Principal'] as const).map((position) => {
              const count = consultants.filter((c) => c.position === position).length
              const percentage = totalConsultants > 0 ? Math.round((count / totalConsultants) * 100) : 0
              const positionColors: Record<string, string> = {
                'Junior Consultant': 'bg-blue-400',
                'Consultant': 'bg-blue-500',
                'Senior Consultant': 'bg-blue-600',
                'Principal': 'bg-blue-700',
              }
              return (
                <div key={position} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${positionColors[position]}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{position}</span>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${positionColors[position]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No assignments yet. Create your first assignment!</p>
        ) : (
          <div className="space-y-3">
            {assignments.slice(0, 5).map((assignment) => (
              <div key={assignment.assignment_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                    🔗
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {assignment.fk_consultant_id}
                    </div>
                    <div className="text-xs text-slate-500">
                      {assignment.allocation_percentage}% allocated
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {assignment.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: number | string
  subtitle: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-600 font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{subtitle}</div>
    </div>
  )
}
