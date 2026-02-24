'use server'

import { createSupabaseClient } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'
import { v4 as uuidv4 } from 'uuid'

// DB 컬럼명(snake_case)을 인터페이스 필드명(camelCase)으로 변환
function mapRowToMemo(row: any): Memo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    summary: row.summary || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 인터페이스 필드명(camelCase)을 DB 컬럼명(snake_case)으로 변환
function mapMemoToRow(memo: Partial<Memo>): any {
  const row: any = {}
  if (memo.title !== undefined) row.title = memo.title
  if (memo.content !== undefined) row.content = memo.content
  if (memo.category !== undefined) row.category = memo.category
  if (memo.tags !== undefined) row.tags = memo.tags
  if (memo.summary !== undefined) row.summary = memo.summary
  if (memo.createdAt !== undefined) row.created_at = memo.createdAt
  if (memo.updatedAt !== undefined) row.updated_at = memo.updatedAt
  return row
}

// 모든 메모 조회
export async function getMemos(): Promise<Memo[]> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('메모 조회 오류:', error)
      throw error
    }

    return (data || []).map(mapRowToMemo)
  } catch (error) {
    console.error('메모 조회 실패:', error)
    return []
  }
}

// 메모 생성
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  try {
    const supabase = createSupabaseClient()
    const now = new Date().toISOString()
    const newMemo = {
      id: uuidv4(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags || [],
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase.from('memos').insert(newMemo).select().single()

    if (error) {
      console.error('메모 생성 오류:', error)
      throw error
    }

    return mapRowToMemo(data)
  } catch (error) {
    console.error('메모 생성 실패:', error)
    throw error
  }
}

// 메모 업데이트
export async function updateMemo(id: string, formData: MemoFormData): Promise<void> {
  try {
    const supabase = createSupabaseClient()
    const updateData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags || [],
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('memos').update(updateData).eq('id', id)

    if (error) {
      console.error('메모 업데이트 오류:', error)
      throw error
    }
  } catch (error) {
    console.error('메모 업데이트 실패:', error)
    throw error
  }
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.from('memos').delete().eq('id', id)

    if (error) {
      console.error('메모 삭제 오류:', error)
      throw error
    }
  } catch (error) {
    console.error('메모 삭제 실패:', error)
    throw error
  }
}

// 메모 요약 업데이트
export async function updateMemoSummary(id: string, summary: string): Promise<void> {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('memos')
      .update({ summary, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('메모 요약 업데이트 오류:', error)
      throw error
    }
  } catch (error) {
    console.error('메모 요약 업데이트 실패:', error)
    throw error
  }
}

// 모든 메모 삭제
export async function clearAllMemos(): Promise<void> {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.from('memos').delete().neq('id', '')

    if (error) {
      console.error('전체 메모 삭제 오류:', error)
      throw error
    }
  } catch (error) {
    console.error('전체 메모 삭제 실패:', error)
    throw error
  }
}
