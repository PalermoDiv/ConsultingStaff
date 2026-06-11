import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">StaffingPro</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/consultants"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Consultants
              </Link>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-24 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-sm font-medium">Enterprise Workforce Management</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Strategic Consultant
              <span className="block text-blue-400">Staffing Intelligence</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Optimize your consulting workforce allocation with data-driven insights. 
              Match the right talent to the right projects with precision and confidence.
            </p>
            
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
              >
                Launch Application
              </Link>
              <Link
                to="/consultants"
                className="bg-slate-800 text-slate-300 border border-slate-700 px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 hover:text-white transition-colors"
              >
                View Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="border-r border-slate-700 last:border-r-0">
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Utilization Tracking</div>
            </div>
            <div className="border-r border-slate-700 last:border-r-0">
              <div className="text-4xl font-bold text-blue-400 mb-2">Real-time</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Availability Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">AI-Powered</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Matching Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Platform Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Enterprise-Grade Workforce Management
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools for managing consultants, projects, and allocations 
              with enterprise security and scalability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="👤"
              title="Consultant Management"
              description="Centralized database for consultant profiles, skills, certifications, and career trajectories."
            />
            <FeatureCard
              icon="📁"
              title="Project Intelligence"
              description="Define project requirements, skill needs, timelines, and budget parameters with precision."
            />
            <FeatureCard
              icon="🔗"
              title="Smart Allocation"
              description="Intelligent assignment engine with built-in overutilization protection and capacity alerts."
            />
            <FeatureCard
              icon="💡"
              title="Recommendations"
              description="AI-driven staffing suggestions based on skill matching, availability, and historical performance."
            />
            <FeatureCard
              icon="📊"
              title="Analytics Dashboard"
              description="Real-time utilization metrics, capacity planning, and workforce optimization insights."
            />
            <FeatureCard
              icon="🛡️"
              title="Data Protection"
              description="Soft delete architecture ensures data integrity while maintaining complete audit trails."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Streamlined Workforce Planning
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Three strategic steps to optimize your consulting operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              title="Build Your Team"
              description="Import consultant profiles with skills, experience levels, and availability windows."
            />
            <StepCard
              step="02"
              title="Define Projects"
              description="Set project requirements, timelines, budgets, and required skill competencies."
            />
            <StepCard
              step="03"
              title="Optimize Allocation"
              description="Leverage AI recommendations to assign the best consultants and track utilization."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Staffing Operations?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join leading consulting firms using StaffingPro to optimize workforce allocation, 
            increase utilization rates, and deliver projects with the right talent.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Launch Application
            </Link>
            <Link
              to="/consultants"
              className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="font-bold text-white">StaffingPro</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2026 Consultant Staffing & Capacity Planner. Enterprise Workforce Management.
            </div>
            <div className="flex gap-6">
              <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
              <Link to="/consultants" className="text-slate-400 hover:text-white text-sm transition-colors">Consultants</Link>
              <Link to="/projects" className="text-slate-400 hover:text-white text-sm transition-colors">Projects</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
        <span className="filter brightness-200">{icon}</span>
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
      <div className="text-5xl font-bold text-slate-700 mb-6">{step}</div>
      <h3 className="font-bold text-white text-xl mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
