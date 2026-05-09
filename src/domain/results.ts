import type { MatchData, ResultSummary, SideId, VotesByJudge } from './types'

const countSideVotes = (votes: VotesByJudge, side: SideId) =>
  Object.values(votes).filter((vote) => vote === side).length

export const calculateResult = (match: MatchData, votes: VotesByJudge): ResultSummary => {
  const zhengVotes = countSideVotes(votes, 'zheng')
  const fanVotes = countSideVotes(votes, 'fan')
  const submittedVotes = zhengVotes + fanVotes
  const requiredVotes = match.judges.length
  const isComplete = submittedVotes === requiredVotes
  const score = `${zhengVotes}:${fanVotes}`

  if (!isComplete) {
    return {
      zhengVotes,
      fanVotes,
      score,
      winnerSide: null,
      resultWord: '未完整',
      isComplete,
      headline: '决选票未完整',
    }
  }

  if (zhengVotes === fanVotes) {
    return {
      zhengVotes,
      fanVotes,
      score,
      winnerSide: null,
      resultWord: '和',
      isComplete,
      headline: `和 ${score}`,
    }
  }

  const winnerSide: SideId = zhengVotes > fanVotes ? 'zheng' : 'fan'
  const winnerLabel = match.teams.find((team) => team.side === winnerSide)?.sideLabel ?? '正方'

  return {
    zhengVotes,
    fanVotes,
    score,
    winnerSide,
    resultWord: '胜',
    isComplete,
    headline: `${winnerLabel} 胜 ${score}`,
  }
}
