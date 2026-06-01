'use client'

import { useState } from 'react'
import CopyButton from '../CopyButton'
import { Case } from '@/lib/types'

interface PhasesInstagramProps {
  caseItem: Case
  currentStep: number
  onStepComplete: (step: number) => Promise<void>
}

export default function PhasesInstagram({
  caseItem,
  currentStep,
  onStepComplete,
}: PhasesInstagramProps) {
  const [igForm, setIgForm] = useState({
    area: caseItem.area || '',
    price_range: '',
    business_hours: '',
    features: '',
    atmosphere: '',
  })
  const [igResult, setIgResult] = useState('')
  const [igLoading, setIgLoading] = useState(false)
  const [igError, setIgError] = useState('')

  const handleGenerateIg = async () => {
    setIgLoading(true)
    setIgError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-instagram-prompt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ store_name: caseItem.store_name, ...igForm }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setIgResult(data.output_text)
    } catch (e: unknown) {
      setIgError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally {
      setIgLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Step 14: 投稿情報入力 */}
      {currentStep >= 14 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'area', label: 'エリア', placeholder: '難波' },
            { key: 'price_range', label: '料金目安', placeholder: 'チャージ1,000円〜' },
            { key: 'business_hours', label: '営業時間', placeholder: '20時〜翌2時' },
            { key: 'features', label: '特徴', placeholder: 'カラオケあり' },
            { key: 'atmosphere', label: '雰囲気', placeholder: 'アットホーム' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="text"
                value={igForm[key as keyof typeof igForm]}
                onChange={(e) => setIgForm(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Step 15: プロンプト生成 */}
      {currentStep >= 15 && (
        <div className="space-y-3">
          {igError && <p className="text-xs text-red-500">{igError}</p>}

          <button
            onClick={handleGenerateIg}
            disabled={igLoading}
            className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {igLoading ? (
              <><span className="animate-spin">⏳</span> 生成中...</>
            ) : (
              '📸 プロンプト生成'
            )}
          </button>

          {igResult && (
            <div className="space-y-2">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line">
                {igResult}
              </div>
              <div className="flex justify-end">
                <CopyButton
                  text={igResult}
                  label="プロンプトをコピー"
                  onCopied={() => currentStep === 15 && onStepComplete(15)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
