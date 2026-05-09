import type { MatchData, SideId } from './types'

export const findTeamBySide = (match: MatchData, side: SideId) =>
  match.teams.find((team) => team.side === side) ?? match.teams[0]
