'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import { useTheme } from '@/hooks/useTheme'

// SSR 비활성화하여 브라우저에서만 로드
const Markdown = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default.Markdown),
  {
    ssr: false,
  }
)

interface MarkdownPreviewProps {
  source: string
}

export default function MarkdownPreview({ source }: MarkdownPreviewProps) {
  const { isDark } = useTheme()

  return (
    <div data-color-mode={isDark ? 'dark' : 'light'}>
      <Markdown source={source || ''} />
    </div>
  )
}
