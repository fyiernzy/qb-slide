import { motion } from 'motion/react'
import type { MatchData } from '../domain/types'

type GeneralSlideProps = {
  match: MatchData
}

export function GeneralSlide({ match }: GeneralSlideProps) {
  const [zhengTeam, fanTeam] = match.teams

  return (
    <motion.section animate={{ opacity: 1 }} className="slide general-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <div className="general-header">
          <p>{match.match.competitionId}</p>
          <h1>{match.event.title}</h1>
          <span>{match.match.round}</span>
        </div>

        <div className="motion-block">
          <span>辩题</span>
          <strong>{match.match.motion}</strong>
        </div>

        <div className="versus-grid">
          <TeamMarkPanel side="zheng" sideLabel={zhengTeam.sideLabel} initials={zhengTeam.initials} school={zhengTeam.universityName} />
          <div className="versus-divider">VS</div>
          <TeamMarkPanel side="fan" sideLabel={fanTeam.sideLabel} initials={fanTeam.initials} school={fanTeam.universityName} />
        </div>
      </div>
    </motion.section>
  )
}

type TeamMarkPanelProps = {
  side: 'zheng' | 'fan'
  sideLabel: string
  initials: string
  school: string
}

function TeamMarkPanel({ side, sideLabel, initials, school }: TeamMarkPanelProps) {
  return (
    <article className={`team-mark-panel ${side}`}>
      <span>{sideLabel}</span>
      <strong>{initials}</strong>
      <p>{school}</p>
    </article>
  )
}
