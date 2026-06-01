export type Phase = 'sales' | 'collection' | 'production' | 'review' | 'instagram'
export type CaseStatus = 'active' | 'completed' | 'archived'

export interface Case {
  id: string
  store_name: string
  instagram_account: string | null
  area: string | null
  assignee: string | null
  notes: string | null
  status: CaseStatus
  current_phase: Phase
  current_step: number
  step_completed: Record<string, boolean>
  drive_folder_url: string | null
  store_page_url: string | null
  job_page_url: string | null
  created_at: string
  updated_at: string
}

export interface GeneratedContent {
  id: string
  case_id: string
  content_type: 'store_intro' | 'job_text' | 'instagram_prompt'
  input_data: Record<string, unknown>
  output_text: string
  created_at: string
}

export const PHASE_LABELS: Record<Phase, string> = {
  sales: '営業',
  collection: '情報収集',
  production: 'ページ制作',
  review: '確認・公開',
  instagram: 'Instagram投稿',
}

export const PHASE_STEPS: Record<Phase, { step: number; label: string }[]> = {
  sales: [
    { step: 1, label: '案件登録' },
    { step: 2, label: '初回DM送信' },
    { step: 3, label: '返信対応' },
  ],
  collection: [
    { step: 4, label: '画像依頼DM' },
    { step: 5, label: '画像受け取り・Drive保存' },
    { step: 6, label: '店舗情報ヒアリング依頼' },
    { step: 7, label: '求人ヒアリング依頼' },
  ],
  production: [
    { step: 8, label: '店舗紹介文AI生成' },
    { step: 9, label: '求人文AI生成' },
    { step: 10, label: '管理画面入力' },
  ],
  review: [
    { step: 11, label: '初稿確認依頼' },
    { step: 12, label: '修正対応' },
    { step: 13, label: '公開・後処理' },
  ],
  instagram: [
    { step: 14, label: '投稿情報入力' },
    { step: 15, label: '画像プロンプト生成' },
  ],
}

export const PHASE_ORDER: Phase[] = ['sales', 'collection', 'production', 'review', 'instagram']

export function getPhaseIndex(phase: Phase): number {
  return PHASE_ORDER.indexOf(phase)
}

export function getPhaseProgress(caseItem: Case): number {
  return PHASE_ORDER.indexOf(caseItem.current_phase)
}
