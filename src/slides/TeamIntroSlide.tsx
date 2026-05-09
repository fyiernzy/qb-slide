import { motion } from 'motion/react'
import { SlideChrome } from '../layout/SlideChrome'
import type { TeamData } from '../domain/types'

type TeamIntroSlideProps = {
  team: TeamData
  eventTitle: string
}

export function TeamIntroSlide({ team, eventTitle }: TeamIntroSlideProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className={`slide team-intro-slide ${team.side}`}
      initial={{ opacity: 0, y: 10 }}
    >
      <div className="slide-safe">
        <SlideChrome eyebrow={team.sideLabel} title={team.universityName} meta={eventTitle} />
        <div className="team-intro-body">
          <aside className="team-identity">
            <span>{team.initials}</span>
            <strong>{team.displayName}</strong>
            <p>{team.sideLabel}</p>
          </aside>
          <div className="debater-grid">
            {team.debaters.map((debater) => (
              <article className="person-card debater-card" key={debater.id}>
                <img alt={debater.displayName} src={debater.photoPath} />
                <div>
                  <strong>{debater.displayName}</strong>
                  <span>{debater.major}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
