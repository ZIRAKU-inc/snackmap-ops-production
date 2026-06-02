import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramPromptInput {
  pattern: 'A' | 'B'
  store_name?: string
  prefecture_city?: string
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
    const pattern = input.pattern ?? 'A'

    const storeInfo = [
      buildField('店舗名', input.store_name),
      buildField('エリア・地域', input.prefecture_city || input.area),
      buildField('雰囲気', input.atmosphere),
      buildField('特徴', input.features),
    ].filter(Boolean).join('\n')

    const systemPrompt = pattern === 'A'
      ? `あなたはスナックマップのInstagram投稿用コピーライターです。
店舗情報をもとに、来店意欲を高める短いキャッチコピーを2文・40字程度で生成してください。
体言止めを活用し、夜のお店らしい温かみのある表現にしてください。
あなたは今回のリクエストで渡された情報のみを使用してください。入力情報にない内容を補完・創作してはいけません。
JSONのみ出力してください。説明・前置き不要。`
      : `あなたはスナックマップのInstagram投稿用ライターです。
店舗・ママの魅力を語りかける文体で60字程度・2〜3行で生成してください。
体言止めは使わず、読んだ人が「行ってみたい」と感じる温かい文章にしてください。
あなたは今回のリクエストで渡された情報のみを使用してください。入力情報にない内容を補完・創作してはいけません。
JSONのみ出力してください。説明・前置き不要。`

    const userPrompt = pattern === 'A'
      ? `以下の店舗情報をもとにキャッチコピーを生成してください。\n\n${storeInfo}\n\n出力形式：\n{"generated_text": "2文・40字程度のキャッチコピー"}`
      : `以下の店舗情報をもとに本文テキストを生成してください。\n\n${storeInfo}\n\n出力形式：\n{"generated_text": "60字程度・語りかける文体の本文"}`

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
        max_tokens: 400,
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
      return new Response(
        JSON.stringify({ pattern, generated_text: parsed.generated_text }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } },
      )
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
