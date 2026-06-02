import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramPromptInput {
  store_name?: string
  area?: string
  price_range?: string
  business_hours?: string
  features?: string
  atmosphere?: string
}

const buildField = (label: string, value?: string) =>
  value?.trim() ? `・${label}：${value.trim()}` : ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const input: InstagramPromptInput = await req.json()

    const fields = [
      buildField('店舗名', input.store_name),
      buildField('エリア', input.area),
      buildField('料金目安', input.price_range),
      buildField('営業時間', input.business_hours),
      buildField('特徴', input.features),
      buildField('雰囲気', input.atmosphere),
    ].filter(Boolean).join('\n')

    const systemPrompt = `あなたはスナックマップのSNS担当者です。
あなたは今回のリクエストで渡された情報のみを使用してください。他の店舗・案件・地域の情報を混入させてはなりません。

以下の禁止事項を厳守してください：
- 入力情報に含まれていない数字（金額・時間・距離・人数）を生成してはならない
- 入力情報に含まれていない固有名詞（駅名・地域名・人名・店舗名）を生成してはならない
- 入力情報に含まれていない状態・属性を推測して生成してはならない
- 空欄のフィールドに対応する内容は生成文に含めてはならない

出力はJSON形式のみ。説明文・前置き・マークダウン記法は不要。`

    const userPrompt = `以下の店舗情報をもとに、Instagram投稿用のAI画像生成プロンプトとキャプションを作成してください。

【店舗情報】
${fields || '（情報なし）'}

【出力形式】
{
  "en_prompt": "DALL-E / Midjourney向け英語プロンプト（店舗の雰囲気を表現する画像生成用）",
  "ja_prompt": "上記英語プロンプトの日本語訳",
  "caption": "Instagram投稿キャプション（絵文字・ハッシュタグ含む）"
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
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
