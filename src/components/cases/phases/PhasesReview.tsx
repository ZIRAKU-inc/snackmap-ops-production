'use client'

import { useState } from 'react'
import CopyButton from '../CopyButton'
import { Case } from '@/lib/types'

interface PhasesReviewProps {
  caseItem: Case
  currentStep: number
  onStepComplete: (step: number) => Promise<void>
  onUpdateCase: (updates: Partial<Case>) => Promise<void>
}

export default function PhasesReview({
  caseItem,
  currentStep,
  onStepComplete,
  onUpdateCase,
}: PhasesReviewProps) {
  const [storeUrl, setStoreUrl] = useState(caseItem.store_page_url || '')
  const [jobUrl, setJobUrl] = useState(caseItem.job_page_url || '')
  const [savedUrls, setSavedUrls] = useState(false)

  const confirmDm = storeUrl
    ? `${caseItem.store_name}様、大変お待たせいたしました！

店舗ページの初稿が完成しましたのでご確認ください。

■ 店舗ページ
${storeUrl}
${jobUrl ? `\n■ 求人ページ\n${jobUrl}\n` : ''}
ご確認いただき、修正点があればお知らせください。
問題なければそのまま公開いたします。

どうぞよろしくお願いいたします！`
    : ''

  const handleSaveUrls = async () => {
    await onUpdateCase({
      store_page_url: storeUrl || null,
      job_page_url: jobUrl || null,
    })
    setSavedUrls(true)
    setTimeout(() => setSavedUrls(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Step 11: 初稿確認依頼 */}
      {currentStep >= 11 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">店舗ページURL</label>
              <input
                type="url"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="https://snackmap.jp/stores/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">求人ページURL（任意）</label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://snackmap.jp/jobs/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            onClick={handleSaveUrls}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {savedUrls ? '保存済み ✓' : 'URLを保存'}
          </button>

          {storeUrl && (
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
                {confirmDm}
              </div>
              <div className="flex justify-end">
                <CopyButton
                  text={confirmDm}
                  label="確認DMをコピー"
                  onCopied={() => currentStep === 11 && onStepComplete(11)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 12: 修正対応 */}
      {currentStep >= 12 && (
        <div className="space-y-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="font-medium mb-1">修正対応</p>
            <p className="text-xs">修正依頼があった場合は管理画面で修正後、再度確認DMを送ってください。</p>
          </div>
          <button
            onClick={() => onStepComplete(12)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            修正なし・スキップ
          </button>
        </div>
      )}

      {/* Step 13: 公開・後処理 */}
      {currentStep >= 13 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-green-800">公開後の後処理チェックリスト</p>
          <ul className="text-xs text-green-700 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span>□</span>
              <span>管理画面でページを「公開」に変更</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>□</span>
              <span>Google Search Consoleで「URLの検査 → インデックス登録をリクエスト」</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>□</span>
              <span>顧客スナックリストに追加</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>□</span>
              <span>公開完了のご報告DMを送信</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
