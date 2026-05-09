import { describe, expect, it } from 'vitest'
import { judges, universities } from './configLookups'
import {
  createDefaultMatchConfig,
  deriveMatchData,
  normalizeMatchConfig,
  type MatchConfigState,
} from './matchConfig'
import { validateMatchData } from './validation'

describe('match config derivation', () => {
  it('derives valid match data from default config', () => {
    const config = createDefaultMatchConfig()
    const match = deriveMatchData(config)

    expect(validateMatchData(match).errors).toEqual([])
    expect(match.teams[0].debaters.map((debater) => debater.id)).toEqual(['zheng-1', 'zheng-2', 'zheng-3', 'zheng-4'])
    expect(match.teams[1].debaters.map((debater) => debater.id)).toEqual(['fan-1', 'fan-2', 'fan-3', 'fan-4'])
    expect(match.judges.map((judge) => judge.id)).toEqual(['judge-1', 'judge-2', 'judge-3', 'judge-4', 'judge-5'])
  })

  it('normalizes invalid, stale, and duplicated stored values', () => {
    const normalized = normalizeMatchConfig({
      version: 1,
      sides: {
        zheng: {
          universityId: 'um',
          debaterIds: ['um-chen-zihan', 'um-chen-zihan', 'missing', 'um-wu-shimin'],
        },
        fan: {
          universityId: 'um',
          debaterIds: ['um-lin-jiayi', 'um-huang-junjie', 'um-wu-shimin', 'um-liang-yuxuan'],
        },
      },
      judgeIds: ['judge-wang', 'judge-wang', 'missing', 'judge-cai', 'judge-yang'],
      updatedAt: 42,
    })

    expect(normalized.sides.zheng).toEqual({
      universityId: null,
      debaterIds: [null, null, null, null],
    })
    expect(normalized.sides.fan.universityId).toBe('um')
    expect(normalized.judgeIds).toEqual(['judge-wang', null, null, 'judge-cai', 'judge-yang'])
    expect(normalized.updatedAt).toBe(42)
  })

  it('derives exactly five unique active judges', () => {
    const config: MatchConfigState = {
      ...createDefaultMatchConfig(),
      judgeIds: judges.slice(1, 6).map((judge) => judge.id) as MatchConfigState['judgeIds'],
    }
    const match = deriveMatchData(config)

    expect(match.judges).toHaveLength(5)
    expect(new Set(match.judges.map((judge) => judge.id)).size).toBe(5)
  })

  it('can derive a complete match from a different university pairing', () => {
    const config = createDefaultMatchConfig()
    config.sides.zheng = {
      universityId: 'ukm',
      debaterIds: universities[1].debaters.slice(0, 4).map((debater) => debater.id) as MatchConfigState['sides']['zheng']['debaterIds'],
    }
    config.sides.fan = {
      universityId: 'usm',
      debaterIds: universities[3].debaters.slice(0, 4).map((debater) => debater.id) as MatchConfigState['sides']['fan']['debaterIds'],
    }

    const match = deriveMatchData(config)

    expect(match.teams[0].universityName).toBe('国民大学')
    expect(match.teams[1].universityName).toBe('理科大学')
    expect(validateMatchData(match).errors).toEqual([])
  })
})
