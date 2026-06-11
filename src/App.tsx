import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ConsultantsPage from './pages/ConsultantsPage'
import ProjectsPage from './pages/ProjectsPage'
import AssignmentsPage from './pages/AssignmentsPage'
import RecommendationsPage from './pages/RecommendationsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'consultants',
        element: <ConsultantsPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'assignments',
        element: <AssignmentsPage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
