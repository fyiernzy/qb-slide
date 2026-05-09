import type { MatchData, RunOfShowState } from './types'

export const buildRunOfShow = (match: MatchData): RunOfShowState[] => [
  { id: 'general', kind: 'general', label: '总览' },
  { id: 'team-zheng', kind: 'team', label: '正方介绍', side: 'zheng' },
  { id: 'team-fan', kind: 'team', label: '反方介绍', side: 'fan' },
  { id: 'judges', kind: 'judges', label: '评审介绍' },
  ...match.segments.map((segment) => ({
    id: segment.id,
    kind: 'session' as const,
    label: segment.label,
    segmentId: segment.id,
  })),
  { id: 'vote-reveal', kind: 'vote-reveal', label: '决选票公布' },
  { id: 'result', kind: 'result', label: '总结结果' },
]

export const findSlideIndex = (slides: RunOfShowState[], slideId: string) =>
  slides.findIndex((slide) => slide.id === slideId)

export const getSlideById = (slides: RunOfShowState[], slideId: string) =>
  slides.find((slide) => slide.id === slideId) ?? slides[0]

export const getNextSlideId = (slides: RunOfShowState[], slideId: string) => {
  const index = findSlideIndex(slides, slideId)
  return slides[Math.min(index + 1, slides.length - 1)]?.id ?? slides[0].id
}

export const getPreviousSlideId = (slides: RunOfShowState[], slideId: string) => {
  const index = findSlideIndex(slides, slideId)
  return slides[Math.max(index - 1, 0)]?.id ?? slides[0].id
}
