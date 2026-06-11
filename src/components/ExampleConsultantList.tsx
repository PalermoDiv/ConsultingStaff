import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { loadAllData } from '../context/AppContext.actions'

/**
 * Example: How to use the global state in a component
 */
export function ExampleConsultantList() {
  const { state, dispatch } = useAppContext()

  // Load data when component mounts
  useEffect(() => {
    loadAllData(dispatch)
  }, [dispatch])

  if (state.loading) {
    return <div className="p-4">Loading...</div>
  }

  if (state.error) {
    return <div className="p-4 text-red-500">Error: {state.error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consultants</h1>
      <p className="mb-4 text-gray-600">
        {state.consultants.length} consultants loaded
      </p>

      <ul className="space-y-2">
        {state.consultants.map((consultant) => (
          <li key={consultant.consultant_id} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">
              {consultant.first_name} {consultant.last_name}
            </div>
            <div className="text-sm text-gray-600">
              {consultant.position} | {consultant.email}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">Projects</h2>
      <p className="mb-4 text-gray-600">
        {state.projects.length} projects loaded
      </p>

      <ul className="space-y-2">
        {state.projects.map((project) => (
          <li key={project.project_id} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">{project.project_name}</div>
            <div className="text-sm text-gray-600">
              Status: {project.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
