export interface SimilarIncident {
  id: string
  ticketCode: string
  title: string
  resolution: string
  similarity: number
  resolvedAt: string
}

export interface RunbookStep {
  id: string
  instruction: string
  completed: boolean
}

export interface Runbook {
  id: string
  title: string
  description: string
  steps: RunbookStep[]
  sourceDoc: string
}

export interface DeflectionSolution {
  id: string
  title: string
  summary: string
  steps: string[]
  confidence: number
  kbArticleUrl?: string
}

export interface AITriageResult {
  suggestedPriority: 'P1' | 'P2' | 'P3' | 'P4'
  suggestedCategory: string
  confidence: number // 0 to 1
  impact: 'CAO' | 'TRUNG_BINH' | 'THAP'
  urgency: 'CAO' | 'TRUNG_BINH' | 'THAP'
  reasoning: string
  missingInformation: string[]
  questionTemplate?: string
  similarIncidents: SimilarIncident[]
  suggestedRunbook?: Runbook
}
