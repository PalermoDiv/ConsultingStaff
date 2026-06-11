import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { removeProject } from '../context/AppContext.actions'

export default function ProjectsPage() {
  const { state, dispatch } = useAppContext()
  const { projects, clients, loading } = state
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'No Client'
    const client = clients.find((c) => c.client_id === clientId)
    return client?.client_name || 'Unknown Client'
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await removeProject(dispatch, id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-600 mt-1">Manage client projects and track their status</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
          <span>+</span>
          Add Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Active</div>
          <div className="text-2xl font-bold text-blue-600">
            {projects.filter((p) => p.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Planning</div>
          <div className="text-2xl font-bold text-yellow-600">
            {projects.filter((p) => p.status === 'Planning').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-slate-600">Loading projects...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((project) => (
                <tr key={project.project_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{project.project_name}</div>
                    <div className="text-sm text-slate-500">{project.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{getClientName(project.fk_client_id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'Planning' ? 'bg-yellow-100 text-yellow-700' :
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'On Hold' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'} 
                      {' → '}
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.project_id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No projects found. Add your first project!
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
