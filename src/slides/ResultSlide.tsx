import { motion } from 'motion/react'
import { calculateResult } from '../domain/results'
import type { MatchData, PresentationState, TeamData } from '../domain/types'

type ResultSlideProps = {
  match: MatchData
  state: PresentationState
}

export function ResultSlide({ match, state }: ResultSlideProps) {
  const result = calculateResult(match, state.votes)
  const [zhengTeam, fanTeam] = match.teams

  return (
    <motion.section animate={{ opacity: 1 }} className="slide result-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <div className="result-heading">
          <p>{match.match.competitionId}</p>
          <h1>{result.headline}</h1>
          <span>{result.isComplete ? '最终结果' : '尚未完成投票'}</span>
        </div>
        <div className="result-panel-grid">
          <ResultPanel resultVotes={result.isComplete ? result.zhengVotes : null} team={zhengTeam} winnerSide={result.winnerSide} />
          <ResultPanel resultVotes={result.isComplete ? result.fanVotes : null} team={fanTeam} winnerSide={result.winnerSide} />
        </div>
      </div>
    </motion.section>
  )
}

type ResultPanelProps = {
  team: TeamData
  resultVotes: number | null
  winnerSide: string | null
}

function ResultPanel({ team, resultVotes, winnerSide }: ResultPanelProps) {
  const isWinner = winnerSide === team.side

  return (
    <article className={`result-panel ${team.side} ${isWinner ? 'winner' : ''}`}>
      <span>{team.sideLabel}</span>
      <strong>{resultVotes ?? '-'}</strong>
      <p>{team.universityName}</p>
      {isWinner ? <em>胜</em> : null}
    </article>
  )
}
