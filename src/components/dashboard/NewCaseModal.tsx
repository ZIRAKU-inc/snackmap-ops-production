'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NewCaseModalProps {
  onClose: () => void
  onCreated: () => void
}

export default function NewCaseModal({ onClose, onCreated }: NewCaseModalProps) {
  const [storeName, setStoreName] = useState('')
  const [instagramAccount, setInstagramAccount] = useState('')
  const [area, setArea] = useState('')
  const [assignee, setAssignee] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'inherit', fontSize: 13, color: 'var(--text)',
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
    padding: '8px 11px', outline: 'none',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from('cases').insert({
      store_name: storeName.trim(),
      instagram_account: instagramAccount.trim() || null,
      area: area.trim() || null,
      assignee: assignee.trim() || null,
      notes: notes.trim() || null,
      // 案件登録（Step 1）は作成と同時に完了扱いにしてStep 2から開始
      current_step: 2,
      step_completed: { 1: true },
    })

    if (error) {
      setError('登録に失敗しました。もう一度お試しください。')
      setLoading(false)
      return
    }
    onCreated()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--white)', borderRadius: 'var(--r)', border: '1px solid var(--border)', width: 480, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Head */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>新規案件を登録</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18, lineHeight: 1, fontFamily: 'inherit', padding: '2px 6px', borderRadius: 'var(--rs)' }}
            className="hover:bg-[var(--surface)] hover:text-[var(--text2)] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                店舗名 <span style={{ color: 'var(--acc)' }}>*</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                required
                placeholder="スナック〇〇"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Instagramアカウント</label>
                <input
                  type="text"
                  value={instagramAccount}
                  onChange={e => setInstagramAccount(e.target.value.replace(/^@/, ''))}
                  placeholder="account_name"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>エリア</label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="難波・梅田など"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>担当者</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  placeholder="田村"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>備考</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="メモ・特記事項"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 12, padding: '8px 12px', borderRadius: 'var(--rs)', marginBottom: 12 }}>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--border-md)', background: 'var(--white)', color: 'var(--text)' }}
              className="hover:bg-[var(--surface)] transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading || !storeName.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--acc)', background: 'var(--acc)', color: '#fff', opacity: loading || !storeName.trim() ? 0.6 : 1 }}
              className="hover:bg-[#be4a22] transition-colors"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
