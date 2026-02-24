'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import { useTheme } from '@/hooks/useTheme'

// SSR 비활성화하여 브라우저에서만 로드
const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
      에디터 로딩 중...
    </div>
  ),
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  height?: number
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '메모 내용을 입력하세요',
  height = 300,
}: MarkdownEditorProps) {
  const { isDark } = useTheme()

  return (
    <div data-color-mode={isDark ? 'dark' : 'light'}>
      <MDEditor
        value={value}
        onChange={onChange}
        preview="live"
        visibleDragbar={false}
        height={height}
        textareaProps={{
          placeholder,
        }}
      />
    </div>
  )
}
