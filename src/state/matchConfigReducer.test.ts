import { describe, expect, it } from 'vitest'
import { createDefaultMatchConfig } from '../domain/matchConfig'
import { reduceMatchConfig } from './matchConfigReducer'

describe('reduceMatchConfig', () => {
  it('clears the previous side when a university is selected twice', () => {
    const state = createDefaultMatchConfig()
    const nextState = reduceMatchConfig(state, { type: 'select-university', side: 'fan', universityId: 'um' })

    expect(nextState.sides.zheng).toEqual({
      universityId: null,
      debaterIds: [null, null, null, null],
    })
    expect(nextState.sides.fan).toEqual({
      universityId: 'um',
      debaterIds: [null, null, null, null],
    })
  })

  it('clears the previous debater slot when a debater is assigned twice on a side', () => {
    const state = createDefaultMatchConfig()
    const nextState = reduceMatchConfig(state, {
      type: 'assign-debater',
      side: 'zheng',
      slotIndex: 1,
      debaterId: 'um-chen-zihan',
    })

    expect(nextState.sides.zheng.debaterIds).toEqual([null, 'um-chen-zihan', 'um-huang-junjie', 'um-wu-shimin'])
  })

  it('does not move a judge that is already selected in another slot', () => {
    const state = createDefaultMatchConfig()
    const nextState = reduceMatchConfig(state, {
      type: 'select-judge',
      slotIndex: 1,
      judgeId: 'judge-wang',
    })

    expect(nextState).toBe(state)
  })
})
