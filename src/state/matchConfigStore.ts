import { useSyncExternalStore } from 'react'
import { buildRunOfShow } from '../domain/segments'
import {
  createDefaultMatchConfig,
  deriveMatchData,
  normalizeMatchConfig,
  type MatchConfigState,
} from '../domain/matchConfig'
import {
  getPresentationSnapshot,
  resetPresentationStateForMatch,
} from './presentationStore'
import { reduceMatchConfig, type MatchConfigAction } from './matchConfigReducer'

const CHANNEL_NAME = 'qb-slide-match-config'
const STORAGE_KEY = 'qb-slide-match-config-v1'
const listeners = new Set<() => void>()

let snapshot = createDefaultMatchConfig()
let channel: BroadcastChannel | null = null
let initialized = false

const notify = () => {
  for (const listener of listeners) {
    listener()
  }
}

const readStoredConfig = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return createDefaultMatchConfig()
  }

  try {
    return normalizeMatchConfig(JSON.parse(stored))
  } catch {
    return createDefaultMatchConfig()
  }
}

const persistConfig = (state: MatchConfigState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  channel?.postMessage(state)
}

const resetPresentationForConfig = (config: MatchConfigState) => {
  const match = deriveMatchData(config)
  resetPresentationStateForMatch(match, buildRunOfShow(match))
}

const ensureInitialized = () => {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true
  snapshot = readStoredConfig()
  channel = new BroadcastChannel(CHANNEL_NAME)

  channel.onmessage = (event: MessageEvent<unknown>) => {
    const nextState = normalizeMatchConfig(event.data)

    if (nextState.updatedAt < snapshot.updatedAt) {
      return
    }

    snapshot = nextState
    resetPresentationForConfig(snapshot)
    notify()
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return
    }

    try {
      const nextState = normalizeMatchConfig(JSON.parse(event.newValue))

      snapshot = nextState
      resetPresentationForConfig(snapshot)
      notify()
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

export const dispatchMatchConfigAction = (action: MatchConfigAction) => {
  ensureInitialized()

  if (getPresentationSnapshot().configurationLocked) {
    return
  }

  const nextState = reduceMatchConfig(snapshot, action)

  if (nextState === snapshot) {
    return
  }

  snapshot = nextState
  persistConfig(snapshot)
  resetPresentationForConfig(snapshot)
  notify()
}

export const useMatchConfigStore = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot)
  return [state, dispatchMatchConfigAction] as const
}
