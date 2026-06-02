import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !key) {
    throw new Error(
      `Supabase環境変数が未設定です。URL: ${url ?? '未設定'} / KEY: ${key ? '設定済み' : '未設定'}`
    )
  }

  return createSupabaseClient(url, key)
}
