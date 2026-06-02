'use client'

import { useState, useEffect } from 'react'
import CopyButton from './CopyButton'
import { Case } from '@/lib/types'
import { usePersistedForm } from '@/hooks/usePersistedForm'

interface Props {
  step: number
  caseItem: Case
  onStepComplete: (step: number) => Promise<void>
  onUpdateCase: (updates: Partial<Case>) => Promise<void>
}

// ── ステップ固有コンテンツ ──────────────────────────────

function Step1({ caseItem }: Pick<Props, 'caseItem'>) {
  return (
    <div style={{ background: 'var(--green-l)', border: '1px solid var(--green-b)', borderRadius: 'var(--rs)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 18 }}>✅</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>案件登録完了</p>
        <p style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>「{caseItem.store_name}」の案件が登録されました。次のステップ（初回DM送信）に進んでください。</p>
      </div>
    </div>
  )
}

type DmTemplate = 'lounge' | 'karaoke'

function Step2({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [template, setTemplate] = useState<DmTemplate>('lounge')

  const name = caseItem.store_name

  const templates: Record<DmTemplate, { label: string; text: string }> = {
    lounge: {
      label: 'ラウンジ ver',
      text: `初めまして！
スナック・ラウンジ専門情報検索&求人サイト「スナックマップ」の浅野と申します🤲

スナックマップのInstagramでは全国のスナック・ラウンジをご紹介しています！

スナック・ラウンジ紹介アカウントで日本一のフォロワーを抱える為、投稿をご覧になってお店に伺うお客様や求職者が急増中です✨

YouTube「スナックはしご酒」では、全国のスナック・ラウンジを紹介しており、80万再生を超える動画の他、1万再生を超える動画が多々あります🙌

${name}様の投稿は素敵な投稿が多いのでご紹介をしてもよろしいでしょうか？

ご確認をよろしくお願いいたします🙇

下記URLよりスナックマップとYouTubeをご覧いただけます！

スナックマップ公式サイト
https://www.snack-map.com/
YouTubeスナックはしご酒
https://youtube.com/@snack-hashigozake?feature=shared`,
    },
    karaoke: {
      label: 'カラオケバー ver',
      text: `初めまして！

スナック・バー専門情報検索&求人サイト「スナックマップ」の浅野と申します🤲

スナックマップのInstagramでは全国のスナック・バーをご紹介しています！

スナック・バー紹介アカウントで日本一のフォロワーを抱える為、投稿をご覧になってお店に伺うお客様や求職者が急増中です✨

YouTube「スナックはしご酒」では、全国のスナック・バーを紹介しており、80万再生を超える動画の他、1万再生を超える動画が多々あります🙌

${name}様の投稿は素敵な投稿が多いのでご紹介をしてもよろしいでしょうか？

ご確認をよろしくお願いいたします🙇

下記URLよりスナックマップとYouTubeをご覧いただけます！

スナックマップ公式サイト
https://www.snack-map.com/
YouTubeスナックはしご酒
https://youtube.com/@snack-hashigozake?feature=shared`,
    },
  }

  const dm = templates[template].text

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(Object.keys(templates) as DmTemplate[]).map(key => (
          <button
            key={key}
            onClick={() => setTemplate(key)}
            style={{
              padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', border: '1px solid',
              ...(template === key
                ? { background: 'var(--acc-l)', borderColor: 'var(--acc-b)', color: 'var(--acc)' }
                : { background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--text2)' }
              ),
            }}
          >
            {templates[key].label}
          </button>
        ))}
      </div>
      <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        {dm}
      </pre>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CopyButton text={dm} label="DMをコピー" onCopied={() => onStepComplete(2)} />
      </div>
    </div>
  )
}

function Step3({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [type, setType] = useState<'positive' | 'question'>('positive')

  const dmPositive = `ご返信ありがとうございます！

ぜひよろしくお願いいたします。

次のステップとして、${caseItem.store_name}様の店舗情報をいくつかお伺いできますでしょうか？

後ほど詳細をご案内いたします。`

  const dmQuestion = `ご質問ありがとうございます！

スナックマップへの掲載は完全無料です。

掲載内容（店舗写真・紹介文・アクセス情報など）は私どもが作成し、公開前にご確認いただく流れとなっております。

ぜひ一度お試しいただけますと幸いです！`

  const dm = type === 'positive' ? dmPositive : dmQuestion

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {(['positive', 'question'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid', ...(type === t ? { background: 'var(--acc-l)', borderColor: 'var(--acc-b)', color: 'var(--acc)' } : { background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--text2)' }) }}>
            {t === 'positive' ? '前向きな返信' : '質問・確認の返信'}
          </button>
        ))}
      </div>
      <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        {dm}
      </pre>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CopyButton text={dm} label="返信をコピー" onCopied={() => onStepComplete(3)} />
      </div>
    </div>
  )
}

function Step4({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const dm = `${caseItem.store_name}様、引き続きよろしくお願いいたします！

店舗ページ作成のため、お写真をいただけますでしょうか？

【お送りいただきたい写真】
・店内の雰囲気がわかるお写真（2〜5枚程度）
・外観・看板のお写真（あれば）
・ママ・スタッフさんのお写真（あれば）

お写真はこちらのDMにそのまま送っていただければ大丈夫です。
どうぞよろしくお願いいたします！`

  return (
    <div style={{ marginTop: 12 }}>
      <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        {dm}
      </pre>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CopyButton text={dm} label="DMをコピー" onCopied={() => onStepComplete(4)} />
      </div>
    </div>
  )
}

function Step5({ caseItem, onStepComplete, onUpdateCase }: Props) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(caseItem.drive_folder_url || '')
  const [saving, setSaving] = useState(false)

  const handleSaveUrl = async () => {
    if (!url.trim()) return
    setSaving(true)
    await onUpdateCase({ drive_folder_url: url.trim() })
    setSaving(false)
    setEditing(false)
  }

  if (!caseItem.drive_folder_url && !editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: 'var(--amber-l)', border: '1px solid var(--amber-b)', borderRadius: 'var(--rs)', padding: '14px 16px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', marginBottom: 6 }}>Driveフォルダ未設定</p>
          <p style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>
            この案件用のGoogle DriveフォルダURLを登録してください。登録後、毎回フォルダリンクが表示されます。
          </p>
        </div>
        <button onClick={() => setEditing(true)}
          style={{ alignSelf: 'flex-start', padding: '6px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--blue-b)', background: 'var(--blue-l)', color: 'var(--blue)' }}>
          📁 フォルダURLを登録
        </button>
      </div>
    )
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 11, color: 'var(--text2)' }}>Google DriveフォルダURL</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://drive.google.com/drive/folders/..."
            autoFocus
            style={{ flex: 1, fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
          <button onClick={handleSaveUrl} disabled={saving || !url.trim()}
            style={{ padding: '7px 14px', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--blue-b)', background: 'var(--blue)', color: '#fff', opacity: saving || !url.trim() ? 0.5 : 1 }}>
            {saving ? '保存中...' : '保存'}
          </button>
          <button onClick={() => { setUrl(caseItem.drive_folder_url || ''); setEditing(false) }}
            style={{ padding: '7px 12px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text3)' }}>
            キャンセル
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>受け取った写真をこちらのフォルダに保存してください</p>
        <a href={caseItem.drive_folder_url!} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--rs)', background: 'var(--blue-l)', border: '1px solid var(--blue-b)', color: 'var(--blue)', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
          📁 Driveフォルダを開く
        </a>
        <ul style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 2.2, listStyle: 'none', padding: 0, marginTop: 12 }}>
          <li>□ 店内の雰囲気写真（2〜5枚）</li>
          <li>□ 外観・看板写真（あれば）</li>
          <li>□ ママ・スタッフ写真（あれば）</li>
        </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onStepComplete(5)}
          style={{ padding: '6px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff' }}>
          保存完了
        </button>
        <button onClick={() => setEditing(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text3)', fontFamily: 'inherit', textDecoration: 'underline' }}>
          フォルダURLを変更
        </button>
      </div>
    </div>
  )
}

function Step6({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const dm = `${caseItem.store_name}様、お写真ありがとうございます！

続いて、店舗紹介ページに掲載する情報をいくつかお伺いできますでしょうか？

【お店の基本情報】
・最寄り駅・アクセス：
・営業時間：
・チャージ料金・飲み放題：
・お店のジャンル（スナック/ラウンジ/バーなど）：
・お店の雰囲気・特徴：
・カラオケの有無：

ご不明な点があればお気軽にお聞きください！`

  return (
    <div style={{ marginTop: 12 }}>
      <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        {dm}
      </pre>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CopyButton text={dm} label="DMをコピー" onCopied={() => onStepComplete(6)} />
      </div>
    </div>
  )
}

function Step7({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const dm = `${caseItem.store_name}様、ありがとうございます！

求人掲載もご希望でしょうか？
ご希望の場合は、以下の情報もお伺いできますでしょうか。

【求人情報】
・時給・給与：
・勤務時間：
・希望する方（経験者/未経験者歓迎など）：
・待遇・福利厚生：
・その他一言：

不要な場合はそのままスルーいただいて大丈夫です！`

  return (
    <div style={{ marginTop: 12 }}>
      <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        {dm}
      </pre>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onStepComplete(7)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text3)', fontFamily: 'inherit', textDecoration: 'underline' }}>
          求人不要のためスキップ
        </button>
        <CopyButton text={dm} label="DMをコピー" onCopied={() => onStepComplete(7)} />
      </div>
    </div>
  )
}

interface StoreIntroResult {
  titles: string[]
  body: string
  seo_title: string
  meta_description: string
}

function Step8({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [context, setContext] = usePersistedForm(`smo_case_${caseItem.id}_context`, { area_detail: '', genre: '', price_range: '', business_hours: '', atmosphere: '' })
  const [rawHearing, setRawHearing] = usePersistedForm(`smo_case_${caseItem.id}_store_raw`, { raw_hearing: '' })
  const [result, setResult] = useState<StoreIntroResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputFields = [
    { key: 'area_detail',    label: 'エリア・最寄駅', placeholder: '東新宿駅徒歩5分、歌舞伎町2丁目' },
    { key: 'genre',          label: '業態',           placeholder: 'カラオケバー / スナック / ラウンジ' },
    { key: 'price_range',    label: '料金',           placeholder: '男性5,500円・女性3,300円（飲み放題制）' },
    { key: 'business_hours', label: '営業時間',       placeholder: '火〜土 0:00〜8:00' },
    { key: 'atmosphere',     label: '雰囲気・特徴',   placeholder: '夜桜ネオン・カラオケ無料・姉妹店あり' },
  ] as const

  const handleGenerate = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-store-intro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ store_name: caseItem.store_name, ...context, raw_hearing: rawHearing.raw_hearing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      const parsed = data as StoreIntroResult
      setResult(parsed)
      try { localStorage.setItem(`smo_case_${caseItem.id}_store_intro_result`, JSON.stringify(parsed)) } catch {}
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  const updateResult = (patch: Partial<StoreIntroResult>) => {
    if (!result) return
    const next = { ...result, ...patch }
    setResult(next)
    try { localStorage.setItem(`smo_case_${caseItem.id}_store_intro_result`, JSON.stringify(next)) } catch {}
  }

  const updateTitle = (i: number, val: string) => {
    if (!result) return
    const titles = [...result.titles]
    titles[i] = val
    updateResult({ titles })
  }

  const copyText = result
    ? `【タイトル案】\n${result.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n【紹介文】\n${result.body}\n\n【SEOタイトル】\n${result.seo_title}\n\n【メタディスクリプション】\n${result.meta_description}`
    : ''

  const taStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)',
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
    padding: '10px 12px', outline: 'none', resize: 'vertical', lineHeight: 1.8,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {inputFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{label}</label>
            <input type="text" value={context[key]} onChange={e => setContext({ [key]: e.target.value })} placeholder={placeholder}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>ヒアリング原文（DMの返信文をそのまま貼り付け）</label>
        <textarea value={rawHearing.raw_hearing} onChange={e => setRawHearing({ raw_hearing: e.target.value })} placeholder="先方からのDM・ヒアリング回答をそのまま貼り付け" rows={5}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none', resize: 'vertical' }} />
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}
      <div>
        <button onClick={handleGenerate} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--purple-b)', background: 'var(--purple)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ 生成中（約30秒）...' : '✨ AI生成'}
        </button>
      </div>
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text3)' }}>✏️ 生成された文章は直接編集できます</p>

          {/* タイトル案 */}
          <div style={{ background: 'var(--purple-l)', border: '1px solid var(--purple-b)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--purple)', marginBottom: 8 }}>タイトル案（5案）</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.titles.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 600, width: 16, flexShrink: 0 }}>{i + 1}.</span>
                  <input value={t} onChange={e => updateTitle(i, e.target.value)}
                    style={{ flex: 1, fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--purple-b)', borderRadius: 'var(--rs)', padding: '5px 10px', outline: 'none' }} />
                  <CopyButton text={t} label="コピー" />
                </div>
              ))}
            </div>
          </div>

          {/* 紹介文 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>店舗紹介文</label>
              <CopyButton text={result.body} label="紹介文をコピー" />
            </div>
            <textarea value={result.body} onChange={e => updateResult({ body: e.target.value })} rows={12} style={taStyle} />
          </div>

          {/* SEO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>SEOタイトル</label>
                <CopyButton text={result.seo_title} label="コピー" />
              </div>
              <input value={result.seo_title} onChange={e => updateResult({ seo_title: e.target.value })}
                style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>メタディスクリプション</label>
                <CopyButton text={result.meta_description} label="コピー" />
              </div>
              <textarea value={result.meta_description} onChange={e => updateResult({ meta_description: e.target.value })} rows={3}
                style={{ ...taStyle, fontSize: 11 }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={copyText} label="全文コピー" onCopied={() => onStepComplete(8)} />
          </div>
        </div>
      )}
    </div>
  )
}

interface JobTextResult {
  title: string
  body: string
  tags: string[]
}

function Step9({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [context, setContext] = usePersistedForm(`smo_case_${caseItem.id}_context`, { area_detail: '', genre: '', price_range: '', business_hours: '', atmosphere: '' })
  const [jobForm, setJobForm] = usePersistedForm(`smo_case_${caseItem.id}_job`, {
    hourly_wage: '', trial_wage: '', working_hours: '', shift_flexibility: '',
    desired_person: '', benefits: '', store_atmosphere: '', raw_hearing: '',
  })
  const [result, setResult] = useState<JobTextResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-job-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ store_name: caseItem.store_name, ...context, ...jobForm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      const parsed = data as JobTextResult
      setResult(parsed)
      try { localStorage.setItem(`smo_case_${caseItem.id}_job_result`, JSON.stringify(parsed)) } catch {}
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  const contextFields = [
    { key: 'area_detail', label: 'エリア・最寄駅', placeholder: '中洲川端駅徒歩3分' },
    { key: 'genre',       label: '業態',          placeholder: 'スナック' },
    { key: 'atmosphere',  label: '雰囲気',         placeholder: 'アットホーム・紳士的な常連さん中心' },
  ] as const

  const jobFields = [
    { key: 'hourly_wage',       label: '時給',             placeholder: '時給2,000円〜（経験者優遇）' },
    { key: 'trial_wage',        label: '体験入店時給',      placeholder: '体験入店時給2,000円' },
    { key: 'working_hours',     label: '勤務時間',          placeholder: '20:00〜24:00' },
    { key: 'shift_flexibility', label: 'シフト',            placeholder: '週1日〜OK・月2回も可' },
    { key: 'desired_person',    label: 'こんな方歓迎',      placeholder: '未経験歓迎・Wワーク・学生OK' },
    { key: 'benefits',          label: '待遇・福利厚生',    placeholder: '日払いOK・昇給あり・ノルマなし' },
    { key: 'store_atmosphere',  label: 'お店の雰囲気（求人用）', placeholder: '高級感のあるアットホームな雰囲気' },
  ] as const

  const updateResult = (patch: Partial<JobTextResult>) => {
    if (!result) return
    const next = { ...result, ...patch }
    setResult(next)
    try { localStorage.setItem(`smo_case_${caseItem.id}_job_result`, JSON.stringify(next)) } catch {}
  }

  const copyText = result
    ? `【求人タイトル】\n${result.title}\n\n【求人本文】\n${result.body}\n\n【タグ】\n${result.tags.join(' ')}`
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* 店舗基本情報（Step 8から引き継ぎ） */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px' }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>店舗基本情報（Step 8と共有・編集可）</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {contextFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>{label}</label>
              <input type="text" value={context[key]} onChange={e => setContext({ [key]: e.target.value })} placeholder={placeholder}
                style={{ width: '100%', fontFamily: 'inherit', fontSize: 11, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '5px 8px', outline: 'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 求人固有フィールド */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {jobFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{label}</label>
            <input type="text" value={jobForm[key]} onChange={e => setJobForm({ [key]: e.target.value })} placeholder={placeholder}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>ヒアリング原文（求人）</label>
        <textarea value={jobForm.raw_hearing} onChange={e => setJobForm({ raw_hearing: e.target.value })} placeholder="求人ヒアリング内容をそのまま貼り付け" rows={3}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none', resize: 'vertical' }} />
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}
      <div>
        <button onClick={handleGenerate} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--purple-b)', background: 'var(--purple)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ 生成中（約20秒）...' : '✨ AI生成'}
        </button>
      </div>
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text3)' }}>✏️ 生成された文章は直接編集できます</p>

          {/* タイトル */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>求人タイトル</label>
              <CopyButton text={result.title} label="コピー" />
            </div>
            <input value={result.title} onChange={e => updateResult({ title: e.target.value })}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '8px 12px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* 本文 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>求人本文</label>
              <CopyButton text={result.body} label="本文をコピー" />
            </div>
            <textarea value={result.body} onChange={e => updateResult({ body: e.target.value })} rows={14}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px', outline: 'none', resize: 'vertical', lineHeight: 1.8, boxSizing: 'border-box' }} />
          </div>

          {/* タグ */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>タグ</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {result.tags.map((tag, i) => (
                <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'var(--white)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={copyText} label="全文コピー" onCopied={() => onStepComplete(9)} />
          </div>
        </div>
      )}
    </div>
  )
}

function Step10({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [storeIntro, setStoreIntro] = useState<StoreIntroResult | null>(null)
  const [jobText, setJobText] = useState<JobTextResult | null>(null)

  useEffect(() => {
    try {
      const si = localStorage.getItem(`smo_case_${caseItem.id}_store_intro_result`)
      if (si) setStoreIntro(JSON.parse(si))
      const jt = localStorage.getItem(`smo_case_${caseItem.id}_job_result`)
      if (jt) setJobText(JSON.parse(jt))
    } catch {}
  }, [caseItem.id])

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)',
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
    padding: '7px 10px', outline: 'none',
  }

  const sectionTitle = (n: string, done: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--green)' : 'var(--blue)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{done ? '✓' : '→'}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: done ? 'var(--green)' : 'var(--text)' }}>{n}</span>
    </div>
  )

  const card = (children: React.ReactNode, done = false) => (
    <div style={{ background: 'var(--white)', border: `1px solid ${done ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 'var(--rs)', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
      {children}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* 1. ログイン */}
      {card(
        <>
          {sectionTitle('スナックマップ管理画面にログイン', false)}
          <a href="https://www.snack-map.com/admin" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--rs)', background: 'var(--blue-l)', border: '1px solid var(--blue-b)', color: 'var(--blue)', fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
            🔑 管理画面を開く
          </a>
        </>
      )}

      {/* 2. 店舗名・エリア */}
      {card(
        <>
          {sectionTitle('「新規店舗追加」から店舗名・エリアを入力', !!(caseItem.store_name && caseItem.area))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>店舗名</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input readOnly value={caseItem.store_name} style={{ ...inp, background: 'var(--surface)', cursor: 'text' }} />
                <CopyButton text={caseItem.store_name} label="コピー" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>エリア</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input readOnly value={caseItem.area || '（未設定）'} style={{ ...inp, background: 'var(--surface)', cursor: 'text' }} />
                {caseItem.area && <CopyButton text={caseItem.area} label="コピー" />}
              </div>
            </div>
          </div>
        </>,
        !!(caseItem.store_name && caseItem.area)
      )}

      {/* 3. 店舗紹介文 */}
      {card(
        <>
          {sectionTitle('生成した店舗紹介文をコピー＆ペースト', !!storeIntro)}
          {storeIntro ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>タイトル案（5案）</p>
                <ol style={{ fontSize: 11, color: 'var(--text)', paddingLeft: 18, lineHeight: 2 }}>
                  {storeIntro.titles.map((t, i) => <li key={i}>{t}</li>)}
                </ol>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontSize: 10, color: 'var(--text3)' }}>紹介文</p>
                  <CopyButton text={storeIntro.body} label="紹介文をコピー" />
                </div>
                <pre style={{ fontSize: 11, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontFamily: 'inherit', maxHeight: 160, overflowY: 'auto' }}>{storeIntro.body}</pre>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 10, color: 'var(--text3)' }}>SEOタイトル</p>
                    <CopyButton text={storeIntro.seo_title} label="コピー" />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '8px 10px' }}>{storeIntro.seo_title}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 10, color: 'var(--text3)' }}>メタディスクリプション</p>
                    <CopyButton text={storeIntro.meta_description} label="コピー" />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '8px 10px' }}>{storeIntro.meta_description}</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: 'var(--amber)', background: 'var(--amber-l)', border: '1px solid var(--amber-b)', borderRadius: 'var(--rs)', padding: '8px 12px' }}>
              Step 8「店舗紹介文AI生成」でAI生成を完了させると、ここに表示されます。
            </p>
          )}
        </>,
        !!storeIntro
      )}

      {/* 4. Drive写真 */}
      {card(
        <>
          {sectionTitle('Driveから写真をダウンロードしてアップロード', !!caseItem.drive_folder_url)}
          {caseItem.drive_folder_url ? (
            <a href={caseItem.drive_folder_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--rs)', background: 'var(--blue-l)', border: '1px solid var(--blue-b)', color: 'var(--blue)', fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
              📁 Driveフォルダを開く
            </a>
          ) : (
            <p style={{ fontSize: 11, color: 'var(--amber)', background: 'var(--amber-l)', border: '1px solid var(--amber-b)', borderRadius: 'var(--rs)', padding: '8px 12px' }}>
              Step 5でDriveフォルダURLを登録するとリンクが表示されます。
            </p>
          )}
        </>,
        !!caseItem.drive_folder_url
      )}

      {/* 5. 求人文 */}
      {card(
        <>
          {sectionTitle('求人ページも同様に入力', !!jobText)}
          {jobText ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontSize: 10, color: 'var(--text3)' }}>求人タイトル</p>
                  <CopyButton text={jobText.title} label="コピー" />
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '8px 10px' }}>{jobText.title}</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontSize: 10, color: 'var(--text3)' }}>求人本文</p>
                  <CopyButton text={jobText.body} label="求人文をコピー" />
                </div>
                <pre style={{ fontSize: 11, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontFamily: 'inherit', maxHeight: 160, overflowY: 'auto' }}>{jobText.body}</pre>
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>タグ</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {jobText.tags.map((tag, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'var(--white)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: 'var(--text3)' }}>
              Step 9「求人文AI生成」を完了させると、ここに表示されます。（求人不要の場合はスキップ可）
            </p>
          )}
        </>,
        !!jobText
      )}

      {/* 6. 下書き保存 */}
      {card(
        <>
          {sectionTitle('「下書き保存」して確認URLを控える', false)}
          <p style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.8 }}>
            管理画面で「下書き保存」を押し、表示された確認URLをコピーしてください。<br />
            次のステップ（初稿確認依頼）でそのURLを使ってDMを送ります。
          </p>
        </>
      )}

      <div>
        <button onClick={() => onStepComplete(10)}
          style={{ padding: '7px 18px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff' }}>
          入力完了
        </button>
      </div>
    </div>
  )
}

function Step11({ caseItem, onStepComplete, onUpdateCase }: Props) {
  const [storeUrl, setStoreUrl] = useState(caseItem.store_page_url || '')
  const [jobUrl, setJobUrl] = useState(caseItem.job_page_url || '')
  const [saved, setSaved] = useState(false)

  const confirmDm = storeUrl ? `${caseItem.store_name}様、大変お待たせいたしました！

店舗ページの初稿が完成しましたのでご確認ください。

■ 店舗ページ
${storeUrl}${jobUrl ? `\n\n■ 求人ページ\n${jobUrl}` : ''}

ご確認いただき、修正点があればお知らせください。
問題なければそのまま公開いたします。

どうぞよろしくお願いいたします！` : ''

  const handleSave = async () => {
    await onUpdateCase({ store_page_url: storeUrl || null, job_page_url: jobUrl || null })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>店舗ページURL</label>
          <input type="url" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} placeholder="https://snackmap.jp/stores/..."
            style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>求人ページURL（任意）</label>
          <input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)} placeholder="https://snackmap.jp/jobs/..."
            style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
        </div>
      </div>
      <button onClick={handleSave} style={{ alignSelf: 'flex-start', padding: '5px 12px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--blue-b)', background: 'var(--blue-l)', color: 'var(--blue)' }}>
        {saved ? 'URLを保存済み ✓' : 'URLを保存'}
      </button>
      {storeUrl && (
        <div>
          <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>{confirmDm}</pre>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={confirmDm} label="確認DMをコピー" onCopied={() => onStepComplete(11)} />
          </div>
        </div>
      )}
    </div>
  )
}

function Step12({ onStepComplete }: Pick<Props, 'onStepComplete'>) {
  return (
    <div style={{ marginTop: 12, background: 'var(--amber-l)', border: '1px solid var(--amber-b)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--amber)', marginBottom: 4 }}>修正対応</p>
      <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10 }}>修正依頼があった場合は管理画面で修正後、再度確認DMを送ってください。</p>
      <button onClick={() => onStepComplete(12)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text3)', fontFamily: 'inherit', textDecoration: 'underline' }}>
        修正なし・スキップ
      </button>
    </div>
  )
}

function Step13({ onStepComplete }: Pick<Props, 'onStepComplete'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--green-l)', border: '1px solid var(--green-b)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)', marginBottom: 8 }}>公開後の後処理チェックリスト</p>
        <ul style={{ fontSize: 11, color: 'var(--green)', lineHeight: 2.4, listStyle: 'none', padding: 0 }}>
          <li>□ 管理画面でページを「公開」に変更</li>
          <li>□ Google Search Console → URLの検査 → インデックス登録をリクエスト</li>
          <li>□ 顧客スナックリストに追加</li>
          <li>□ 公開完了のご報告DMを送信</li>
        </ul>
      </div>
      <div>
        <button onClick={() => onStepComplete(13)}
          style={{ padding: '6px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff' }}>
          後処理完了・公開
        </button>
      </div>
    </div>
  )
}

function Step14({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>投稿写真の準備</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 10 }}>
          Instagram投稿用の画像を作成します。以下の情報をもとにAI画像生成プロンプトを作成します。
        </p>
        <ul style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 2.2, listStyle: 'none', padding: 0 }}>
          <li>📸 公開済み店舗ページのスクリーンショットを用意</li>
          <li>🎨 店舗の雰囲気に合った画像素材（Driveから確認）</li>
          <li>✍️ 次のステップで投稿用テキストプロンプトを生成します</li>
        </ul>
      </div>
      <div>
        <button onClick={() => onStepComplete(14)}
          style={{ padding: '6px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff' }}>
          準備完了・次へ
        </button>
      </div>
    </div>
  )
}

interface InstagramResult {
  en_prompt: string
  ja_prompt: string
  caption: string
}

function Step15({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [form, setForm] = usePersistedForm(`smo_case_${caseItem.id}_ig`, { area: caseItem.area || '', price_range: '', business_hours: '', features: '', atmosphere: '' })
  const [result, setResult] = useState<InstagramResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-instagram-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ store_name: caseItem.store_name, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setResult(data as InstagramResult)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  const fields = [
    { key: 'area',           label: 'エリア',   placeholder: '難波' },
    { key: 'price_range',    label: '料金目安', placeholder: 'チャージ1,000円〜' },
    { key: 'business_hours', label: '営業時間', placeholder: '20時〜翌2時' },
    { key: 'features',       label: '特徴',     placeholder: 'カラオケあり' },
    { key: 'atmosphere',     label: '雰囲気',   placeholder: 'アットホーム' },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{label}</label>
            <input type="text" value={form[key]} onChange={e => setForm({ [key]: e.target.value })} placeholder={placeholder}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
          </div>
        ))}
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}
      <div>
        <button onClick={handleGenerate} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ 生成中...' : '📸 プロンプト生成'}
        </button>
      </div>
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--green-l)', border: '1px solid var(--green-b)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>英語プロンプト（DALL-E / Midjourney用）</p>
            <pre style={{ fontSize: 11, color: 'var(--text)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, marginBottom: 8 }}>{result.en_prompt}</pre>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>日本語訳</p>
            <p style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{result.ja_prompt}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Instagramキャプション</p>
            <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>{result.caption}</pre>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={`${result.en_prompt}\n\n---\n\n${result.caption}`} label="プロンプト＋キャプションをコピー" onCopied={() => onStepComplete(15)} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── メインエクスポート ──────────────────────────────────

export default function StepContent({ step, caseItem, onStepComplete, onUpdateCase }: Props) {
  switch (step) {
    case 1:  return <Step1  caseItem={caseItem} />
    case 2:  return <Step2  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 3:  return <Step3  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 4:  return <Step4  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 5:  return <Step5  step={step} caseItem={caseItem} onStepComplete={onStepComplete} onUpdateCase={onUpdateCase} />
    case 6:  return <Step6  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 7:  return <Step7  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 8:  return <Step8  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 9:  return <Step9  caseItem={caseItem} onStepComplete={onStepComplete} />
    case 10: return <Step10 caseItem={caseItem} onStepComplete={onStepComplete} />
    case 11: return <Step11 step={step} caseItem={caseItem} onStepComplete={onStepComplete} onUpdateCase={onUpdateCase} />
    case 12: return <Step12 onStepComplete={onStepComplete} />
    case 13: return <Step13 onStepComplete={onStepComplete} />
    case 14: return <Step14 caseItem={caseItem} onStepComplete={onStepComplete} />
    case 15: return <Step15 caseItem={caseItem} onStepComplete={onStepComplete} />
    default: return null
  }
}
