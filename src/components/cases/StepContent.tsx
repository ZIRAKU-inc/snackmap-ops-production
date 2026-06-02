'use client'

import { useState } from 'react'
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

function Step8({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [context, setContext] = usePersistedForm(`smo_case_${caseItem.id}_context`, { area_detail: '', genre: '', price_range: '', business_hours: '', atmosphere: '' })
  const [rawHearing, setRawHearing] = usePersistedForm(`smo_case_${caseItem.id}_store_raw`, { raw_hearing: '' })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fields = [
    { key: 'area_detail',    label: 'アクセス',    placeholder: '難波駅徒歩3分' },
    { key: 'genre',          label: 'ジャンル',    placeholder: 'スナック / ラウンジ / バー' },
    { key: 'price_range',    label: '料金目安',    placeholder: 'チャージ1,000円〜' },
    { key: 'business_hours', label: '営業時間',    placeholder: '20時〜翌2時' },
    { key: 'atmosphere',     label: '雰囲気・特徴', placeholder: 'アットホーム・カラオケあり' },
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
      setResult(data.output_text)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{label}</label>
            <input type="text" value={context[key]} onChange={e => setContext({ [key]: e.target.value })} placeholder={placeholder}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none' }} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>ヒアリング原文</label>
        <textarea value={rawHearing.raw_hearing} onChange={e => setRawHearing({ raw_hearing: e.target.value })} placeholder="DMやフォームで受け取ったヒアリング内容をそのまま貼り付け" rows={4}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none', resize: 'vertical' }} />
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}
      <button onClick={handleGenerate} disabled={loading}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--purple-b)', background: 'var(--purple)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ 生成中（約30秒）...' : '✨ AI生成'}
      </button>
      {result && (
        <div>
          <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--purple-l)', border: '1px solid var(--purple-b)', borderRadius: 'var(--rs)', padding: '12px 14px', whiteSpace: 'pre-wrap', lineHeight: 1.7, marginBottom: 8, fontFamily: 'inherit' }}>{result}</pre>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={result} label="生成文をコピー" onCopied={() => onStepComplete(8)} />
          </div>
        </div>
      )}
    </div>
  )
}

function Step9({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [context, setContext] = usePersistedForm(`smo_case_${caseItem.id}_context`, { area_detail: '', genre: '', price_range: '', business_hours: '', atmosphere: '' })
  const [jobForm, setJobForm] = usePersistedForm(`smo_case_${caseItem.id}_job`, { hourly_wage: '', working_hours: '', desired_person: '', benefits: '', raw_hearing: '' })
  const [result, setResult] = useState('')
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
      setResult(data.output_text)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  const contextFields = [
    { key: 'area_detail', label: 'アクセス', placeholder: '難波駅徒歩3分' },
    { key: 'genre', label: 'ジャンル', placeholder: 'スナック' },
    { key: 'price_range', label: '料金目安', placeholder: 'チャージ1,000円〜' },
    { key: 'business_hours', label: '営業時間', placeholder: '20時〜翌2時' },
    { key: 'atmosphere', label: '雰囲気', placeholder: 'アットホーム' },
  ] as const

  const jobFields = [
    { key: 'hourly_wage', label: '時給・給与', placeholder: '時給1,200円〜' },
    { key: 'working_hours', label: '勤務時間', placeholder: '20時〜翌2時' },
    { key: 'desired_person', label: '求める人物像', placeholder: '未経験者歓迎' },
    { key: 'benefits', label: '待遇・福利厚生', placeholder: '交通費支給・まかない有' },
  ] as const

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* 店舗情報（Step 8から引き継ぎ） */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px' }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>店舗基本情報（Step 8から引き継ぎ・編集可）</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
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
        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>求人ヒアリング原文</label>
        <textarea value={jobForm.raw_hearing} onChange={e => setJobForm({ raw_hearing: e.target.value })} placeholder="求人ヒアリング内容をそのまま貼り付け" rows={3}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 12, color: 'var(--text)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 10px', outline: 'none', resize: 'vertical' }} />
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626' }}>{error}</p>}
      <button onClick={handleGenerate} disabled={loading}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--purple-b)', background: 'var(--purple)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ 生成中（約20秒）...' : '✨ AI生成'}
      </button>
      {result && (
        <div>
          <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--purple-l)', border: '1px solid var(--purple-b)', borderRadius: 'var(--rs)', padding: '12px 14px', whiteSpace: 'pre-wrap', lineHeight: 1.7, marginBottom: 8, fontFamily: 'inherit' }}>{result}</pre>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={result} label="求人文をコピー" onCopied={() => onStepComplete(9)} />
          </div>
        </div>
      )}
    </div>
  )
}

function Step10({ onStepComplete }: Pick<Props, 'onStepComplete'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--blue-l)', border: '1px solid var(--blue-b)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue)', marginBottom: 8 }}>管理画面入力ガイド</p>
        <ol style={{ fontSize: 11, color: 'var(--blue)', paddingLeft: 16, lineHeight: 2.2 }}>
          <li>スナックマップ管理画面にログイン</li>
          <li>「新規店舗追加」から店舗名・エリアを入力</li>
          <li>生成した店舗紹介文をコピー＆ペースト</li>
          <li>Driveから写真をダウンロードしてアップロード</li>
          <li>求人ページも同様に入力</li>
          <li>「下書き保存」して確認URLを控える</li>
        </ol>
      </div>
      <div>
        <button onClick={() => onStepComplete(10)}
          style={{ padding: '6px 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff' }}>
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

function Step15({ caseItem, onStepComplete }: Pick<Props, 'caseItem' | 'onStepComplete'>) {
  const [form, setForm] = usePersistedForm(`smo_case_${caseItem.id}_ig`, { area: caseItem.area || '', price_range: '', business_hours: '', features: '', atmosphere: '' })
  const [result, setResult] = useState('')
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
      setResult(data.output_text)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally { setLoading(false) }
  }

  const fields = [
    { key: 'area', label: 'エリア', placeholder: '難波' },
    { key: 'price_range', label: '料金目安', placeholder: 'チャージ1,000円〜' },
    { key: 'business_hours', label: '営業時間', placeholder: '20時〜翌2時' },
    { key: 'features', label: '特徴', placeholder: 'カラオケあり' },
    { key: 'atmosphere', label: '雰囲気', placeholder: 'アットホーム' },
  ] as const

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
      <button onClick={handleGenerate} disabled={loading}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 'var(--rs)', border: '1px solid var(--green-b)', background: 'var(--green)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ 生成中...' : '📸 プロンプト生成'}
      </button>
      {result && (
        <div>
          <pre style={{ fontSize: 12, color: 'var(--text)', background: 'var(--green-l)', border: '1px solid var(--green-b)', borderRadius: 'var(--rs)', padding: '12px 14px', whiteSpace: 'pre-wrap', lineHeight: 1.7, marginBottom: 8, fontFamily: 'inherit' }}>{result}</pre>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyButton text={result} label="プロンプトをコピー" onCopied={() => onStepComplete(15)} />
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
    case 10: return <Step10 onStepComplete={onStepComplete} />
    case 11: return <Step11 step={step} caseItem={caseItem} onStepComplete={onStepComplete} onUpdateCase={onUpdateCase} />
    case 12: return <Step12 onStepComplete={onStepComplete} />
    case 13: return <Step13 onStepComplete={onStepComplete} />
    case 14: return <Step14 caseItem={caseItem} onStepComplete={onStepComplete} />
    case 15: return <Step15 caseItem={caseItem} onStepComplete={onStepComplete} />
    default: return null
  }
}
