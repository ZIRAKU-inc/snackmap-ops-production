'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'inherit', fontSize: 13, color: 'var(--text)',
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
    padding: '9px 11px', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 16px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🍶</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--text)' }}>Snack Map Ops</div>
          <div className="font-[family-name:var(--font-mono)]" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3 }}>
            Sales × Production
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '28px 24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>ログイン</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="example@ziraku.co.jp"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 12, padding: '8px 12px', borderRadius: 'var(--rs)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4, width: '100%', padding: '9px 16px',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: 'var(--rs)', border: 'none',
                background: 'var(--acc)', color: '#fff',
                opacity: loading ? 0.7 : 1, transition: 'background .12s',
              }}
              className="hover:bg-[#be4a22]"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 11, marginTop: 20 }}>
          © 2024 株式会社ZIRAKU
        </p>
      </div>
    </div>
  )
}
