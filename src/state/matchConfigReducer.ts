import type { MatchConfigState, MatchConfigSide } from '../domain/matchConfig'
import type { SideId } from '../domain/types'
import { createDefaultMatchConfig } from '../domain/matchConfig'

export type MatchConfigAction =
  | { type: 'select-university'; side: SideId; universityId: string | null }
  | { type: 'assign-debater'; side: SideId; slotIndex: number; debaterId: string | null }
  | { type: 'select-judge'; slotIndex: number; judgeId: string | null }
  | { type: 'reset-config' }

const SIDE_IDS: [SideId, SideId] = ['zheng', 'fan']
const EMPTY_DEBATERS: MatchConfigSide['debaterIds'] = [null, null, null, null]

const withUpdatedAt = (state: MatchConfigState): MatchConfigState => ({
  ...state,
  updatedAt: Date.now(),
})

export const reduceMatchConfig = (state: MatchConfigState, action: MatchConfigAction): MatchConfigState => {
  if (action.type === 'reset-config') {
    return createDefaultMatchConfig()
  }

  if (action.type === 'select-university') {
    const next: MatchConfigState = {
      ...state,
      sides: {
        zheng: { ...state.sides.zheng, debaterIds: [...state.sides.zheng.debaterIds] },
        fan: { ...state.sides.fan, debaterIds: [...state.sides.fan.debaterIds] },
      },
    }

    for (const sideId of SIDE_IDS) {
      if (sideId !== action.side && action.universityId && next.sides[sideId].universityId === action.universityId) {
        next.sides[sideId] = { universityId: null, debaterIds: [...EMPTY_DEBATERS] }
      }
    }

    next.sides[action.side] = {
      universityId: action.universityId,
      debaterIds: [...EMPTY_DEBATERS],
    }

    return withUpdatedAt(next)
  }

  if (action.type === 'assign-debater') {
    if (action.slotIndex < 0 || action.slotIndex > 3) {
      return state
    }

    const debaterIds = [...state.sides[action.side].debaterIds] as MatchConfigSide['debaterIds']

    if (action.debaterId) {
      const existingIndex = debaterIds.findIndex((debaterId) => debaterId === action.debaterId)

      if (existingIndex >= 0 && existingIndex !== action.slotIndex) {
        debaterIds[existingIndex] = null
      }
    }

    debaterIds[action.slotIndex] = action.debaterId

    return withUpdatedAt({
      ...state,
      sides: {
        ...state.sides,
        [action.side]: {
          ...state.sides[action.side],
          debaterIds,
        },
      },
    })
  }

  if (action.type === 'select-judge') {
    if (action.slotIndex < 0 || action.slotIndex > 4) {
      return state
    }

    if (
      action.judgeId &&
      state.judgeIds.some((judgeId, index) => judgeId === action.judgeId && index !== action.slotIndex)
    ) {
      return state
    }

    const judgeIds = [...state.judgeIds] as MatchConfigState['judgeIds']
    judgeIds[action.slotIndex] = action.judgeId

    return withUpdatedAt({
      ...state,
      judgeIds,
    })
  }

  return state
}
