'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto')

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('giteria-theme', newTheme)
    
    // Update HTML data attribute
    const root = document.documentElement
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const currentTheme = theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark')
      : theme
    
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('giteria-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('auto')
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => {
      if (theme === 'auto') {
        setTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}