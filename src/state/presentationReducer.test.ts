import { describe, expect, it } from 'vitest'
import { mockMatch } from '../domain/mockMatch'
import { buildRunOfShow } from '../domain/segments'
import { createInitialPresentationState, normalizePresentationState, reducePresentationState } from './presentationReducer'

const slides = buildRunOfShow(mockMatch)

describe('reducePresentationState', () => {
  it('locks configuration when presentation starts', () => {
    const state = createInitialPresentationState(mockMatch, slides)
    const nextState = reducePresentationState(mockMatch, slides, state, { type: 'start-presentation' })

    expect(nextState.configurationLocked).toBe(true)
  })

  it('unlocks configuration when all presentation state is reset', () => {
    const state = {
      ...createInitialPresentationState(mockMatch, slides),
      currentSlideId: 'result',
      configurationLocked: true,
    }
    const nextState = reducePresentationState(mockMatch, slides, state, { type: 'reset-all' })

    expect(nextState.configurationLocked).toBe(false)
    expect(nextState.currentSlideId).toBe('general')
  })

  it('normalization returns equivalent values for already-valid state', () => {
    const state = createInitialPresentationState(mockMatch, slides)
    const normalized = normalizePresentationState(mockMatch, slides, state)

    expect(normalized).toEqual(state)
  })
})
