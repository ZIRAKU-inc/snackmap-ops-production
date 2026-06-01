'use client'

import { useState } from 'react'
import CopyButton from '../CopyButton'
import { Case } from '@/lib/types'

interface PhasesCollectionProps {
  caseItem: Case
  currentStep: number
  onStepComplete: (step: number) => Promise<void>
  onUpdateCase: (updates: Partial<Case>) => Promise<void>
}

const DM_IMAGE_REQUEST = (storeName: string) => `${storeName}様、引き続きよろしくお願いいたします！

店舗ページ作成のため、お写真をいただけますでしょうか？

【お送りいただきたい写真】
・店内の雰囲気がわかるお写真（2〜5枚程度）
・外観・看板のお写真（あれば）
・ママ・スタッフさんのお写真（あれば）

お写真はこちらのDMにそのまま送っていただければ大丈夫です。
どうぞよろしくお願いいたします！`

const DM_HEARING_STORE = (storeName: string) => `${storeName}様、お写真ありがとうございます！

続いて、店舗紹介ページに掲載する情報をいくつかお伺いできますでしょうか？

以下の項目について、わかる範囲で教えていただければ幸いです。

【お店の基本情報】
・最寄り駅・アクセス：
・営業時間：
・チャージ料金・飲み放題：
・お店のジャンル（スナック/ラウンジ/バーなど）：
・お店の雰囲気・特徴：
・カラオケの有無：

ご不明な点があればお気軽にお聞きください！`

const DM_HEARING_JOB = (storeName: string) => `${storeName}様、ありがとうございます！

求人掲載もご希望でしょうか？
ご希望の場合は、以下の情報もお伺いできますでしょうか。

【求人情報】
・時給・給与：
・勤務時間：
・希望する方（経験者/未経験者歓迎など）：
・待遇・福利厚生：
・その他一言：

不要な場合はそのままスルーいただいて大丈夫です！`

export default function PhasesCollection({
  caseItem,
  currentStep,
  onStepComplete,
  onUpdateCase,
}: PhasesCollectionProps) {
  const [driveFolderUrl, setDriveFolderUrl] = useState(caseItem.drive_folder_url || '')
  const [savedDrive, setSavedDrive] = useState(false)

  const handleSaveDrive = async () => {
    await onUpdateCase({ drive_folder_url: driveFolderUrl })
    setSavedDrive(true)
    setTimeout(() => setSavedDrive(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Step 4: 画像依頼DM */}
      {currentStep >= 4 && (
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {DM_IMAGE_REQUEST(caseItem.store_name)}
          </div>
          <div className="flex justify-end">
            <CopyButton
              text={DM_IMAGE_REQUEST(caseItem.store_name)}
              label="DMをコピー"
              onCopied={() => currentStep === 4 && onStepComplete(4)}
            />
          </div>
        </div>
      )}

      {/* Step 5: 画像受け取り・Drive保存 */}
      {currentStep >= 5 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">GoogleDriveフォルダURLを入力して保存してください</p>
          <div className="flex gap-2">
            <input
              type="url"
              value={driveFolderUrl}
              onChange={(e) => setDriveFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSaveDrive}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              {savedDrive ? '保存済み' : '保存'}
            </button>
          </div>
          {caseItem.drive_folder_url && (
            <a
              href={caseItem.drive_folder_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              📁 Driveフォルダを開く
            </a>
          )}
        </div>
      )}

      {/* Step 6: 店舗情報ヒアリング依頼 */}
      {currentStep >= 6 && (
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {DM_HEARING_STORE(caseItem.store_name)}
          </div>
          <div className="flex justify-end">
            <CopyButton
              text={DM_HEARING_STORE(caseItem.store_name)}
              label="DMをコピー"
              onCopied={() => currentStep === 6 && onStepComplete(6)}
            />
          </div>
        </div>
      )}

      {/* Step 7: 求人ヒアリング依頼 */}
      {currentStep >= 7 && (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {DM_HEARING_JOB(caseItem.store_name)}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => onStepComplete(7)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              求人不要のためスキップ
            </button>
            <CopyButton
              text={DM_HEARING_JOB(caseItem.store_name)}
              label="DMをコピー"
              onCopied={() => currentStep === 7 && onStepComplete(7)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
