import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { initialState } from './AppContext.types'
import type { AppState, AppAction } from './AppContext.types'
import { appReducer } from './AppContext.reducer'

// ============================================
// 1. CREATE CONTEXT (the "box")
// ============================================

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

// ============================================
// 2. PROVIDER COMPONENT (wraps your app)
// ============================================

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// ============================================
// 3. HOOK (use this in any component)
// ============================================

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside <AppProvider>')
  }
  return context
}
