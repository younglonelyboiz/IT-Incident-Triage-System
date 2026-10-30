import React, { useState } from 'react'
import { AlertCircle, Check, Copy } from 'lucide-react'

interface MissingInfoAlertProps {
  missingItems: string[]
  questionTemplate?: string
  className?: string
}

export const MissingInfoAlert: React.FC<MissingInfoAlertProps> = ({
  missingItems,
  questionTemplate,
  className = '',
}) => {
  const [copied, setCopied] = useState(false)

  if (!missingItems || missingItems.length === 0) return null

  const handleCopy = () => {
    if (!questionTemplate) return
    navigator.clipboard.writeText(questionTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="region"
      aria-label="Cảnh báo thiếu thông tin sự cố"
      className={`bg-amber-50/80 border border-amber-200 rounded-lg p-4 text-slate-800 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-amber-900">
            AI phát hiện thông tin sự cố chưa đầy đủ
          </h4>
          <p className="text-xs text-amber-800 mt-1">
            Để kỹ thuật viên chẩn đoán chính xác nguyên nhân gốc rễ, cần bổ sung:
          </p>
          <ul className="list-disc list-inside text-xs text-amber-900 mt-2 space-y-1 font-medium">
            {missingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          {questionTemplate && (
            <div className="mt-3 pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs text-slate-600 italic line-clamp-1">
                "{questionTemplate}"
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded cursor-pointer transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép câu hỏi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mẫu câu hỏi</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
