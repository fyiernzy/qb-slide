import { motion } from 'motion/react'
import { SlideChrome } from '../layout/SlideChrome'
import type { DebateSegment, MatchData, TeamData } from '../domain/types'

type SessionSlideProps = {
  match: MatchData
  segment: DebateSegment
}

export function SessionSlide({ match, segment }: SessionSlideProps) {
  if (segment.kind === 'free') {
    return <FreeDebateSlide match={match} segment={segment} />
  }

  if (segment.kind === 'paired') {
    return <PairedSessionSlide match={match} segment={segment} />
  }

  return <SingleSessionSlide match={match} segment={segment} />
}

function SingleSessionSlide({ match, segment }: SessionSlideProps) {
  const debater = findDebater(match, segment.speakerDebaterIds?.[0])
  const team = debater ? findTeamByDebater(match, debater.id) : null

  return (
    <motion.section animate={{ opacity: 1 }} className={`slide session-slide ${team?.side ?? 'neutral'}`} initial={{ opacity: 0 }}>
      <div className="slide-safe session-single-layout">
        {debater ? <img alt={debater.displayName} className="session-portrait" src={debater.photoPath} /> : null}
        <div className="session-copy">
          <SlideChrome eyebrow={team?.sideLabel ?? '环节'} title={segment.label} meta={match.event.title} />
          <strong>{debater?.displayName ?? '未指定辩手'}</strong>
          <span>{team?.universityName ?? '资料缺失'}</span>
        </div>
      </div>
    </motion.section>
  )
}

function PairedSessionSlide({ match, segment }: SessionSlideProps) {
  const debaters = (segment.speakerDebaterIds ?? []).map((id) => findDebater(match, id)).filter((debater) => debater !== null)

  return (
    <motion.section animate={{ opacity: 1 }} className="slide session-slide paired-session-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <SlideChrome eyebrow="对辩环节" title={segment.label} meta={match.event.title} />
        <div className="paired-debater-grid">
          {debaters.map((debater) => {
            const team = findTeamByDebater(match, debater.id)

            return (
              <article className={`paired-card ${team?.side ?? 'neutral'}`} key={debater.id}>
                <img alt={debater.displayName} src={debater.photoPath} />
                <span>{team?.sideLabel}</span>
                <strong>{debater.displayName}</strong>
              </article>
            )
          })}
        </div>
        <p className="session-motion">{match.match.motion}</p>
      </div>
    </motion.section>
  )
}

function FreeDebateSlide({ match, segment }: SessionSlideProps) {
  const [zhengTeam, fanTeam] = match.teams

  return (
    <motion.section animate={{ opacity: 1 }} className="slide session-slide free-session-slide" initial={{ opacity: 0 }}>
      <div className="slide-safe">
        <SlideChrome eyebrow="双方交锋" title={segment.label} meta={match.event.title} />
        <div className="free-debate-grid">
          <FreeTeamMark team={zhengTeam} />
          <FreeTeamMark team={fanTeam} />
        </div>
        <p className="session-motion">{match.match.motion}</p>
      </div>
    </motion.section>
  )
}

function FreeTeamMark({ team }: { team: TeamData }) {
  return (
    <article className={`free-team-mark ${team.side}`}>
      <span>{team.sideLabel}</span>
      <strong>{team.initials}</strong>
      <p>{team.universityName}</p>
    </article>
  )
}

function findDebater(match: MatchData, debaterId: string | undefined) {
  if (!debaterId) {
    return null
  }

  return match.teams.flatMap((team) => team.debaters).find((debater) => debater.id === debaterId) ?? null
}

function findTeamByDebater(match: MatchData, debaterId: string) {
  return match.teams.find((team) => team.debaters.some((debater) => debater.id === debaterId)) ?? null
}
