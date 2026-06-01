'use client'

import { useRouter } from 'next/navigation'
import { Case, PHASE_ORDER, PHASE_STEPS } from '@/lib/types'

interface CaseCardProps {
  caseItem: Case
}

const PHASE_DEFS = [
  { key: 'sales',      icon: '📨', label: '営業',      color: 'var(--blue)',   steps: [1,2,3] },
  { key: 'collection', icon: '📁', label: '情報収集',  color: 'var(--amber)',  steps: [4,5,6,7] },
  { key: 'production', icon: '✨', label: 'ページ制作', color: 'var(--purple)', steps: [8,9,10] },
  { key: 'review',     icon: '🚀', label: '確認・公開', color: 'var(--acc)',    steps: [11,12,13] },
  { key: 'instagram',  icon: '📸', label: 'Instagram投稿', color: 'var(--green)', steps: [14,15] },
] as const

const STATUS_LABEL: Record<string, string> = {
  todo: '未着手', doing: '進行中', making: '制作中', done: '完了',
}
const STATUS_STYLE: Record<string, string> = {
  todo:   'background:var(--surface);color:var(--text3)',
  doing:  'background:var(--blue-l);color:var(--blue)',
  making: 'background:var(--amber-l);color:var(--amber)',
  done:   'background:var(--green-l);color:var(--green)',
}

function getStatus(c: Case): string {
  if (c.status === 'completed') return 'done'
  if (c.current_phase === 'production') return 'making'
  if (c.current_phase === 'sales' && c.current_step === 1) return 'todo'
  return 'doing'
}

function getDonePct(c: Case): number {
  const done = Object.values(c.step_completed).filter(Boolean).length
  return Math.round((done / 15) * 100)
}

function getCurrentPhaseLabel(c: Case): string {
  const phase = PHASE_DEFS.find(p => p.key === c.current_phase)
  return phase ? `${phase.icon} ${phase.label} Step ${c.current_step}` : ''
}

export default function CaseCard({ caseItem }: CaseCardProps) {
  const router = useRouter()
  const st = getStatus(caseItem)
  const pct = getDonePct(caseItem)

  return (
    <div
      onClick={() => router.push(`/cases/${caseItem.id}`)}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all .15s',
        overflow: 'hidden',
      }}
      className="hover:border-[var(--border-md)] hover:shadow-[0_4px_16px_rgba(0,0,0,.06)] hover:-translate-y-px"
    >
      {/* Head */}
      <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {caseItem.store_name}
          </div>
          <div className="font-[family-name:var(--font-mono)]" style={{ fontSize: 11, color: 'var(--text3)' }}>
            {caseItem.instagram_account ? `@${caseItem.instagram_account}` : '—'}
            {caseItem.area ? ` · ${caseItem.area}` : ''}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, ...parseInlineStyle(STATUS_STYLE[st]) }}>
            {STATUS_LABEL[st]}
          </span>
        </div>
      </div>

      {/* Phase bars */}
      <div style={{ padding: '0 18px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {PHASE_DEFS.map(ph => {
          const total = ph.steps.length
          const done = ph.steps.filter(id => caseItem.step_completed[id] === true).length
          const barPct = Math.round((done / total) * 100)
          return (
            <div key={ph.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', width: 88, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11 }}>{ph.icon}</span>
                {ph.label}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${barPct}%`, background: ph.color, transition: 'width .3s' }} />
                </div>
              </div>
              <div className="font-[family-name:var(--font-mono)]" style={{ fontSize: 10, color: 'var(--text3)', width: 28, textAlign: 'right', flexShrink: 0 }}>
                {done}/{total}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
          現在：<span style={{ fontWeight: 500, color: 'var(--text)' }}>{getCurrentPhaseLabel(caseItem)}</span>
          {caseItem.assignee && (
            <span style={{ color: 'var(--text3)', marginLeft: 6 }}>担当 {caseItem.assignee}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ height: 4, width: 80, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--acc)', borderRadius: 2, width: `${pct}%`, transition: 'width .3s' }} />
          </div>
          <span className="font-[family-name:var(--font-mono)]" style={{ fontSize: 10, color: 'var(--text3)' }}>{pct}%</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: 'var(--acc)', padding: '3px 8px', borderRadius: 'var(--rs)', background: 'var(--acc-l)', border: '1px solid var(--acc-b)' }}>
            作業へ →
          </span>
        </div>
      </div>
    </div>
  )
}

function parseInlineStyle(str: string): React.CSSProperties {
  const obj: React.CSSProperties = {}
  str.split(';').forEach(part => {
    const [k, v] = part.split(':').map(s => s.trim())
    if (!k || !v) return
    const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof React.CSSProperties
    ;(obj as Record<string, string>)[camel] = v
  })
  return obj
}
