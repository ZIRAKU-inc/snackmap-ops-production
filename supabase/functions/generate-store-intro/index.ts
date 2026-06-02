import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StoreIntroInput {
  store_name: string
  area_detail?: string
  genre?: string
  price_range?: string
  business_hours?: string
  atmosphere?: string
  raw_hearing?: string
}

const buildField = (label: string, value?: string) =>
  value?.trim() ? `・${label}：${value.trim()}` : ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const input: StoreIntroInput = await req.json()

    if (!input.store_name?.trim()) {
      return new Response(
        JSON.stringify({ error: 'store_name は必須です' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } },
      )
    }

    const fields = [
      buildField('エリア・最寄駅', input.area_detail),
      buildField('業態', input.genre),
      buildField('料金', input.price_range),
      buildField('営業時間', input.business_hours),
      buildField('雰囲気・特徴', input.atmosphere),
    ].filter(Boolean).join('\n')

    const systemPrompt = `あなたはスナックマップの店舗紹介文ライターです。
あなたは今回のリクエストで渡された情報のみを使用してください。他の店舗・案件・地域の情報を混入させてはなりません。

以下の禁止事項を厳守してください：
- 入力情報に含まれていない数字（金額・時間・距離・人数）を生成してはならない
- 入力情報に含まれていない固有名詞（駅名・地域名・人名・店舗名）を生成してはならない
- 入力情報に含まれていない状態・属性（老舗・新店・送迎あり・キャストの年齢層・内装テイストなど）を推測して生成してはならない
- 空欄のフィールドに対応する内容は生成文に含めてはならない

出力はJSON形式のみ。説明文・前置き・マークダウン記法は不要。`

    const userPrompt = `以下の店舗情報をもとに、スナックマップ掲載用の紹介文を生成してください。

【店舗情報】
・店舗名：${input.store_name.trim()}
${fields}

【ヒアリング原文】
${input.raw_hearing?.trim() || '（なし）'}

【出力形式】
{
  "titles": ["案1","案2","案3","案4","案5"],
  "body": "700字程度の紹介文",
  "seo_title": "SEOタイトル",
  "meta_description": "120字以内のメタディスクリプション"
}`

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY が設定されていません')

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Claude API エラー')

    const raw = (data.content as { type: string; text: string }[])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const clean = raw.replace(/```json|```/g, '').trim()

    try {
      const parsed = JSON.parse(clean)
      return new Response(JSON.stringify(parsed), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(
        JSON.stringify({ error: 'Parse failed', raw }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
      )
    }
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    )
  }
})
