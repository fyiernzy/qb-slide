import { getNextSlideId, getPreviousSlideId } from '../domain/segments'
import type { MatchData, PresentationState, RunOfShowState, SideId, VotesByJudge } from '../domain/types'

export type PresentationAction =
  | { type: 'go-to-slide'; slideId: string }
  | { type: 'next-slide' }
  | { type: 'previous-slide' }
  | { type: 'start-presentation' }
  | { type: 'reveal-vote'; judgeId: string; side: SideId }
  | { type: 'clear-vote'; judgeId: string }
  | { type: 'reset-votes' }
  | { type: 'reset-all' }

export const createEmptyVotes = (match: MatchData): VotesByJudge =>
  Object.fromEntries(match.judges.map((judge) => [judge.id, null]))

export const createInitialPresentationState = (
  match: MatchData,
  slides: RunOfShowState[],
): PresentationState => ({
  currentSlideId: slides[0]?.id ?? 'general',
  votes: createEmptyVotes(match),
  changedJudgeId: null,
  resultRevealed: false,
  configurationLocked: false,
  updatedAt: Date.now(),
  version: 1,
})

const normalizeSlideId = (slides: RunOfShowState[], slideId: string) =>
  slides.some((slide) => slide.id === slideId) ? slideId : slides[0]?.id ?? 'general'

export const normalizeVotes = (match: MatchData, votes: unknown): VotesByJudge => {
  const normalizedVotes = createEmptyVotes(match)
  const sides = new Set<SideId>(['zheng', 'fan'])

  if (!votes || typeof votes !== 'object') {
    return normalizedVotes
  }

  for (const judge of match.judges) {
    const vote = (votes as Record<string, unknown>)[judge.id]
    normalizedVotes[judge.id] = typeof vote === 'string' && sides.has(vote as SideId) ? (vote as SideId) : null
  }

  return normalizedVotes
}

export const normalizePresentationState = (
  match: MatchData,
  slides: RunOfShowState[],
  state: unknown,
): PresentationState | null => {
  if (!state || typeof state !== 'object') {
    return null
  }

  const rawState = state as Partial<PresentationState>
  const judgeIds = new Set(match.judges.map((judge) => judge.id))
  const changedJudgeId =
    typeof rawState.changedJudgeId === 'string' && judgeIds.has(rawState.changedJudgeId)
      ? rawState.changedJudgeId
      : null

  return {
    currentSlideId:
      typeof rawState.currentSlideId === 'string'
        ? normalizeSlideId(slides, rawState.currentSlideId)
        : slides[0]?.id ?? 'general',
    votes: normalizeVotes(match, rawState.votes),
    changedJudgeId,
    resultRevealed: Boolean(rawState.resultRevealed),
    configurationLocked: Boolean(rawState.configurationLocked),
    updatedAt: typeof rawState.updatedAt === 'number' ? rawState.updatedAt : Date.now(),
    version: 1,
  }
}

export const reducePresentationState = (
  match: MatchData,
  slides: RunOfShowState[],
  state: PresentationState,
  action: PresentationAction,
): PresentationState => {
  if (action.type === 'reset-all') {
    return createInitialPresentationState(match, slides)
  }

  if (action.type === 'start-presentation') {
    return {
      ...state,
      configurationLocked: true,
    }
  }

  if (action.type === 'reset-votes') {
    return {
      ...state,
      votes: createEmptyVotes(match),
      changedJudgeId: null,
      resultRevealed: false,
    }
  }

  if (action.type === 'go-to-slide') {
    return {
      ...state,
      currentSlideId: normalizeSlideId(slides, action.slideId),
      resultRevealed: action.slideId === 'result',
    }
  }

  if (action.type === 'next-slide') {
    const nextSlideId = getNextSlideId(slides, state.currentSlideId)

    return {
      ...state,
      currentSlideId: nextSlideId,
      resultRevealed: nextSlideId === 'result',
    }
  }

  if (action.type === 'previous-slide') {
    const previousSlideId = getPreviousSlideId(slides, state.currentSlideId)

    return {
      ...state,
      currentSlideId: previousSlideId,
      resultRevealed: previousSlideId === 'result',
    }
  }

  if (action.type === 'reveal-vote') {
    return {
      ...state,
      changedJudgeId: action.judgeId,
      votes: {
        ...state.votes,
        [action.judgeId]: action.side,
      },
    }
  }

  if (action.type === 'clear-vote') {
    return {
      ...state,
      changedJudgeId: action.judgeId,
      votes: {
        ...state.votes,
        [action.judgeId]: null,
      },
      resultRevealed: false,
    }
  }

  return state
}
