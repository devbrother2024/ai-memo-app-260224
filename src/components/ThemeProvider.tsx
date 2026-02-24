'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import {
  Theme,
  ThemeContext,
  getStoredTheme,
  storeTheme,
} from '@/hooks/useTheme'

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  // 초기 로드 시 저장된 테마 적용
  useEffect(() => {
    const stored = getStoredTheme()
    setTheme(stored)
    document.documentElement.classList.toggle('dark', stored === 'dark')
  }, [])

  // 테마 전환
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', next === 'dark')
      storeTheme(next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}
