'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface GiteaConfig {
  appUrl: string
  appSubUrl: string
  assetUrlPrefix: string
  runModeIsProd: boolean
  csrfToken: string
  pageData: Record<string, any>
  i18n: Record<string, string>
}

interface GiteaContextType {
  config: GiteaConfig | null
  loading: boolean
  error: string | null
  refreshConfig: () => Promise<void>
}

const GiteaContext = createContext<GiteaContextType | undefined>(undefined)

export function GiteaProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GiteaConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch configuration from the backend
      const response = await fetch('/api/v1/settings/api')
      if (!response.ok) {
        throw new Error('Failed to fetch configuration')
      }
      
      const apiConfig = await response.json()
      
      // Build Gitea config object
      const giteaConfig: GiteaConfig = {
        appUrl: window.location.origin,
        appSubUrl: '',
        assetUrlPrefix: '/assets',
        runModeIsProd: process.env.NODE_ENV === 'production',
        csrfToken: document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '',
        pageData: window.pageData || {},
        i18n: window.i18n || {},
        ...apiConfig
      }
      
      setConfig(giteaConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshConfig()
  }, [])

  return (
    <GiteaContext.Provider value={{ config, loading, error, refreshConfig }}>
      {children}
    </GiteaContext.Provider>
  )
}

export function useGitea() {
  const context = useContext(GiteaContext)
  if (context === undefined) {
    throw new Error('useGitea must be used within a GiteaProvider')
  }
  return context
}