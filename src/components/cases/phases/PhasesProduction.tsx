'use client'

import { useState } from 'react'
import CopyButton from '../CopyButton'
import { Case } from '@/lib/types'
import { usePersistedForm } from '@/hooks/usePersistedForm'

interface PhasesProductionProps {
  caseItem: Case
  currentStep: number
  onStepComplete: (step: number) => Promise<void>
  onUpdateCase: (updates: Partial<Case>) => Promise<void>
}

const CONTEXT_FIELDS = [
  { key: 'area_detail',    label: 'アクセス',    placeholder: '難波駅徒歩3分' },
  { key: 'genre',          label: 'ジャンル',    placeholder: 'スナック / ラウンジ / バー' },
  { key: 'price_range',    label: '料金目安',    placeholder: 'チャージ1,000円〜' },
  { key: 'business_hours', label: '営業時間',    placeholder: '20時〜翌2時' },
  { key: 'atmosphere',     label: '雰囲気・特徴', placeholder: 'アットホーム・カラオケあり' },
] as const

export default function PhasesProduction({
  caseItem,
  currentStep,
  onStepComplete,
}: PhasesProductionProps) {
  // 共通フィールド：localStorageにケースIDで保存・復元
  const [context, setContext] = usePersistedForm(
    `smo_case_${caseItem.id}_context`,
    { area_detail: '', genre: '', price_range: '', business_hours: '', atmosphere: '' }
  )

  // Step 8: 店舗ヒアリング原文（個別保存）
  const [storeRaw, setStoreRaw] = usePersistedForm(
    `smo_case_${caseItem.id}_store_raw`,
    { raw_hearing: '' }
  )
  const [storeResult, setStoreResult] = useState('')
  const [storeLoading, setStoreLoading] = useState(false)
  const [storeError, setStoreError] = useState('')

  // Step 9: 求人固有フィールド（個別保存）
  const [jobForm, setJobForm] = usePersistedForm(
    `smo_case_${caseItem.id}_job`,
    { hourly_wage: '', working_hours: '', desired_person: '', benefits: '', raw_hearing: '' }
  )
  const [jobResult, setJobResult] = useState('')
  const [jobLoading, setJobLoading] = useState(false)
  const [jobError, setJobError] = useState('')

  const handleGenerateStore = async () => {
    setStoreLoading(true)
    setStoreError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-store-intro`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            store_name: caseItem.store_name,
            ...context,
            raw_hearing: storeRaw.raw_hearing,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setStoreResult(data.output_text)
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally {
      setStoreLoading(false)
    }
  }

  const handleGenerateJob = async () => {
    setJobLoading(true)
    setJobError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-job-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            store_name: caseItem.store_name,
            ...context,
            ...jobForm,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setJobResult(data.output_text)
    } catch (e: unknown) {
      setJobError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally {
      setJobLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 8: 店舗紹介文AI生成 */}
      {currentStep >= 8 && (
        <div className="space-y-3">
          {/* 共通フィールド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTEXT_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={context[key]}
                  onChange={(e) => setContext({ [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ヒアリング原文</label>
            <textarea
              value={storeRaw.raw_hearing}
              onChange={(e) => setStoreRaw({ raw_hearing: e.target.value })}
              placeholder="DMやフォームで受け取ったヒアリング内容をそのまま貼り付け"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {storeError && <p className="text-xs text-red-500">{storeError}</p>}

          <button
            onClick={handleGenerateStore}
            disabled={storeLoading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {storeLoading ? <><span className="animate-spin">⏳</span> 生成中（約30秒）...</> : '✨ AI生成'}
          </button>

          {storeResult && (
            <div className="space-y-2">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line">
                {storeResult}
              </div>
              <div className="flex justify-end">
                <CopyButton
                  text={storeResult}
                  label="生成文をコピー"
                  onCopied={() => currentStep === 8 && onStepComplete(8)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 9: 求人文AI生成 */}
      {currentStep >= 9 && (
        <div className="space-y-3">
          {/* 共通フィールド（Step 8で入力済みの値を表示・編集可能） */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <p className="text-xs text-gray-500 font-medium">店舗基本情報（Step 8から引き継ぎ）</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTEXT_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
                  <input
                    type="text"
                    value={context[key]}
                    onChange={(e) => setContext({ [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 求人固有フィールド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'hourly_wage',    label: '時給・給与',      placeholder: '時給1,200円〜' },
              { key: 'working_hours',  label: '勤務時間',        placeholder: '20時〜翌2時' },
              { key: 'desired_person', label: '求める人物像',    placeholder: '未経験者歓迎' },
              { key: 'benefits',       label: '待遇・福利厚生',  placeholder: '交通費支給・まかない有' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={jobForm[key as keyof typeof jobForm]}
                  onChange={(e) => setJobForm({ [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">求人ヒアリング原文</label>
            <textarea
              value={jobForm.raw_hearing}
              onChange={(e) => setJobForm({ raw_hearing: e.target.value })}
              placeholder="求人ヒアリング内容をそのまま貼り付け"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {jobError && <p className="text-xs text-red-500">{jobError}</p>}

          <button
            onClick={handleGenerateJob}
            disabled={jobLoading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {jobLoading ? <><span className="animate-spin">⏳</span> 生成中（約20秒）...</> : '✨ AI生成'}
          </button>

          {jobResult && (
            <div className="space-y-2">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line">
                {jobResult}
              </div>
              <div className="flex justify-end">
                <CopyButton
                  text={jobResult}
                  label="求人文をコピー"
                  onCopied={() => currentStep === 9 && onStepComplete(9)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 10: 管理画面入力ガイド */}
      {currentStep >= 10 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-blue-800">管理画面入力ガイド</p>
          <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
            <li>スナックマップ管理画面にログイン</li>
            <li>「新規店舗追加」から店舗名・エリアを入力</li>
            <li>生成した店舗紹介文をコピー&ペースト</li>
            <li>Driveから写真をダウンロードしてアップロード</li>
            <li>求人ページも同様に入力</li>
            <li>「下書き保存」して確認URLを控える</li>
          </ol>
        </div>
      )}
    </div>
  )
}
