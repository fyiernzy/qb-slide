import { describe, expect, it } from 'vitest'
import { mockMatch } from './mockMatch'
import type { MatchData } from './types'
import { validateMatchData } from './validation'

const cloneMatch = (): MatchData => structuredClone(mockMatch) as MatchData
const errorCodes = (match: MatchData) => validateMatchData(match).errors.map((issue) => issue.code)

describe('validateMatchData', () => {
  it('accepts the MVP mock data without critical errors', () => {
    expect(validateMatchData(mockMatch).errors).toEqual([])
  })

  it('reports required field and shape errors', () => {
    const match = cloneMatch()
    match.match.motion = ''
    match.match.competitionId = ''
    match.teams[0].initials = ''
    match.teams[0].debaters = match.teams[0].debaters.slice(0, 3) as MatchData['teams'][0]['debaters']
    match.judges = match.judges.slice(0, 3)

    expect(errorCodes(match)).toEqual(
      expect.arrayContaining([
        'missing-competition-id',
        'missing-motion',
        'missing-team-initials',
        'invalid-debater-count',
        'invalid-judge-count',
      ]),
    )
  })

  it('reports duplicate IDs and invalid vote references', () => {
    const match = cloneMatch()
    match.judges[1].id = match.judges[0].id
    match.votes = [{ judgeId: 'missing-judge', teamId: 'missing-team' }]

    expect(errorCodes(match)).toEqual(
      expect.arrayContaining(['duplicate-id', 'invalid-vote-judge', 'invalid-vote-team']),
    )
  })

  it('reports invalid segment speaker references', () => {
    const match = cloneMatch()
    match.segments[0].speakerDebaterIds = []
    match.segments[6].speakerDebaterIds = ['zheng-3']
    match.segments[7].speakerDebaterIds = ['missing-debater']

    expect(errorCodes(match)).toEqual(
      expect.arrayContaining([
        'invalid-single-speaker',
        'invalid-paired-speaker',
        'missing-speaker-reference',
      ]),
    )
  })
})
