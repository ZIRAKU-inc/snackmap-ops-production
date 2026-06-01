'use client'

import { useState } from 'react'

interface StepCardProps {
  stepNumber: number
  title: string
  isCompleted: boolean
  isCurrent: boolean
  onComplete: () => Promise<void>
  children?: React.ReactNode
}

export default function StepCard({ stepNumber, title, isCompleted, isCurrent, onComplete, children }: StepCardProps) {
  const [saving, setSaving] = useState(false)

  const handleComplete = async () => {
    setSaving(true)
    await onComplete()
    setSaving(false)
  }

  const borderColor = isCompleted ? 'var(--green-b)' : isCurrent ? 'var(--acc-b)' : 'var(--border)'
  const bg = isCompleted ? 'var(--green-l)' : isCurrent ? 'var(--white)' : 'var(--white)'

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 'var(--r)', padding: '14px 16px', background: bg, opacity: (!isCompleted && !isCurrent) ? 0.55 : 1, transition: 'all .15s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Step number */}
        <div style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700,
          background: isCompleted ? 'var(--green)' : isCurrent ? 'var(--acc)' : 'var(--surface)',
          color: isCompleted || isCurrent ? '#fff' : 'var(--text3)',
        }}>
          {isCompleted ? '✓' : stepNumber}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: isCompleted ? 'var(--green)' : 'var(--text)' }}>
              {title}
            </span>
            {isCompleted && (
              <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>完了</span>
            )}
          </div>

          {children && (
            <div style={{ marginTop: 12 }}>{children}</div>
          )}

          {isCurrent && !isCompleted && (
            <div style={{ marginTop: 14 }}>
              <button
                onClick={handleComplete}
                disabled={saving}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  borderRadius: 'var(--rs)', border: '1px solid var(--green-b)',
                  background: 'var(--green)', color: '#fff',
                  opacity: saving ? 0.7 : 1, transition: 'opacity .12s',
                }}
              >
                {saving ? '保存中...' : 'ステップ完了'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
