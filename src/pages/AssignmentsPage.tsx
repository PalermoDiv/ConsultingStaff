import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { removeAssignment } from '../context/AppContext.actions'

export default function AssignmentsPage() {
  const { state, dispatch } = useAppContext()
  const { assignments, consultants, projects, loading } = state
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getConsultantName = (consultantId: string) => {
    const consultant = consultants.find((c) => c.consultant_id === consultantId)
    return consultant ? `${consultant.first_name} ${consultant.last_name}` : 'Unknown'
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.project_id === projectId)
    return project?.project_name || 'Unknown'
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      await removeAssignment(dispatch, id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
          <p className="text-slate-600 mt-1">Manage consultant allocations to projects</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
          <span>+</span>
          Add Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Total Assignments</div>
          <div className="text-2xl font-bold text-slate-900">{assignments.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Active</div>
          <div className="text-2xl font-bold text-blue-600">
            {assignments.filter((a) => a.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {assignments.filter((a) => a.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assignments..."
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-slate-600">Loading assignments...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Consultant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Allocation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.assignment_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{getConsultantName(assignment.fk_consultant_id)}</div>
                    <div className="text-sm text-slate-500">{assignment.fk_consultant_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{getProjectName(assignment.fk_project_id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${assignment.allocation_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{assignment.allocation_percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      assignment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.assignment_id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No assignments found. Create your first assignment!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
