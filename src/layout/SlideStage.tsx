import type { ReactNode } from 'react'

type SlideStageProps = {
  children: ReactNode
  compact?: boolean
}

export function SlideStage({ children, compact = false }: SlideStageProps) {
  return <div className={compact ? 'slide-stage compact' : 'slide-stage'}>{children}</div>
}
