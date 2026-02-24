'use client'

import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
})

export const useTheme = () => useContext(ThemeContext)

const STORAGE_KEY = 'memo-app-theme'

// 로컬스토리지에서 테마 로드
export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // 로컬스토리지 접근 실패 시 기본값 반환
  }
  return 'light'
}

// 테마 저장
export const storeTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 저장 실패 무시
  }
}
