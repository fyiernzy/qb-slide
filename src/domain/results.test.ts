import { describe, expect, it } from 'vitest'
import { mockMatch } from './mockMatch'
import { calculateResult } from './results'
import type { MatchData, SideId, VotesByJudge } from './types'

const cloneMatch = (): MatchData => structuredClone(mockMatch) as MatchData

const votesFor = (match: MatchData, sides: SideId[]): VotesByJudge =>
  Object.fromEntries(match.judges.map((judge, index) => [judge.id, sides[index] ?? null]))

describe('calculateResult', () => {
  it('returns a five-judge zheng win', () => {
    const result = calculateResult(mockMatch, votesFor(mockMatch, ['zheng', 'zheng', 'zheng', 'fan', 'fan']))

    expect(result.winnerSide).toBe('zheng')
    expect(result.headline).toBe('正方 胜 3:2')
  })

  it('returns a five-judge fan win', () => {
    const result = calculateResult(mockMatch, votesFor(mockMatch, ['fan', 'fan', 'fan', 'zheng', 'zheng']))

    expect(result.winnerSide).toBe('fan')
    expect(result.headline).toBe('反方 胜 2:3')
  })

  it('returns a four-judge 2:2 tie', () => {
    const match = cloneMatch()
    match.judges = match.judges.slice(0, 4)
    const result = calculateResult(match, votesFor(match, ['zheng', 'zheng', 'fan', 'fan']))

    expect(result.winnerSide).toBeNull()
    expect(result.resultWord).toBe('和')
    expect(result.headline).toBe('和 2:2')
  })
})
