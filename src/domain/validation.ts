import type { MatchData, ValidationIssue, ValidationReport } from './types'

const issue = (code: string, message: string): ValidationIssue => ({ code, message })
const chineseLength = (value: string) => Array.from(value.trim()).length
const isDataAsset = (path: string) => path.startsWith('data:image/')

const collectIds = (match: MatchData) => [
  match.event.id,
  match.match.id,
  ...match.teams.map((team) => team.id),
  ...match.teams.flatMap((team) => team.debaters.map((debater) => debater.id)),
  ...match.judges.map((judge) => judge.id),
  ...match.segments.map((segment) => segment.id),
]

export const validateMatchData = (match: MatchData): ValidationReport => {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const allIds = collectIds(match)
  const seenIds = new Set<string>()
  const debaterIds = new Set(match.teams.flatMap((team) => team.debaters.map((debater) => debater.id)))
  const judgeIds = new Set(match.judges.map((judge) => judge.id))
  const teamIds = new Set(match.teams.map((team) => team.id))

  if (!match.event.title.trim()) {
    errors.push(issue('missing-event-title', '缺少活动标题。'))
  }

  if (!match.match.id.trim()) {
    errors.push(issue('missing-match-id', '缺少场次 ID。'))
  }

  if (!match.match.competitionId.trim()) {
    errors.push(issue('missing-competition-id', '缺少比赛编号。'))
  }

  if (!match.match.motion.trim()) {
    errors.push(issue('missing-motion', '缺少辩题。'))
  }

  if (match.teams.length !== 2) {
    errors.push(issue('invalid-team-count', '必须提供两个队伍。'))
  }

  if (!match.teams.some((team) => team.side === 'zheng')) {
    errors.push(issue('missing-zheng-side', '缺少正方队伍。'))
  }

  if (!match.teams.some((team) => team.side === 'fan')) {
    errors.push(issue('missing-fan-side', '缺少反方队伍。'))
  }

  for (const id of allIds) {
    if (!id.trim()) {
      errors.push(issue('empty-id', '存在空白 ID。'))
      continue
    }

    if (seenIds.has(id)) {
      errors.push(issue('duplicate-id', `重复 ID：${id}`))
    }

    seenIds.add(id)
  }

  for (const team of match.teams) {
    if (team.debaters.length !== 4) {
      errors.push(issue('invalid-debater-count', `${team.sideLabel} 必须有四位辩手。`))
    }

    if (!team.initials.trim()) {
      errors.push(issue('missing-team-initials', `${team.sideLabel} 缺少队伍标记。`))
    }

    if (chineseLength(team.universityName) > 16) {
      warnings.push(issue('long-university-name', `${team.sideLabel} 学校名称超过 16 个字。`))
    }

    if (chineseLength(team.displayName) > 16) {
      warnings.push(issue('long-team-name', `${team.sideLabel} 队名较长，可能需要检查版面。`))
    }

    for (const debater of team.debaters) {
      if (chineseLength(debater.displayName) > 8) {
        warnings.push(issue('long-debater-name', `${debater.displayName} 超过 8 个字。`))
      }

      if (chineseLength(debater.major) > 14) {
        warnings.push(issue('long-major', `${debater.displayName} 的专业超过 14 个字。`))
      }

      if (!debater.photoPath.trim()) {
        warnings.push(issue('missing-debater-photo', `${debater.displayName} 缺少照片。`))
      }

      if (isDataAsset(debater.photoPath)) {
        warnings.push(issue('mock-asset', `${debater.displayName} 使用内置占位图，正式彩排前应换成本地照片。`))
      }
    }
  }

  if (match.judges.length !== 4 && match.judges.length !== 5) {
    errors.push(issue('invalid-judge-count', '评审人数必须为四位或五位。'))
  }

  for (const judge of match.judges) {
    if (!judge.photoPath.trim()) {
      warnings.push(issue('missing-judge-photo', `${judge.displayName} 缺少照片。`))
    }

    if (isDataAsset(judge.photoPath)) {
      warnings.push(issue('mock-asset', `${judge.displayName} 使用内置占位图，正式彩排前应换成本地照片。`))
    }
  }

  if (chineseLength(match.match.motion) > 60) {
    warnings.push(issue('long-motion', '辩题超过 60 个字，总览页可能换行过多。'))
  }

  for (const segment of match.segments) {
    const speakerIds = segment.speakerDebaterIds ?? []

    if (segment.kind === 'single' && speakerIds.length !== 1) {
      errors.push(issue('invalid-single-speaker', `${segment.label} 必须指定一位辩手。`))
    }

    if (segment.kind === 'paired' && speakerIds.length !== 2) {
      errors.push(issue('invalid-paired-speaker', `${segment.label} 必须指定两位辩手。`))
    }

    for (const speakerId of speakerIds) {
      if (!debaterIds.has(speakerId)) {
        errors.push(issue('missing-speaker-reference', `${segment.label} 引用了不存在的辩手：${speakerId}`))
      }
    }
  }

  for (const vote of match.votes ?? []) {
    if (!judgeIds.has(vote.judgeId)) {
      errors.push(issue('invalid-vote-judge', `投票引用了不存在的评审：${vote.judgeId}`))
    }

    if (!teamIds.has(vote.teamId)) {
      errors.push(issue('invalid-vote-team', `投票引用了不存在的队伍：${vote.teamId}`))
    }
  }

  return { errors, warnings }
}
