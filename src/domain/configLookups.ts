import type { DebaterData, JudgeData } from './types'

export type DebaterLookup = {
  id: string
  displayName: string
  major: string
  photoPath: string
}

export type UniversityLookup = {
  id: string
  displayName: string
  initials: string
  logoPath?: string
  debaters: [DebaterLookup, DebaterLookup, DebaterLookup, DebaterLookup, DebaterLookup]
}

export type JudgeLookup = {
  id: string
  displayName: string
  photoPath: string
}

const portrait = (label: string, background: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
      <rect width="480" height="640" rx="32" fill="${background}"/>
      <circle cx="240" cy="230" r="92" fill="rgba(255,255,255,0.78)"/>
      <path d="M118 554c18-92 78-150 122-150s104 58 122 150" fill="rgba(255,255,255,0.72)"/>
      <text x="240" y="574" text-anchor="middle" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${label}</text>
    </svg>
  `)}`

const debater = (id: string, displayName: string, major: string, color: string): DebaterLookup => ({
  id,
  displayName,
  major,
  photoPath: portrait(displayName.slice(0, 2), color),
})

const judge = (id: string, displayName: string, color: string): JudgeLookup => ({
  id,
  displayName,
  photoPath: portrait(displayName.slice(0, 2), color),
})

export const universities: [UniversityLookup, UniversityLookup, UniversityLookup, UniversityLookup] = [
  {
    id: 'um',
    displayName: '马来亚大学',
    initials: 'UM',
    debaters: [
      debater('um-chen-zihan', '陈子涵', '法律学', '#1d4ed8'),
      debater('um-lin-jiayi', '林嘉怡', '心理学', '#2563eb'),
      debater('um-huang-junjie', '黄俊杰', '经济学', '#1e40af'),
      debater('um-wu-shimin', '吴诗敏', '传播学', '#3b82f6'),
      debater('um-liang-yuxuan', '梁宇轩', '国际关系', '#60a5fa'),
    ],
  },
  {
    id: 'ukm',
    displayName: '国民大学',
    initials: 'UKM',
    debaters: [
      debater('ukm-tan-junhao', '陈俊豪', '政治学', '#0f766e'),
      debater('ukm-yeoh-xinyi', '杨欣怡', '教育学', '#0d9488'),
      debater('ukm-lim-kaiwen', '林凯文', '电脑科学', '#14b8a6'),
      debater('ukm-ng-meiling', '黄美玲', '社会学', '#2dd4bf'),
      debater('ukm-chong-yuhan', '钟宇涵', '公共政策', '#5eead4'),
    ],
  },
  {
    id: 'upm',
    displayName: '博特拉大学',
    initials: 'UPM',
    debaters: [
      debater('upm-zhang-weilun', '张伟伦', '政治学', '#b91c1c'),
      debater('upm-li-xintong', '李欣彤', '教育学', '#dc2626'),
      debater('upm-zhou-kaiwen', '周凯文', '电脑科学', '#991b1b'),
      debater('upm-xu-jiaen', '许佳恩', '社会学', '#ef4444'),
      debater('upm-luo-mingyi', '罗铭毅', '工商管理', '#f87171'),
    ],
  },
  {
    id: 'usm',
    displayName: '理科大学',
    initials: 'USM',
    debaters: [
      debater('usm-ong-yiting', '王怡婷', '生命科学', '#7c3aed'),
      debater('usm-goh-yongjie', '吴永杰', '工程学', '#8b5cf6'),
      debater('usm-lee-peishan', '李佩珊', '医学', '#a78bfa'),
      debater('usm-teh-hanwei', '郑翰威', '数学', '#6d28d9'),
      debater('usm-khoo-ruien', '邱睿恩', '环境科学', '#c4b5fd'),
    ],
  },
]

export const judges: [JudgeLookup, JudgeLookup, JudgeLookup, JudgeLookup, JudgeLookup, JudgeLookup, JudgeLookup] = [
  judge('judge-wang', '王老师', '#334155'),
  judge('judge-liu', '刘老师', '#475569'),
  judge('judge-zheng', '郑老师', '#64748b'),
  judge('judge-cai', '蔡老师', '#52525b'),
  judge('judge-yang', '杨老师', '#3f3f46'),
  judge('judge-chen', '陈老师', '#365314'),
  judge('judge-lim', '林老师', '#7c2d12'),
]

export const toDebaterData = (lookup: DebaterLookup, id: string): DebaterData => ({
  id,
  displayName: lookup.displayName,
  major: lookup.major,
  photoPath: lookup.photoPath,
})

export const toJudgeData = (lookup: JudgeLookup, id: string): JudgeData => ({
  id,
  displayName: lookup.displayName,
  photoPath: lookup.photoPath,
})
