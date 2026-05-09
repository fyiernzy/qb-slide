import './App.css'
import { ControllerView } from './controller/ControllerView'
import { mockMatch } from './domain/mockMatch'
import { buildRunOfShow, findSlideIndex } from './domain/segments'
import { validateMatchData } from './domain/validation'
import { SlideStage } from './layout/SlideStage'
import { SlideRenderer } from './slides/SlideRenderer'
import { usePresentationStore } from './state/presentationStore'

type ViewMode = 'launcher' | 'audience' | 'controller'

const match = mockMatch
const slides = buildRunOfShow(match)
const validation = validateMatchData(match)

function getViewMode(): ViewMode {
  const view = new URLSearchParams(window.location.search).get('view')

  if (view === 'audience' || view === 'controller') {
    return view
  }

  return 'launcher'
}

function App() {
  const mode = getViewMode()
  const [state, dispatch] = usePresentationStore()

  if (mode === 'audience') {
    return (
      <main className="audience-shell">
        <SlideStage>
          <SlideRenderer match={match} slides={slides} state={state} />
        </SlideStage>
      </main>
    )
  }

  if (mode === 'controller') {
    return <ControllerView dispatch={dispatch} match={match} slides={slides} state={state} validation={validation} />
  }

  return <LauncherView dispatch={dispatch} state={state} />
}

type LauncherViewProps = {
  state: ReturnType<typeof usePresentationStore>[0]
  dispatch: ReturnType<typeof usePresentationStore>[1]
}

function LauncherView({ state, dispatch }: LauncherViewProps) {
  const currentIndex = findSlideIndex(slides, state.currentSlideId)
  const canStart = validation.errors.length === 0

  const startPresentation = () => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`

    window.open(`${baseUrl}?view=audience`, 'qb-slide-audience', 'popup,width=1280,height=720')
    window.open(`${baseUrl}?view=controller`, 'qb-slide-controller', 'popup,width=1320,height=860')
  }

  return (
    <main className="launcher-shell">
      <section className="launcher-copy">
        <p className="ui-eyebrow">{match.match.competitionId}</p>
        <h1>{match.event.title}</h1>
        <p>{match.match.motion}</p>
        <div className="launcher-status">
          <strong>{canStart ? '资料可彩排' : '资料有错误'}</strong>
          <span>{validation.errors.length} 项错误 · {validation.warnings.length} 项提醒 · 当前 {currentIndex + 1}/{slides.length}</span>
        </div>
        <div className="launcher-actions">
          <button disabled={!canStart} type="button" onClick={startPresentation}>
            开始演示
          </button>
          <button type="button" onClick={() => dispatch({ type: 'reset-all' })}>
            重置状态
          </button>
        </div>
      </section>
      <section className="launcher-preview" aria-label="当前观众画面预览">
        <SlideStage compact>
          <SlideRenderer match={match} slides={slides} state={state} />
        </SlideStage>
      </section>
    </main>
  )
}

export default App
