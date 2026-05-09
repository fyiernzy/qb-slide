import { getSlideById } from '../domain/segments'
import type { MatchData, PresentationState, RunOfShowState } from '../domain/types'
import { GeneralSlide } from './GeneralSlide'
import { JudgesSlide } from './JudgesSlide'
import { ResultSlide } from './ResultSlide'
import { SessionSlide } from './SessionSlides'
import { TeamIntroSlide } from './TeamIntroSlide'
import { VoteRevealSlide } from './VoteRevealSlide'

type SlideRendererProps = {
  match: MatchData
  slides: RunOfShowState[]
  state: PresentationState
}

export function SlideRenderer({ match, slides, state }: SlideRendererProps) {
  const slide = getSlideById(slides, state.currentSlideId)

  if (slide.kind === 'general') {
    return <GeneralSlide match={match} />
  }

  if (slide.kind === 'team') {
    const team = match.teams.find((candidate) => candidate.side === slide.side) ?? match.teams[0]
    return <TeamIntroSlide eventTitle={match.event.title} team={team} />
  }

  if (slide.kind === 'judges') {
    return <JudgesSlide match={match} />
  }

  if (slide.kind === 'session') {
    const segment = match.segments.find((candidate) => candidate.id === slide.segmentId)
    return segment ? <SessionSlide match={match} segment={segment} /> : <GeneralSlide match={match} />
  }

  if (slide.kind === 'vote-reveal') {
    return <VoteRevealSlide match={match} state={state} />
  }

  return <ResultSlide match={match} state={state} />
}
