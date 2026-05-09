import { motion } from 'motion/react'
import { SlideChrome } from '../layout/SlideChrome'
import type { MatchData } from '../domain/types'

type JudgesSlideProps = {
  match: MatchData
}

export function JudgesSlide({ match }: JudgesSlideProps) {
  return (
    <motion.section animate={{ opacity: 1 }} className="slide judges-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <SlideChrome eyebrow={match.match.competitionId} title="评审介绍" meta={match.event.title} />
        <div className="judge-grid">
          {match.judges.map((judge) => (
            <article className="person-card judge-card" key={judge.id}>
              <img alt={judge.displayName} src={judge.photoPath} />
              <strong>{judge.displayName}</strong>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
