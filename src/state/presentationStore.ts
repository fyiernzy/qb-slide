import { useSyncExternalStore } from 'react'
import { mockMatch } from '../domain/mockMatch'
import { buildRunOfShow } from '../domain/segments'
import type { MatchData, PresentationState, RunOfShowState } from '../domain/types'
import {
  createInitialPresentationState,
  normalizePresentationState,
  reducePresentationState,
  type PresentationAction,
} from './presentationReducer'

const CHANNEL_NAME = 'qb-slide-presentation'
const STORAGE_KEY = 'qb-slide-state-v1'
const listeners = new Set<() => void>()
const fallbackSlides = buildRunOfShow(mockMatch)

let currentMatch = mockMatch
let currentSlides = fallbackSlides
let snapshot = createInitialPresentationState(currentMatch, currentSlides)
let channel: BroadcastChannel | null = null
let initialized = false

const notify = () => {
  for (const listener of listeners) {
    listener()
  }
}

const readStoredState = (match: MatchData, slides: RunOfShowState[]) => {
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return createInitialPresentationState(match, slides)
  }

  try {
    return normalizePresentationState(match, slides, JSON.parse(stored)) ?? createInitialPresentationState(match, slides)
  } catch {
    return createInitialPresentationState(match, slides)
  }
}

const persistState = (state: PresentationState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  channel?.postMessage(state)
}

const setContext = (match: MatchData, slides: RunOfShowState[]) => {
  if (match === currentMatch && slides === currentSlides) {
    return
  }

  currentMatch = match
  currentSlides = slides
  snapshot = normalizePresentationState(currentMatch, currentSlides, snapshot) ?? createInitialPresentationState(match, slides)
}

const ensureInitialized = (match = currentMatch, slides = currentSlides) => {
  setContext(match, slides)

  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true
  snapshot = readStoredState(currentMatch, currentSlides)
  channel = new BroadcastChannel(CHANNEL_NAME)

  channel.onmessage = (event: MessageEvent<unknown>) => {
    const nextState = normalizePresentationState(currentMatch, currentSlides, event.data)

    if (!nextState || nextState.updatedAt < snapshot.updatedAt) {
      return
    }

    snapshot = nextState
    notify()
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return
    }

    try {
      const nextState = normalizePresentationState(currentMatch, currentSlides, JSON.parse(event.newValue))

      if (nextState) {
        snapshot = nextState
        notify()
      }
    } catch {
      return
    }
  })
}

const subscribe = (listener: () => void) => {
  ensureInitialized()
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const getPresentationSnapshot = () => {
  return snapshot
}

export const resetPresentationStateForMatch = (match: MatchData, slides: RunOfShowState[]) => {
  ensureInitialized(match, slides)
  snapshot = createInitialPresentationState(match, slides)
  persistState(snapshot)
  notify()
}

export const dispatchPresentationAction = (
  action: PresentationAction,
  match = currentMatch,
  slides = currentSlides,
) => {
  ensureInitialized(match, slides)
  snapshot = {
    ...reducePresentationState(currentMatch, currentSlides, snapshot, action),
    updatedAt: Date.now(),
  }
  persistState(snapshot)
  notify()
}

export const usePresentationStore = (match: MatchData, slides: RunOfShowState[]) => {
  ensureInitialized(match, slides)
  const state = useSyncExternalStore(subscribe, getPresentationSnapshot)
  const dispatch = (action: PresentationAction) => dispatchPresentationAction(action, match, slides)
  return [state, dispatch] as const
}
