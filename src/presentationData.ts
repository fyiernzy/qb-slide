export type Member = {
  name: string
  school: string
  avatarUrl: string
}

export type Team = {
  id: string
  name: string
  school: string
  accentColor: string
  members: Member[]
}

export type Judge = {
  id: string
  name: string
}

export type PresentationConfig = {
  eventTitle: string
  subtitle: string
  teams: Team[]
  judges: Judge[]
}

const avatar = (label: string, background: string, foreground = '#fff') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <rect width="320" height="320" rx="84" fill="${background}"/>
      <circle cx="236" cy="84" r="54" fill="rgba(255,255,255,0.18)"/>
      <circle cx="82" cy="248" r="72" fill="rgba(255,255,255,0.14)"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Avenir Next, Trebuchet MS, sans-serif" font-size="92"
        font-weight="800" fill="${foreground}" letter-spacing="2">${label}</text>
    </svg>
  `)}`

export const presentationConfig: PresentationConfig = {
  eventTitle: 'Quan Bian Debate Finals',
  subtitle: 'Live judging deck',
  teams: [
    {
      id: 'team-a',
      name: 'Team Aurora',
      school: 'North Valley High School',
      accentColor: '#f97316',
      members: [
        {
          name: 'Alicia Tan',
          school: 'North Valley High School',
          avatarUrl: avatar('AT', '#f97316'),
        },
        {
          name: 'Brandon Lee',
          school: 'North Valley High School',
          avatarUrl: avatar('BL', '#fb923c'),
        },
        {
          name: 'Chloe Wong',
          school: 'North Valley High School',
          avatarUrl: avatar('CW', '#ea580c'),
        },
      ],
    },
    {
      id: 'team-b',
      name: 'Team Vertex',
      school: 'Eastbridge Academy',
      accentColor: '#0f766e',
      members: [
        {
          name: 'Daniel Lim',
          school: 'Eastbridge Academy',
          avatarUrl: avatar('DL', '#0f766e'),
        },
        {
          name: 'Evelyn Ng',
          school: 'Eastbridge Academy',
          avatarUrl: avatar('EN', '#14b8a6'),
        },
        {
          name: 'Farah Aziz',
          school: 'Eastbridge Academy',
          avatarUrl: avatar('FA', '#115e59'),
        },
      ],
    },
  ],
  judges: [
    { id: 'judge-1', name: 'Judge Melissa' },
    { id: 'judge-2', name: 'Judge Arvind' },
    { id: 'judge-3', name: 'Judge Sophia' },
  ],
}
