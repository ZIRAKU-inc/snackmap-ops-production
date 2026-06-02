import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobTextInput {
  store_name: string
  area_detail?: string
  genre?: string
  hourly_wage?: string
  trial_wage?: string
  working_hours?: string
  shift_flexibility?: string
  desired_person?: string
  benefits?: string
  store_atmosphere?: string
  raw_hearing?: string
}

const buildField = (label: string, value?: string) =>
  value?.trim() ? `・${label}：${value.trim()}` : ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const input: JobTextInput = await req.json()

    if (!input.store_name?.trim()) {
      return new Response(
        JSON.stringify({ error: 'store_name は必須です' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } },
      )
    }

    const fields = [
      buildField('エリア・最寄駅', input.area_detail),
      buildField('業態', input.genre),
      buildField('時給', input.hourly_wage),
      buildField('体験入店時給', input.trial_wage),
      buildField('勤務時間', input.working_hours),
      buildField('シフト', input.shift_flexibility),
      buildField('こんな方歓迎', input.desired_person),
      buildField('待遇・福利厚生', input.benefits),
      buildField('お店の雰囲気', input.store_atmosphere),
    ].filter(Boolean).join('\n')

    const systemPrompt = `あなたはスナックマップの求人文ライターです。
あなたは今回のリクエストで渡された情報のみを使用してください。他の店舗・案件・地域の情報を混入させてはなりません。

以下の禁止事項を厳守してください：
- 入力情報に含まれていない数字（金額・時間・距離・人数）を生成してはならない
- 入力情報に含まれていない固有名詞（駅名・地域名・人名・店舗名）を生成してはならない
- 入力情報に含まれていない状態・属性（老舗・新店・送迎あり・キャストの年齢層・内装テイストなど）を推測して生成してはならない
- 空欄のフィールドに対応する内容は生成文に含めてはならない

求人文は、未経験・夜職初心者の女性が「ここなら安心して働けそう」と感じられるトーンで書いてください。
条件の羅列ではなく、働くイメージが湧く文章にしてください。
絵文字（😊✨🌙など）と区切り線（୨୧ ───────── ୨୧）を適宜使い、女性が読みやすい柔らかい見た目にしてください。
ただし、入力情報にない内容を追加・補完してはなりません。

出力はJSON形式のみ。説明文・前置き・マークダウン記法は不要。`

    const userPrompt = `以下の情報をもとに、スナックマップ掲載用の求人文を生成してください。

【店舗・求人情報】
・店舗名：${input.store_name.trim()}
${fields}

【ヒアリング原文】
${input.raw_hearing?.trim() || '（なし）'}

【出力形式】
{
  "title": "求人タイトル",
  "body": "求人本文（絵文字・区切り線を使った読みやすい形式）",
  "tags": ["タグ1", "タグ2", ..., "タグ15"]
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
        max_tokens: 2000,
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
