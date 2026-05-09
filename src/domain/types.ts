export type SideId = 'zheng' | 'fan'
export type SideLabel = '正方' | '反方'
export type SegmentKind = 'single' | 'paired' | 'free'

export type EventInfo = {
  id: string
  title: '第二十届全国大专辩论会'
  subtitle?: string
  season?: string
}

export type MatchInfo = {
  id: string
  competitionId: string
  round: string
  room?: string
  date?: string
  motion: string
}

export type DebaterData = {
  id: string
  displayName: string
  major: string
  photoPath: string
}

export type TeamData = {
  id: string
  side: SideId
  sideLabel: SideLabel
  displayName: string
  universityName: string
  initials: string
  logoPath?: string
  debaters: [DebaterData, DebaterData, DebaterData, DebaterData]
}

export type JudgeData = {
  id: string
  displayName: string
  photoPath: string
}

export type DebateSegment = {
  id: string
  label: string
  kind: SegmentKind
  side?: SideId | 'both' | 'neutral'
  speakerDebaterIds?: string[]
  showMotion?: boolean
  durationSeconds?: number
}

export type JudgeVote = {
  judgeId: string
  teamId: string
}

export type MatchData = {
  event: EventInfo
  match: MatchInfo
  teams: [TeamData, TeamData]
  judges: JudgeData[]
  segments: DebateSegment[]
  votes?: JudgeVote[]
}

export type StaticSlideKind = 'general' | 'team' | 'judges' | 'vote-reveal' | 'result'
export type SlideKind = StaticSlideKind | 'session'

export type RunOfShowState =
  | {
      id: 'general' | 'judges' | 'vote-reveal' | 'result'
      kind: Exclude<StaticSlideKind, 'team'>
      label: string
    }
  | {
      id: 'team-zheng' | 'team-fan'
      kind: 'team'
      label: string
      side: SideId
    }
  | {
      id: string
      kind: 'session'
      label: string
      segmentId: string
    }

export type VoteValue = SideId | null
export type VotesByJudge = Record<string, VoteValue>

export type PresentationState = {
  currentSlideId: string
  votes: VotesByJudge
  changedJudgeId: string | null
  resultRevealed: boolean
  configurationLocked: boolean
  updatedAt: number
  version: 1
}

export type ValidationIssue = {
  code: string
  message: string
}

export type ValidationReport = {
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

export type ResultSummary = {
  zhengVotes: number
  fanVotes: number
  score: string
  winnerSide: SideId | null
  resultWord: '胜' | '和' | '未完整'
  isComplete: boolean
  headline: string
}
