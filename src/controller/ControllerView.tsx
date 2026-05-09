import { useEffect } from 'react'
import { calculateResult } from '../domain/results'
import { findSlideIndex } from '../domain/segments'
import type { MatchData, PresentationState, RunOfShowState, SideId, ValidationReport } from '../domain/types'
import { SlideStage } from '../layout/SlideStage'
import { SlideRenderer } from '../slides/SlideRenderer'
import type { PresentationAction } from '../state/presentationReducer'

type ControllerViewProps = {
  match: MatchData
  slides: RunOfShowState[]
  state: PresentationState
  validation: ValidationReport
  dispatch: (action: PresentationAction) => void
}

export function ControllerView({ match, slides, state, validation, dispatch }: ControllerViewProps) {
  const currentIndex = findSlideIndex(slides, state.currentSlideId)
  const result = calculateResult(match, state.votes)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        dispatch({ type: 'previous-slide' })
      }

      if (event.key === 'ArrowRight') {
        dispatch({ type: 'next-slide' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return (
    <main className="controller-shell">
      <section className="controller-preview" aria-label="观众画面预览">
        <SlideStage compact>
          <SlideRenderer match={match} slides={slides} state={state} />
        </SlideStage>
      </section>

      <aside className="controller-panel" aria-label="控制台">
        <section className="controller-section">
          <p className="ui-eyebrow">控制台</p>
          <h1>{match.match.competitionId}</h1>
          <span>{slides[currentIndex]?.label ?? '总览'} · {currentIndex + 1}/{slides.length}</span>
        </section>

        <ValidationSummary validation={validation} />

        <section className="controller-section nav-controls" aria-label="流程控制">
          <button type="button" onClick={() => dispatch({ type: 'previous-slide' })}>
            上一页
          </button>
          <button type="button" onClick={() => dispatch({ type: 'next-slide' })}>
            下一页
          </button>
        </section>

        <section className="controller-section jump-list" aria-label="跳转列表">
          <h2>跳转</h2>
          <div>
            {slides.map((slide) => (
              <button
                className={slide.id === state.currentSlideId ? 'active' : ''}
                key={slide.id}
                type="button"
                onClick={() => dispatch({ type: 'go-to-slide', slideId: slide.id })}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </section>

        <VoteControls match={match} state={state} dispatch={dispatch} />

        <section className="controller-section result-status">
          <h2>结果状态</h2>
          <strong>{result.headline}</strong>
          <span>{result.isComplete ? '投票已完整' : '仍有评审未选择'}</span>
        </section>
      </aside>
    </main>
  )
}

function ValidationSummary({ validation }: { validation: ValidationReport }) {
  const hasErrors = validation.errors.length > 0
  const hasWarnings = validation.warnings.length > 0

  return (
    <section className={`controller-section validation-summary ${hasErrors ? 'has-errors' : ''}`}>
      <h2>资料检查</h2>
      <strong>{hasErrors ? `${validation.errors.length} 项错误` : '可彩排'}</strong>
      <span>{hasWarnings ? `${validation.warnings.length} 项提醒` : '没有提醒'}</span>
      {(hasErrors ? validation.errors : validation.warnings).slice(0, 4).map((item) => (
        <p key={`${item.code}-${item.message}`}>{item.message}</p>
      ))}
    </section>
  )
}

type VoteControlsProps = {
  match: MatchData
  state: PresentationState
  dispatch: (action: PresentationAction) => void
}

function VoteControls({ match, state, dispatch }: VoteControlsProps) {
  return (
    <section className="controller-section vote-controls" aria-label="决选票控制">
      <h2>决选票</h2>
      {match.judges.map((judge) => {
        const vote = state.votes[judge.id]

        return (
          <article className="judge-vote-row" key={judge.id}>
            <div>
              <img alt={judge.displayName} src={judge.photoPath} />
              <strong>{judge.displayName}</strong>
              <span>{vote ? voteLabel(vote) : '未选择'}</span>
            </div>
            <div className="vote-button-row">
              {match.teams.map((team) => (
                <button
                  className={vote === team.side ? 'selected' : ''}
                  key={team.id}
                  type="button"
                  onClick={() => dispatch({ type: 'reveal-vote', judgeId: judge.id, side: team.side })}
                >
                  {team.sideLabel}
                </button>
              ))}
            </div>
          </article>
        )
      })}

      <div className="recovery-controls" aria-label="恢复控制">
        <h3>恢复控制</h3>
        <button type="button" onClick={() => dispatch({ type: 'reset-votes' })}>
          重置所有票
        </button>
        {match.judges.map((judge) => (
          <button key={judge.id} type="button" onClick={() => dispatch({ type: 'clear-vote', judgeId: judge.id })}>
            清除 {judge.displayName}
          </button>
        ))}
      </div>
    </section>
  )
}

function voteLabel(side: SideId) {
  return side === 'zheng' ? '正方' : '反方'
}
