'use client'

import { Case } from '@/lib/types'

interface KpiBarProps {
  cases: Case[]
}

function getStatus(c: Case): 'todo' | 'doing' | 'making' | 'done' {
  if (c.status === 'completed') return 'done'
  if (c.current_phase === 'production') return 'making'
  if (c.current_phase === 'sales' && c.current_step === 1) return 'todo'
  return 'doing'
}

export default function KpiBar({ cases }: KpiBarProps) {
  const counts = { all: cases.length, todo: 0, doing: 0, making: 0, done: 0 }
  cases.forEach(c => counts[getStatus(c)]++)

  const stats = [
    { key: 'all',    label: '総案件数', color: 'text-[var(--text)]' },
    { key: 'todo',   label: '未着手',   color: 'text-[var(--text3)]' },
    { key: 'doing',  label: '進行中',   color: 'text-[var(--blue)]' },
    { key: 'making', label: '制作中',   color: 'text-[var(--amber)]' },
    { key: 'done',   label: '完了',     color: 'text-[var(--green)]' },
  ] as const

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 28 }}>
      {stats.map(({ key, label, color }) => (
        <div key={key} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 18px' }}>
          <div className={`font-[family-name:var(--font-mono)] text-[28px] font-medium leading-none mb-[5px] ${color}`}>
            {counts[key]}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
