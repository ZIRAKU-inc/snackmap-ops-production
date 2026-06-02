'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Case, Phase } from '@/lib/types'
import KpiBar from '@/components/dashboard/KpiBar'
import CaseCard from '@/components/dashboard/CaseCard'
import NewCaseModal from '@/components/dashboard/NewCaseModal'

type FilterStatus = 'all' | 'todo' | 'doing' | 'making' | 'done'
type SortKey = 'created_desc' | 'created_asc' | 'store_name'

function getStatus(c: Case): 'todo' | 'doing' | 'making' | 'done' {
  if (c.status === 'completed') return 'done'
  if (c.current_phase === 'production') return 'making'
  if (c.current_phase === 'sales' && c.current_step === 1) return 'todo'
  return 'doing'
}

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all',    label: 'すべて' },
  { key: 'todo',   label: '未着手' },
  { key: 'doing',  label: '進行中' },
  { key: 'making', label: '制作中' },
  { key: 'done',   label: '完了' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_desc')

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.replace('/login')
    }
    checkAuth()
  }, [router])

  const fetchCases = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('cases').select('*').order('created_at', { ascending: false })
    setCases(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCases() }, [fetchCases])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredCases = cases
    .filter(c => filter === 'all' ? true : getStatus(c) === filter)
    .filter(c => !search || c.store_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'created_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortKey === 'created_asc')  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return a.store_name.localeCompare(b.store_name, 'ja')
    })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Top Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '0 28px', height: 52,
      }}>
        {/* Logo */}
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.02em', marginRight: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🍶</span>
          <div>
            Snack Map Ops
            <span className="font-[family-name:var(--font-mono)]" style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '.14em', textTransform: 'uppercase', display: 'block', marginTop: 1 }}>
              Sales × Production
            </span>
          </div>
        </div>

        {/* Nav links */}
        <a style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 52, fontSize: 13, fontWeight: 500, color: 'var(--acc)', borderBottom: '2px solid var(--acc)', cursor: 'default', textDecoration: 'none' }}>
          🏠 ダッシュボード
        </a>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', borderRadius: 'var(--rs)', border: 'none',
              background: 'var(--acc)', color: '#fff', fontFamily: 'inherit',
            }}
            className="hover:bg-[#be4a22] transition-colors"
          >
            ＋ 新規案件を登録
          </button>
          <button
            onClick={handleLogout}
            title="ログアウト"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 13, fontFamily: 'inherit', padding: '4px 8px', borderRadius: 'var(--rs)' }}
            className="hover:text-[var(--text2)] hover:bg-[var(--surface)] transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
        {/* KPI bar */}
        <KpiBar cases={cases} />

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', marginRight: 4 }}>案件一覧</span>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '5px 13px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
                  ...(filter === tab.key
                    ? { background: 'var(--acc-l)', border: '1px solid var(--acc-b)', color: 'var(--acc)' }
                    : { background: 'var(--white)', border: '1px solid var(--border)', color: 'var(--text2)' }
                  ),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            style={{
              fontSize: 12, fontFamily: 'inherit', color: 'var(--text2)',
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 'var(--rs)', padding: '5px 10px', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="created_desc">登録日（新しい順）</option>
            <option value="created_asc">登録日（古い順）</option>
            <option value="store_name">店舗名順</option>
          </select>

          {/* Search */}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text3)' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="店舗名で検索"
              style={{
                width: 200, fontSize: 13, padding: '6px 10px 6px 32px',
                fontFamily: 'inherit', color: 'var(--text)',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--rs)', outline: 'none', transition: 'border-color .12s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.background = 'var(--white)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
            />
          </div>
        </div>

        {/* Case grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>読み込み中...</div>
        ) : filteredCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)', gridColumn: '1/-1' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              {search ? `「${search}」に一致する案件はありません。` : '案件がありません。'}
            </p>
            {!search && (
              <button
                onClick={() => setShowModal(true)}
                style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--acc)', fontSize: 13, fontFamily: 'inherit' }}
              >
                最初の案件を登録する →
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {filteredCases.map(c => <CaseCard key={c.id} caseItem={c} />)}
          </div>
        )}
      </main>

      {showModal && (
        <NewCaseModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); fetchCases() }} />
      )}
    </div>
  )
}
