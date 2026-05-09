import type { DebaterData, JudgeData, MatchData } from './types'

const portrait = (label: string, background: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
      <rect width="480" height="640" rx="32" fill="${background}"/>
      <circle cx="240" cy="230" r="92" fill="rgba(255,255,255,0.78)"/>
      <path d="M118 554c18-92 78-150 122-150s104 58 122 150" fill="rgba(255,255,255,0.72)"/>
      <text x="240" y="574" text-anchor="middle" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${label}</text>
    </svg>
  `)}`

const debater = (
  id: string,
  displayName: string,
  major: string,
  color: string,
): DebaterData => ({
  id,
  displayName,
  major,
  photoPath: portrait(displayName.slice(0, 2), color),
})

const judge = (id: string, displayName: string, color: string): JudgeData => ({
  id,
  displayName,
  photoPath: portrait(displayName.slice(0, 2), color),
})

export const mockMatch: MatchData = {
  event: {
    id: 'quanbian-20',
    title: '第二十届全国大专辩论会',
    subtitle: '低优先级场次自动化模板',
  },
  match: {
    id: 'mock-match-001',
    competitionId: '小组赛（十三）',
    round: '小组赛',
    room: '主礼堂',
    date: '2026-05-09',
    motion: '在当今社会，人工智能的发展对大学生而言利大于弊',
  },
  teams: [
    {
      id: 'team-zheng',
      side: 'zheng',
      sideLabel: '正方',
      displayName: '明辨队',
      universityName: '马来亚大学',
      initials: 'UM',
      debaters: [
        debater('zheng-1', '陈子涵', '法律学', '#1d4ed8'),
        debater('zheng-2', '林嘉怡', '心理学', '#2563eb'),
        debater('zheng-3', '黄俊杰', '经济学', '#1e40af'),
        debater('zheng-4', '吴诗敏', '传播学', '#3b82f6'),
      ],
    },
    {
      id: 'team-fan',
      side: 'fan',
      sideLabel: '反方',
      displayName: '思辨队',
      universityName: '博特拉大学',
      initials: 'UPM',
      debaters: [
        debater('fan-1', '张伟伦', '政治学', '#b91c1c'),
        debater('fan-2', '李欣彤', '教育学', '#dc2626'),
        debater('fan-3', '周凯文', '电脑科学', '#991b1b'),
        debater('fan-4', '许佳恩', '社会学', '#ef4444'),
      ],
    },
  ],
  judges: [
    judge('judge-1', '王老师', '#334155'),
    judge('judge-2', '刘老师', '#475569'),
    judge('judge-3', '郑老师', '#64748b'),
    judge('judge-4', '蔡老师', '#52525b'),
    judge('judge-5', '杨老师', '#3f3f46'),
  ],
  segments: [
    {
      id: 'session-zheng-1-case',
      label: '正方一辩 立论',
      kind: 'single',
      side: 'zheng',
      speakerDebaterIds: ['zheng-1'],
    },
    {
      id: 'session-fan-1-case',
      label: '反方一辩 立论',
      kind: 'single',
      side: 'fan',
      speakerDebaterIds: ['fan-1'],
    },
    {
      id: 'session-fan-2-question',
      label: '反方二辩 质询',
      kind: 'single',
      side: 'fan',
      speakerDebaterIds: ['fan-2'],
    },
    {
      id: 'session-zheng-2-question',
      label: '正方二辩 质询',
      kind: 'single',
      side: 'zheng',
      speakerDebaterIds: ['zheng-2'],
    },
    {
      id: 'session-fan-2-summary',
      label: '反方二辩 总结',
      kind: 'single',
      side: 'fan',
      speakerDebaterIds: ['fan-2'],
    },
    {
      id: 'session-zheng-2-summary',
      label: '正方二辩 总结',
      kind: 'single',
      side: 'zheng',
      speakerDebaterIds: ['zheng-2'],
    },
    {
      id: 'session-third-debate',
      label: '三辩 对辩',
      kind: 'paired',
      side: 'both',
      speakerDebaterIds: ['zheng-3', 'fan-3'],
      showMotion: true,
    },
    {
      id: 'session-zheng-3-summary',
      label: '正方三辩 总结',
      kind: 'single',
      side: 'zheng',
      speakerDebaterIds: ['zheng-3'],
    },
    {
      id: 'session-fan-3-summary',
      label: '反方三辩 总结',
      kind: 'single',
      side: 'fan',
      speakerDebaterIds: ['fan-3'],
    },
    {
      id: 'session-free-debate',
      label: '自由辩论',
      kind: 'free',
      side: 'both',
      showMotion: true,
    },
    {
      id: 'session-fan-4-summary',
      label: '反方四辩 总结',
      kind: 'single',
      side: 'fan',
      speakerDebaterIds: ['fan-4'],
    },
    {
      id: 'session-zheng-4-summary',
      label: '正方四辩 总结',
      kind: 'single',
      side: 'zheng',
      speakerDebaterIds: ['zheng-4'],
    },
  ],
}
