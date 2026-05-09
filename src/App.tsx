import { useMemo } from 'react'
import './App.css'
import { ControllerView } from './controller/ControllerView'
import { judges, universities } from './domain/configLookups'
import { deriveMatchData, isMatchConfigComplete, type MatchConfigState } from './domain/matchConfig'
import { buildRunOfShow, findSlideIndex } from './domain/segments'
import { validateMatchData } from './domain/validation'
import type { MatchData, PresentationState, RunOfShowState, SideId, ValidationReport } from './domain/types'
import { SlideStage } from './layout/SlideStage'
import { SlideRenderer } from './slides/SlideRenderer'
import type { MatchConfigAction } from './state/matchConfigReducer'
import { useMatchConfigStore } from './state/matchConfigStore'
import type { PresentationAction } from './state/presentationReducer'
import { usePresentationStore } from './state/presentationStore'

type ViewMode = 'launcher' | 'audience' | 'controller'
type PresentationDispatch = (action: PresentationAction) => void
type MatchConfigDispatch = (action: MatchConfigAction) => void

const slotLabels = ['一辩', '二辩', '三辩', '四辩']

function getViewMode(): ViewMode {
  const view = new URLSearchParams(window.location.search).get('view')

  if (view === 'audience' || view === 'controller') {
    return view
  }

  return 'launcher'
}

function App() {
  const mode = getViewMode()
  const [config, dispatchConfig] = useMatchConfigStore()
  const match = useMemo(() => deriveMatchData(config), [config])
  const slides = useMemo(() => buildRunOfShow(match), [match])
  const validation = useMemo(() => validateMatchData(match), [match])
  const configComplete = isMatchConfigComplete(config)
  const [state, dispatch] = usePresentationStore(match, slides)

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

  return (
    <LauncherView
      config={config}
      configComplete={configComplete}
      dispatch={dispatch}
      dispatchConfig={dispatchConfig}
      match={match}
      slides={slides}
      state={state}
      validation={validation}
    />
  )
}

type LauncherViewProps = {
  config: MatchConfigState
  configComplete: boolean
  match: MatchData
  slides: RunOfShowState[]
  state: PresentationState
  validation: ValidationReport
  dispatch: PresentationDispatch
  dispatchConfig: MatchConfigDispatch
}

function LauncherView({
  config,
  configComplete,
  dispatch,
  dispatchConfig,
  match,
  slides,
  state,
  validation,
}: LauncherViewProps) {
  const currentIndex = Math.max(findSlideIndex(slides, state.currentSlideId), 0)
  const canStart = validation.errors.length === 0 && configComplete

  const startPresentation = () => {
    dispatch({ type: 'start-presentation' })
    const baseUrl = `${window.location.origin}${window.location.pathname}`

    window.open(`${baseUrl}?view=audience`, 'qb-slide-audience', 'popup,width=1280,height=720')
    window.open(`${baseUrl}?view=controller`, 'qb-slide-controller', 'popup,width=1320,height=860')
  }

  return (
    <main className="launcher-shell">
      <aside className="launcher-summary">
        <section className="launcher-copy">
          <p className="ui-eyebrow">{match.match.competitionId}</p>
          <h1>{match.event.title}</h1>
          <p>{match.match.motion}</p>
          <div className={`launcher-status ${canStart ? '' : 'has-errors'}`}>
            <strong>{canStart ? '资料可彩排' : '资料未完整'}</strong>
            <span>
              {validation.errors.length} 项错误 · {validation.warnings.length} 项提醒 · 当前 {currentIndex + 1}/{slides.length}
            </span>
          </div>
          <div className="launcher-actions">
            <button disabled={!canStart} type="button" onClick={startPresentation}>
              开始演示
            </button>
            <button type="button" onClick={() => dispatch({ type: 'reset-all' })}>
              重置状态
            </button>
            <button disabled={state.configurationLocked} type="button" onClick={() => dispatchConfig({ type: 'reset-config' })}>
              重置配置
            </button>
          </div>
        </section>
        <section className="launcher-preview" aria-label="当前观众画面预览">
          <SlideStage compact>
            <SlideRenderer match={match} slides={slides} state={state} />
          </SlideStage>
        </section>
      </aside>

      <MatchConfigPane config={config} dispatchConfig={dispatchConfig} locked={state.configurationLocked} />
    </main>
  )
}

type MatchConfigPaneProps = {
  config: MatchConfigState
  locked: boolean
  dispatchConfig: MatchConfigDispatch
}

function MatchConfigPane({ config, dispatchConfig, locked }: MatchConfigPaneProps) {
  return (
    <section className="match-config-pane" aria-label="赛前资料配置">
      <div className="config-pane-header">
        <div>
          <p className="ui-eyebrow">赛前配置</p>
          <h2>大学、辩手顺序与评审</h2>
        </div>
        <span>{locked ? '演示已开始，重置状态后可编辑' : '编辑会重置当前演示状态'}</span>
      </div>

      <div className="team-config-grid">
        <SideConfig config={config} dispatchConfig={dispatchConfig} locked={locked} side="zheng" />
        <SideConfig config={config} dispatchConfig={dispatchConfig} locked={locked} side="fan" />
      </div>

      <JudgeConfig config={config} dispatchConfig={dispatchConfig} locked={locked} />
    </section>
  )
}

type SideConfigProps = MatchConfigPaneProps & {
  side: SideId
}

function SideConfig({ config, dispatchConfig, locked, side }: SideConfigProps) {
  const sideConfig = config.sides[side]
  const selectedUniversity = universities.find((university) => university.id === sideConfig.universityId) ?? null
  const selectedCount = sideConfig.debaterIds.filter(Boolean).length
  const sideLabel = side === 'zheng' ? '正方' : '反方'

  return (
    <section className={`side-config ${side}`} aria-label={`${sideLabel}配置`}>
      <header>
        <div>
          <p>{sideLabel}</p>
          <h3>大学与辩手顺序</h3>
        </div>
        <span>{selectedCount}/4 已选</span>
      </header>

      <label>
        <span>大学</span>
        <select
          disabled={locked}
          value={sideConfig.universityId ?? ''}
          onChange={(event) =>
            dispatchConfig({
              type: 'select-university',
              side,
              universityId: event.target.value || null,
            })
          }
        >
          <option value="">请选择大学</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.displayName} {university.initials}
            </option>
          ))}
        </select>
      </label>

      <div className="debater-order-grid">
        {slotLabels.map((slotLabel, index) => (
          <label key={slotLabel}>
            <span>{slotLabel}</span>
            <select
              disabled={locked || !selectedUniversity}
              value={sideConfig.debaterIds[index] ?? ''}
              onChange={(event) =>
                dispatchConfig({
                  type: 'assign-debater',
                  side,
                  slotIndex: index,
                  debaterId: event.target.value || null,
                })
              }
            >
              <option value="">请选择辩手</option>
              {selectedUniversity?.debaters.map((debater) => (
                <option key={debater.id} value={debater.id}>
                  {debater.displayName} - {debater.major}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  )
}

function JudgeConfig({ config, dispatchConfig, locked }: MatchConfigPaneProps) {
  return (
    <section className="judge-config" aria-label="评审配置">
      <header>
        <div>
          <p>评审</p>
          <h3>从 7 位名单中启用 5 位</h3>
        </div>
        <span>{config.judgeIds.filter(Boolean).length}/5 已选</span>
      </header>

      <div className="judge-select-grid">
        {config.judgeIds.map((selectedJudgeId, index) => {
          const selectedElsewhere = new Set(
            config.judgeIds.filter((judgeId, judgeIndex) => judgeIndex !== index && judgeId),
          )

          return (
            <label key={`judge-${index + 1}`}>
              <span>评审 {index + 1}</span>
              <select
                disabled={locked}
                value={selectedJudgeId ?? ''}
                onChange={(event) =>
                  dispatchConfig({
                    type: 'select-judge',
                    slotIndex: index,
                    judgeId: event.target.value || null,
                  })
                }
              >
                <option value="">请选择评审</option>
                {judges
                  .filter((judge) => !selectedElsewhere.has(judge.id))
                  .map((judge) => (
                    <option key={judge.id} value={judge.id}>
                      {judge.displayName}
                    </option>
                  ))}
              </select>
            </label>
          )
        })}
      </div>
    </section>
  )
}

export default App
