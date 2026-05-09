import { motion } from 'motion/react'
import { findTeamBySide } from '../domain/lookups'
import { SlideChrome } from '../layout/SlideChrome'
import type { MatchData, PresentationState } from '../domain/types'

type VoteRevealSlideProps = {
  match: MatchData
  state: PresentationState
}

export function VoteRevealSlide({ match, state }: VoteRevealSlideProps) {
  return (
    <motion.section animate={{ opacity: 1 }} className="slide vote-reveal-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <SlideChrome eyebrow={match.match.competitionId} title="决选票" meta={match.event.title} />
        <div className={`vote-card-grid judge-count-${match.judges.length}`}>
          {match.judges.map((judge) => {
            const vote = state.votes[judge.id]
            const votedTeam = vote ? findTeamBySide(match, vote) : null
            const changed = state.changedJudgeId === judge.id

            return (
              <article className={`vote-card ${vote ?? 'neutral'} ${changed ? 'changed' : ''}`} key={`${judge.id}-${changed ? state.updatedAt : 'stable'}`}>
                <img alt={judge.displayName} src={judge.photoPath} />
                <strong>{judge.displayName}</strong>
                {votedTeam ? <span>{votedTeam.sideLabel}</span> : null}
              </article>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
