import { judges, toDebaterData, toJudgeData, universities } from './configLookups'
import { mockMatch } from './mockMatch'
import type { DebaterData, JudgeData, MatchData, SideId, TeamData } from './types'

export type MatchConfigSide = {
  universityId: string | null
  debaterIds: [string | null, string | null, string | null, string | null]
}

export type MatchConfigState = {
  version: 1
  sides: Record<SideId, MatchConfigSide>
  judgeIds: [string | null, string | null, string | null, string | null, string | null]
  updatedAt: number
}

const SIDE_IDS: [SideId, SideId] = ['zheng', 'fan']
const EMPTY_DEBATERS: MatchConfigSide['debaterIds'] = [null, null, null, null]
const universityById = new Map(universities.map((university) => [university.id, university]))
const judgeById = new Map(judges.map((judge) => [judge.id, judge]))

const firstFourDebaters = (universityIndex: number) =>
  universities[universityIndex].debaters.slice(0, 4).map((debater) => debater.id) as MatchConfigSide['debaterIds']

export const createDefaultMatchConfig = (): MatchConfigState => ({
  version: 1,
  sides: {
    zheng: {
      universityId: universities[0].id,
      debaterIds: firstFourDebaters(0),
    },
    fan: {
      universityId: universities[2].id,
      debaterIds: firstFourDebaters(2),
    },
  },
  judgeIds: judges.slice(0, 5).map((judgeItem) => judgeItem.id) as MatchConfigState['judgeIds'],
  updatedAt: Date.now(),
})

const normalizeSide = (rawSide: unknown): MatchConfigSide => {
  if (!rawSide || typeof rawSide !== 'object') {
    return { universityId: null, debaterIds: [...EMPTY_DEBATERS] }
  }

  const side = rawSide as Partial<MatchConfigSide>
  const universityId =
    typeof side.universityId === 'string' && universityById.has(side.universityId) ? side.universityId : null
  const university = universityId ? universityById.get(universityId) : null
  const validDebaterIds = new Set(university?.debaters.map((debaterItem) => debaterItem.id) ?? [])
  const seenDebaters = new Set<string>()
  const rawDebaters = Array.isArray(side.debaterIds) ? side.debaterIds : []
  const debaterIds = EMPTY_DEBATERS.map((_, index) => {
    const debaterId = rawDebaters[index]

    if (typeof debaterId !== 'string' || !validDebaterIds.has(debaterId) || seenDebaters.has(debaterId)) {
      return null
    }

    seenDebaters.add(debaterId)
    return debaterId
  }) as MatchConfigSide['debaterIds']

  return {
    universityId,
    debaterIds,
  }
}

export const normalizeMatchConfig = (rawState: unknown): MatchConfigState => {
  if (!rawState || typeof rawState !== 'object') {
    return createDefaultMatchConfig()
  }

  const raw = rawState as Partial<MatchConfigState>
  const normalized: MatchConfigState = {
    version: 1,
    sides: {
      zheng: normalizeSide(raw.sides?.zheng),
      fan: normalizeSide(raw.sides?.fan),
    },
    judgeIds: [null, null, null, null, null],
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
  }
  const seenUniversities = new Map<string, SideId>()

  for (const sideId of SIDE_IDS) {
    const universityId = normalized.sides[sideId].universityId

    if (!universityId) {
      continue
    }

    const previousSide = seenUniversities.get(universityId)

    if (previousSide) {
      normalized.sides[previousSide] = { universityId: null, debaterIds: [...EMPTY_DEBATERS] }
    }

    seenUniversities.set(universityId, sideId)
  }

  const seenJudges = new Set<string>()
  const rawJudgeIds = Array.isArray(raw.judgeIds) ? raw.judgeIds : []
  normalized.judgeIds = normalized.judgeIds.map((_, index) => {
    const judgeId = rawJudgeIds[index]

    if (typeof judgeId !== 'string' || !judgeById.has(judgeId) || seenJudges.has(judgeId)) {
      return null
    }

    seenJudges.add(judgeId)
    return judgeId
  }) as MatchConfigState['judgeIds']

  return normalized
}

export const isMatchConfigComplete = (config: MatchConfigState) =>
  SIDE_IDS.every((sideId) => Boolean(config.sides[sideId].universityId) && config.sides[sideId].debaterIds.every(Boolean)) &&
  config.judgeIds.every(Boolean)

const fallbackDebater = (side: SideId, index: number): DebaterData => ({
  id: `${side}-${index + 1}`,
  displayName: '未指定辩手',
  major: '资料缺失',
  photoPath: '',
})

const deriveTeam = (config: MatchConfigState, side: SideId): TeamData => {
  const sourceTeam = mockMatch.teams.find((team) => team.side === side) ?? mockMatch.teams[0]
  const sideConfig = config.sides[side]
  const university = sideConfig.universityId ? universityById.get(sideConfig.universityId) : null
  const lookupDebaters = new Map(university?.debaters.map((debaterItem) => [debaterItem.id, debaterItem]) ?? [])
  const debaters = sideConfig.debaterIds.map((debaterId, index) => {
    const lookup = debaterId ? lookupDebaters.get(debaterId) : null
    return lookup ? toDebaterData(lookup, `${side}-${index + 1}`) : fallbackDebater(side, index)
  }) as [DebaterData, DebaterData, DebaterData, DebaterData]

  return {
    ...sourceTeam,
    side,
    sideLabel: side === 'zheng' ? '正方' : '反方',
    universityName: university?.displayName ?? '未选择大学',
    initials: university?.initials ?? '--',
    logoPath: university?.logoPath,
    debaters,
  }
}

const fallbackJudge = (index: number): JudgeData => ({
  id: `judge-${index + 1}`,
  displayName: '未选择评审',
  photoPath: '',
})

export const deriveMatchData = (config: MatchConfigState): MatchData => ({
  ...mockMatch,
  teams: [deriveTeam(config, 'zheng'), deriveTeam(config, 'fan')],
  judges: config.judgeIds.map((judgeId, index) => {
    const lookup = judgeId ? judgeById.get(judgeId) : null
    return lookup ? toJudgeData(lookup, `judge-${index + 1}`) : fallbackJudge(index)
  }),
})
