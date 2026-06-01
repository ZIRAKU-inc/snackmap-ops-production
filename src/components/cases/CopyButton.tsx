'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  onCopied?: () => void
}

export default function CopyButton({ text, label = 'コピー', onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    onCopied?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      {copied ? '✓ コピー済み' : label}
    </button>
  )
}
