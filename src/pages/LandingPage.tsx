export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center">
      <span className="text-6xl mb-6">🎯</span>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Consultant Staffing & Capacity Planner
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Allocate consultants to projects based on skills, availability, and workload capacity.
        Manage your team, track utilization, and find the best matches for every project.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <span className="text-3xl mb-3 block">👤</span>
          <h3 className="font-semibold text-gray-800 mb-2">Consultant Management</h3>
          <p className="text-sm text-gray-600">Track skills, availability, and capacity</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <span className="text-3xl mb-3 block">📁</span>
          <h3 className="font-semibold text-gray-800 mb-2">Project Management</h3>
          <p className="text-sm text-gray-600">Define requirements and track progress</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <span className="text-3xl mb-3 block">🔗</span>
          <h3 className="font-semibold text-gray-800 mb-2">Smart Assignments</h3>
          <p className="text-sm text-gray-600">AI-powered staffing recommendations</p>
        </div>
      </div>
    </div>
  )
}
