import { useSyncExternalStore } from 'react'
import { mockMatch } from '../domain/mockMatch'
import { buildRunOfShow } from '../domain/segments'
import type { PresentationState } from '../domain/types'
import {
  createInitialPresentationState,
  normalizePresentationState,
  reducePresentationState,
  type PresentationAction,
} from './presentationReducer'

const CHANNEL_NAME = 'qb-slide-presentation'
const STORAGE_KEY = 'qb-slide-state-v1'
const slides = buildRunOfShow(mockMatch)
const listeners = new Set<() => void>()

let snapshot = createInitialPresentationState(mockMatch, slides)
let channel: BroadcastChannel | null = null
let initialized = false

const notify = () => {
  for (const listener of listeners) {
    listener()
  }
}

const readStoredState = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return createInitialPresentationState(mockMatch, slides)
  }

  try {
    return normalizePresentationState(mockMatch, slides, JSON.parse(stored)) ?? createInitialPresentationState(mockMatch, slides)
  } catch {
    return createInitialPresentationState(mockMatch, slides)
  }
}

const persistState = (state: PresentationState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  channel?.postMessage(state)
}

const ensureInitialized = () => {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true
  snapshot = readStoredState()
  channel = new BroadcastChannel(CHANNEL_NAME)

  channel.onmessage = (event: MessageEvent<unknown>) => {
    const nextState = normalizePresentationState(mockMatch, slides, event.data)

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
      const nextState = normalizePresentationState(mockMatch, slides, JSON.parse(event.newValue))

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

const getSnapshot = () => {
  ensureInitialized()
  return snapshot
}

export const dispatchPresentationAction = (action: PresentationAction) => {
  ensureInitialized()
  snapshot = {
    ...reducePresentationState(mockMatch, slides, snapshot, action),
    updatedAt: Date.now(),
  }
  persistState(snapshot)
  notify()
}

export const usePresentationStore = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot)
  return [state, dispatchPresentationAction] as const
}
