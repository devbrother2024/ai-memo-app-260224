import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '메모 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `다음 메모의 제목과 내용을 분석하여 적절한 태그를 3~5개 생성해주세요.
규칙:
- 한국어로 작성
- 각 태그는 1~3단어
- 쉼표로 구분
- 태그만 출력 (다른 설명 없이)

제목: ${title || ''}
내용: ${content}`,
    })

    const tagsText = response.text || ''
    const tags = tagsText
      .split(',')
      .map((tag: string) => tag.trim().replace(/^#/, ''))
      .filter((tag: string) => tag.length > 0)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('태그 생성 오류:', error)
    return NextResponse.json(
      { error: '태그 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
