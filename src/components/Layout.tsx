import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppContext } from '../context/AppContext'
import { loadAllData } from '../context/AppContext.actions'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Consultants', href: '/consultants', icon: '👤' },
  { name: 'Projects', href: '/projects', icon: '📁' },
  { name: 'Assignments', href: '/assignments', icon: '🔗' },
  { name: 'Recommendations', href: '/recommendations', icon: '💡' },
]

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { dispatch } = useAppContext()

  useEffect(() => {
    if (user) {
      loadAllData(dispatch)
    }
  }, [user, dispatch])

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-slate-900 border-r border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-white text-lg tracking-tight">StaffingPro</span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-500 text-center">
              StaffingPro v1.0
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">
              {navigation.find((n) => n.href === location.pathname)?.name || 'Welcome'}
            </h1>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium bg-slate-100 px-2 py-1 rounded">
              {location.pathname === '/dashboard' && 'Overview'}
              {location.pathname === '/consultants' && 'Management'}
              {location.pathname === '/projects' && 'Management'}
              {location.pathname === '/assignments' && 'Operations'}
              {location.pathname === '/recommendations' && 'AI Engine'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">
              {user?.email}
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-blue-400">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
