'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Case, Phase, PHASE_LABELS, PHASE_ORDER, PHASE_STEPS } from '@/lib/types'
import StepContent from '@/components/cases/StepContent'

const PHASE_ICONS: Record<Phase, string> = {
  sales: '📨', collection: '📁', production: '✨', review: '🚀', instagram: '📸',
}

const STATUS_LABEL: Record<string, string> = { active: '未着手', completed: '完了', archived: 'アーカイブ' }

const ALL_STEPS = PHASE_ORDER.flatMap(p => PHASE_STEPS[p])

interface PageProps { params: { id: string } }

export default function CaseDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [caseItem, setCaseItem] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState(2)
  const [expandedPhases, setExpandedPhases] = useState<Set<Phase>>(new Set(PHASE_ORDER))

  // mini new-case form
  const [newName, setNewName] = useState('')
  const [newAcct, setNewAcct] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchCase = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('cases').select('*').eq('id', params.id).single()
    if (error || !data) { router.push('/dashboard'); return }
    setCaseItem(data)
    setSelectedStep(data.current_step)
    setLoading(false)
  }, [params.id, router])

  useEffect(() => { fetchCase() }, [fetchCase])

  const handleStepComplete = async (step: number) => {
    if (!caseItem) return
    const supabase = createClient()
    const newCompleted = { ...caseItem.step_completed, [step]: true }
    const phaseIdx = PHASE_ORDER.indexOf(caseItem.current_phase)
    const phaseSteps = PHASE_STEPS[caseItem.current_phase]
    const maxStep = Math.max(...phaseSteps.map(s => s.step))

    let nextStep = step + 1
    let nextPhase = caseItem.current_phase
    let nextStatus = caseItem.status

    if (step >= maxStep) {
      if (phaseIdx < PHASE_ORDER.length - 1) {
        nextPhase = PHASE_ORDER[phaseIdx + 1]
        nextStep = Math.min(...PHASE_STEPS[nextPhase].map(s => s.step))
      } else {
        nextStatus = 'completed'
      }
    }

    const { data, error } = await supabase
      .from('cases')
      .update({ step_completed: newCompleted, current_step: nextStep, current_phase: nextPhase, status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', caseItem.id).select().single()

    if (!error && data) { setCaseItem(data); setSelectedStep(nextStep) }
  }

  const handleUpdateCase = async (updates: Partial<Case>) => {
    if (!caseItem) return
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cases').update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', caseItem.id).select().single()
    if (!error && data) setCaseItem(data)
  }

  const handleAddCase = async () => {
    if (!newName.trim()) return
    setAdding(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('cases').insert({
      store_name: newName.trim(),
      instagram_account: newAcct.trim() || null,
      current_step: 2,
      step_completed: { 1: true },
    }).select().single()
    setAdding(false)
    if (!error && data) { setNewName(''); setNewAcct(''); router.push(`/cases/${data.id}`) }
  }

  const navigate = async (dir: 'prev' | 'next') => {
    const nums = ALL_STEPS.map(s => s.step)
    const idx = nums.indexOf(selectedStep)
    if (dir === 'prev' && idx > 0) { setSelectedStep(nums[idx - 1]); return }
    if (dir === 'next' && idx < nums.length - 1) setSelectedStep(nums[idx + 1])
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text3)', fontSize: 13 }}>読み込み中...</span>
      </div>
    )
  }
  if (!caseItem) return null

  const phaseIdx = PHASE_ORDER.indexOf(caseItem.current_phase)
  const completedCount = Object.values(caseItem.step_completed).filter(Boolean).length

  const selPhase = PHASE_ORDER.find(p => PHASE_STEPS[p].some(s => s.step === selectedStep)) ?? 'sales'
  const selPhaseSteps = PHASE_STEPS[selPhase]
  const selPhaseLocalIdx = selPhaseSteps.findIndex(s => s.step === selectedStep)
  const selLabel = ALL_STEPS.find(s => s.step === selectedStep)?.label ?? ''

  const allNums = ALL_STEPS.map(s => s.step)
  const selIdx = allNums.indexOf(selectedStep)
  const hasPrev = selIdx > 0
  const hasNext = selIdx < allNums.length - 1

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'inherit', fontSize: 11, color: 'var(--text)',
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
    padding: '5px 8px', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ══ LEFT SIDEBAR ══ */}
      <aside style={{ width: 216, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Back + branding */}
        <div style={{ padding: '14px 14px 10px' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text3)', fontSize: 11, textDecoration: 'none', marginBottom: 10 }}>
            ← ダッシュボードに戻る
          </Link>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.1em', color: 'var(--text3)', textTransform: 'uppercase' }}>SNACK MAP</div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--text)' }}>営業・制作ツール</div>
        </div>

        {/* New case mini form */}
        <div style={{ padding: '0 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>+ 新規案件</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="店舗名" style={inp}
              onKeyDown={e => e.key === 'Enter' && handleAddCase()} />
            <input value={newAcct} onChange={e => setNewAcct(e.target.value)} placeholder="@Instagramアカウント名" style={inp} />
            <button onClick={handleAddCase} disabled={adding || !newName.trim()}
              style={{ width: '100%', padding: '5px', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 'var(--rs)', border: 'none', background: 'var(--acc)', color: '#fff', opacity: adding || !newName.trim() ? 0.45 : 1, letterSpacing: '.02em' }}>
              追加
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '0 12px 8px' }} />

        {/* Scrollable step tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 20px' }}>
          {/* Case row */}
          <div style={{ padding: '6px 8px', borderRadius: 'var(--rs)', background: 'var(--acc-l)', border: '1px solid var(--acc-b)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--acc)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{caseItem.store_name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                <span style={{ fontSize: 9, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80 }}>{caseItem.instagram_account || '@-'}</span>
                <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 100, background: '#fff', border: '1px solid var(--acc-b)', color: 'var(--acc)', fontWeight: 600 }}>{STATUS_LABEL[caseItem.status]}</span>
                <span style={{ fontSize: 9, color: 'var(--text3)', marginLeft: 'auto' }}>{completedCount}/15</span>
              </div>
            </div>
          </div>

          {/* Phase accordion */}
          {PHASE_ORDER.map((phase, pi) => {
            const isPast = pi < phaseIdx || caseItem.status === 'completed'
            const isCurPhase = phase === caseItem.current_phase && caseItem.status === 'active'
            const isOpen = expandedPhases.has(phase)
            const pSteps = PHASE_STEPS[phase]
            const pDone = pSteps.filter(s => caseItem.step_completed[s.step]).length

            return (
              <div key={phase} style={{ marginBottom: 2 }}>
                <button
                  onClick={() => {
                    const next = new Set(expandedPhases)
                    if (next.has(phase)) next.delete(phase); else next.add(phase)
                    setExpandedPhases(next)
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 6px', borderRadius: 'var(--rs)', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 11, fontWeight: 600, textAlign: 'left',
                    background: isCurPhase ? 'rgba(230,100,10,.06)' : 'transparent',
                    color: isCurPhase ? 'var(--acc)' : isPast ? 'var(--green)' : 'var(--text2)',
                  }}
                >
                  <span style={{ fontSize: 12 }}>{PHASE_ICONS[phase]}</span>
                  <span style={{ flex: 1 }}>{PHASE_LABELS[phase]}</span>
                  <span style={{ fontSize: 9, opacity: .7 }}>{pDone}/{pSteps.length}</span>
                  <span style={{ fontSize: 8, opacity: .5, marginLeft: 2 }}>{isOpen ? '▼' : '►'}</span>
                </button>

                {isOpen && (
                  <div style={{ paddingLeft: 10, paddingBottom: 4 }}>
                    {pSteps.map(({ step, label }) => {
                      const done = caseItem.step_completed[step] === true || isPast
                      const isCur = caseItem.current_step === step && isCurPhase
                      const isSel = selectedStep === step
                      return (
                        <button
                          key={step}
                          onClick={() => setSelectedStep(step)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 5,
                            padding: '3px 6px', borderRadius: 'var(--rs)', border: 'none',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, textAlign: 'left',
                            background: isSel ? 'var(--acc-l)' : 'transparent',
                            color: isSel ? 'var(--acc)' : done ? 'var(--green)' : isCur ? 'var(--acc)' : 'var(--text3)',
                            fontWeight: isSel || isCur ? 600 : 400,
                          }}
                        >
                          <span style={{ fontSize: 7, flexShrink: 0 }}>{done ? '●' : isCur ? '●' : '○'}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar — case info + phase tabs */}
        <header style={{ flexShrink: 0, background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.02em' }}>{caseItem.store_name}</span>
          {caseItem.instagram_account && (
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{caseItem.instagram_account}</span>
          )}
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 100, fontWeight: 600,
            background: caseItem.status === 'completed' ? 'var(--green-l)' : 'var(--surface)',
            border: `1px solid ${caseItem.status === 'completed' ? 'var(--green-b)' : 'var(--border)'}`,
            color: caseItem.status === 'completed' ? 'var(--green)' : 'var(--text3)',
          }}>
            {STATUS_LABEL[caseItem.status]}
          </span>

          <div style={{ display: 'flex', gap: 4, marginLeft: 6, flexWrap: 'wrap' }}>
            {PHASE_ORDER.map((phase, pi) => {
              const isPast = pi < phaseIdx || caseItem.status === 'completed'
              const isCur = pi === phaseIdx && caseItem.status === 'active'
              const isSel = selPhase === phase
              return (
                <button
                  key={phase}
                  onClick={() => setSelectedStep(PHASE_STEPS[phase][0].step)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 3,
                    padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    ...(isSel
                      ? { background: 'var(--acc-l)', border: '1px solid var(--acc-b)', color: 'var(--acc)' }
                      : isPast
                      ? { background: 'var(--green-l)', border: '1px solid var(--green-b)', color: 'var(--green)' }
                      : isCur
                      ? { background: 'var(--acc-l)', border: '1px solid var(--acc-b)', color: 'var(--acc)' }
                      : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text3)' }
                    ),
                  }}
                >
                  {PHASE_ICONS[phase]} {PHASE_LABELS[phase]}
                </button>
              )
            })}
          </div>
        </header>

        {/* Step progress circles */}
        <div style={{ flexShrink: 0, background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '10px 32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 480 }}>
            {selPhaseSteps.map(({ step }, i) => {
              const done = caseItem.step_completed[step] === true
              const isSel = selectedStep === step
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < selPhaseSteps.length - 1 ? 1 : 0 }}>
                  <button
                    onClick={() => setSelectedStep(step)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                      border: isSel ? '2px solid var(--acc)' : '2px solid transparent',
                      background: done ? 'var(--green)' : isSel ? 'var(--acc)' : 'var(--surface)',
                      color: done || isSel ? '#fff' : 'var(--text3)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </button>
                  {i < selPhaseSteps.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: done ? 'var(--green-b)' : 'var(--border)', margin: '0 4px' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Scrollable step content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 12px' }}>
          {/* Breadcrumb + title */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
              STEP {selPhaseLocalIdx + 1} › {PHASE_LABELS[selPhase]}
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.03em', color: 'var(--text)', margin: 0 }}>
              {selLabel}
            </h1>
          </div>

          <div style={{ maxWidth: 860 }}>
            <StepContent
              step={selectedStep}
              caseItem={caseItem}
              onStepComplete={handleStepComplete}
              onUpdateCase={handleUpdateCase}
            />
          </div>
        </div>

        {/* Footer nav */}
        <footer style={{ flexShrink: 0, background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('prev')} disabled={!hasPrev}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: hasPrev ? 'pointer' : 'not-allowed', borderRadius: 'var(--rs)', border: '1px solid var(--border)', background: 'var(--white)', color: hasPrev ? 'var(--text)' : 'var(--text3)', opacity: hasPrev ? 1 : 0.35 }}
          >
            ← 戻る
          </button>

          <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
            {PHASE_LABELS[selPhase]} › STEP {selPhaseLocalIdx + 1}/{selPhaseSteps.length}「{selLabel}」
          </span>

          <button
            onClick={() => navigate('next')} disabled={!hasNext}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: hasNext ? 'pointer' : 'not-allowed', borderRadius: 'var(--rs)', border: '1px solid var(--acc-b)', background: 'var(--acc)', color: '#fff', opacity: hasNext ? 1 : 0.35 }}
          >
            次のステップへ →
          </button>
        </footer>
      </div>
    </div>
  )
}
