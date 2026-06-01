'use client'

import { useState } from 'react'
import CopyButton from '../CopyButton'
import { Case } from '@/lib/types'

interface PhasesSalesProps {
  caseItem: Case
  currentStep: number
  onStepComplete: (step: number) => Promise<void>
  onUpdateCase: (updates: Partial<Case>) => Promise<void>
}

const DM_INITIAL_SNACK = (storeName: string) => `はじめまして！スナックマップ運営事務局と申します。

${storeName}様のInstagramを拝見し、ぜひスナックマップにご掲載いただきたくご連絡しました。

スナックマップは、スナック・バー・ラウンジを探しているお客様に向けた専門の情報サイトです。

掲載は完全無料で、店舗ページの作成から公開まで私どもが対応いたします。

よろしければ、詳細をご案内させていただけますでしょうか？`

const DM_REPLY_POSITIVE = (storeName: string) => `ご返信ありがとうございます！

ぜひよろしくお願いいたします。

次のステップとして、${storeName}様の店舗情報をいくつかお伺いできますでしょうか？

後ほど詳細をご案内いたします。`

const DM_REPLY_QUESTION = () => `ご質問ありがとうございます！

スナックマップへの掲載は完全無料です。

掲載内容（店舗写真・紹介文・アクセス情報など）は私どもが作成し、公開前にご確認いただく流れとなっております。

ぜひ一度お試しいただけますと幸いです！`

export default function PhasesSales({ caseItem, currentStep, onStepComplete, onUpdateCase }: PhasesSalesProps) {
  const [replyType, setReplyType] = useState<'positive' | 'question'>('positive')

  return (
    <div className="space-y-4">
      {/* Step 1: 案件登録 — 完了済みなのでコンテンツなし */}

      {/* Step 2: 初回DM送信 */}
      {currentStep >= 2 && (
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {DM_INITIAL_SNACK(caseItem.store_name)}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">コピーしてInstagramのDMに貼り付けてください</p>
            <CopyButton
              text={DM_INITIAL_SNACK(caseItem.store_name)}
              label="DMをコピー"
              onCopied={() => currentStep === 2 && onStepComplete(2)}
            />
          </div>
        </div>
      )}

      {/* Step 3: 返信対応 */}
      {currentStep >= 3 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setReplyType('positive')}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                replyType === 'positive'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              前向きな返信
            </button>
            <button
              onClick={() => setReplyType('question')}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                replyType === 'question'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              質問・確認の返信
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {replyType === 'positive'
              ? DM_REPLY_POSITIVE(caseItem.store_name)
              : DM_REPLY_QUESTION()}
          </div>
          <div className="flex justify-end">
            <CopyButton
              text={replyType === 'positive' ? DM_REPLY_POSITIVE(caseItem.store_name) : DM_REPLY_QUESTION()}
              label="返信をコピー"
              onCopied={() => currentStep === 3 && onStepComplete(3)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
