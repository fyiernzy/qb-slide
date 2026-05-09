import { motion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import * as THREE from 'three'
import './App.css'
import { presentationConfig, type Team } from './presentationData'

type ViewMode = 'launcher' | 'audience' | 'backstage'
type VoteValue = string | null
type Votes = Record<string, VoteValue>

type PresentationState = {
  slideIndex: number
  votes: Votes
  changedJudgeId: string | null
  updatedAt: number
}

type VoteTotals = Record<string, number>

const CHANNEL_NAME = 'qb-slide-presentation'
const STORAGE_KEY = 'qb-slide-state'
const SLIDE_COUNT = 5
const LAST_SLIDE_INDEX = SLIDE_COUNT - 1

const createEmptyVotes = (): Votes =>
  Object.fromEntries(presentationConfig.judges.map((judge) => [judge.id, null]))

const createInitialState = (): PresentationState => ({
  slideIndex: 0,
  votes: createEmptyVotes(),
  changedJudgeId: null,
  updatedAt: Date.now(),
})

const clampSlide = (slideIndex: number) =>
  Math.min(Math.max(slideIndex, 0), LAST_SLIDE_INDEX)

const normalizeVotes = (votes: unknown): Votes => {
  const nextVotes = createEmptyVotes()

  if (!votes || typeof votes !== 'object') {
    return nextVotes
  }

  const teamIds = new Set(presentationConfig.teams.map((team) => team.id))
  const rawVotes = votes as Record<string, unknown>

  for (const judge of presentationConfig.judges) {
    const vote = rawVotes[judge.id]
    nextVotes[judge.id] = typeof vote === 'string' && teamIds.has(vote) ? vote : null
  }

  return nextVotes
}

const normalizeState = (state: unknown): PresentationState | null => {
  if (!state || typeof state !== 'object') {
    return null
  }

  const rawState = state as Partial<PresentationState>
  const slideIndex =
    typeof rawState.slideIndex === 'number' ? clampSlide(rawState.slideIndex) : 0

  return {
    slideIndex,
    votes: normalizeVotes(rawState.votes),
    changedJudgeId: typeof rawState.changedJudgeId === 'string' ? rawState.changedJudgeId : null,
    updatedAt: typeof rawState.updatedAt === 'number' ? rawState.updatedAt : Date.now(),
  }
}

const readStoredState = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return createInitialState()
  }

  try {
    return normalizeState(JSON.parse(stored)) ?? createInitialState()
  } catch {
    return createInitialState()
  }
}

const getViewMode = (): ViewMode => {
  const view = new URLSearchParams(window.location.search).get('view')

  if (view === 'audience' || view === 'backstage') {
    return view
  }

  return 'launcher'
}

const calculateTotals = (votes: Votes): VoteTotals => {
  const totals = Object.fromEntries(presentationConfig.teams.map((team) => [team.id, 0]))

  for (const vote of Object.values(votes)) {
    if (vote) {
      totals[vote] += 1
    }
  }

  return totals
}

const getWinner = (totals: VoteTotals) => {
  const [firstTeam, secondTeam] = presentationConfig.teams

  if (totals[firstTeam.id] === totals[secondTeam.id]) {
    return null
  }

  return totals[firstTeam.id] > totals[secondTeam.id] ? firstTeam : secondTeam
}

function usePresentationState() {
  const [state, setState] = useState(readStoredState)

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)

    channel.onmessage = (event: MessageEvent<unknown>) => {
      const nextState = normalizeState(event.data)

      if (nextState) {
        setState(nextState)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return
      }

      try {
        const nextState = normalizeState(JSON.parse(event.newValue))

        if (nextState) {
          setState(nextState)
        }
      } catch {
        return
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      channel.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const updateState = (updater: (current: PresentationState) => PresentationState) => {
    setState((currentState) => {
      const nextState = {
        ...updater(currentState),
        updatedAt: Date.now(),
      }
      const channel = new BroadcastChannel(CHANNEL_NAME)

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
      channel.postMessage(nextState)
      channel.close()

      return nextState
    })
  }

  return [state, updateState] as const
}

function App() {
  const mode = getViewMode()
  const [state, updateState] = usePresentationState()

  if (mode === 'audience') {
    return <AudienceView state={state} />
  }

  if (mode === 'backstage') {
    return <BackstageView state={state} updateState={updateState} />
  }

  return <LauncherView state={state} updateState={updateState} />
}

type AppViewProps = {
  state: PresentationState
}

type ControlledViewProps = AppViewProps & {
  updateState: (updater: (current: PresentationState) => PresentationState) => void
}

function LauncherView({ state, updateState }: ControlledViewProps) {
  const startPresentation = () => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`

    window.open(`${baseUrl}?view=audience`, 'qb-slide-audience', 'popup,width=1280,height=720')
    window.open(`${baseUrl}?view=backstage`, 'qb-slide-backstage', 'popup,width=1240,height=860')
  }

  const resetPresentation = () => {
    updateState(() => createInitialState())
  }

  return (
    <main className="launcher-shell">
      <section className="launcher-copy" aria-labelledby="launcher-title">
        <p className="eyebrow">{presentationConfig.subtitle}</p>
        <h1 id="launcher-title">{presentationConfig.eventTitle}</h1>
        <p>
          A synchronized 16:9 judging deck with an audience window and a staff-only
          backstage window.
        </p>
        <div className="launcher-actions">
          <button type="button" className="primary-button" onClick={startPresentation}>
            Present
          </button>
          <button type="button" className="ghost-button" onClick={resetPresentation}>
            Reset votes
          </button>
        </div>
      </section>
      <section className="launcher-preview" aria-label="Current slide preview">
        <SlideFrame compact>
          <PresentationSlide state={state} />
        </SlideFrame>
      </section>
    </main>
  )
}

function AudienceView({ state }: AppViewProps) {
  return (
    <main className="audience-shell">
      <SlideFrame>
        <PresentationSlide state={state} />
      </SlideFrame>
      <AudienceVoteAnimation state={state} />
    </main>
  )
}

function BackstageView({ state, updateState }: ControlledViewProps) {
  const canGoPrevious = state.slideIndex > 0
  const canGoNext = state.slideIndex < LAST_SLIDE_INDEX

  const goToSlide = (slideIndex: number) => {
    updateState((currentState) => ({
      ...currentState,
      slideIndex: clampSlide(slideIndex),
    }))
  }

  const voteForTeam = (judgeId: string, teamId: string) => {
    updateState((currentState) => ({
      ...currentState,
      changedJudgeId: judgeId,
      votes: {
        ...currentState.votes,
        [judgeId]: teamId,
      },
    }))
  }

  const clearVote = (judgeId: string) => {
    updateState((currentState) => ({
      ...currentState,
      changedJudgeId: judgeId,
      votes: {
        ...currentState.votes,
        [judgeId]: null,
      },
    }))
  }

  return (
    <main className="backstage-shell">
      <section className="backstage-preview" aria-label="Audience slide preview">
        <SlideFrame compact>
          <PresentationSlide state={state} />
        </SlideFrame>
      </section>
      <aside className="backstage-panel" aria-label="Backstage controls">
        <div>
          <p className="eyebrow">Backstage control</p>
          <h1>{presentationConfig.eventTitle}</h1>
          <p className="panel-note">Audience sync is automatic after every slide or vote change.</p>
        </div>

        <div className="slide-controls" aria-label="Slide controls">
          <button type="button" onClick={() => goToSlide(state.slideIndex - 1)} disabled={!canGoPrevious}>
            Previous
          </button>
          <span>
            Slide {state.slideIndex + 1} / {SLIDE_COUNT}
          </span>
          <button type="button" onClick={() => goToSlide(state.slideIndex + 1)} disabled={!canGoNext}>
            Next
          </button>
        </div>

        <div className="slide-jump-list" aria-label="Jump to slide">
          {['Cover', 'Team A', 'Team B', 'Judge Votes', 'Final Result'].map((label, index) => (
            <button
              type="button"
              className={state.slideIndex === index ? 'active' : ''}
              key={label}
              onClick={() => goToSlide(index)}
            >
              {label}
            </button>
          ))}
        </div>

        <VoteControls
          votes={state.votes}
          voteForTeam={voteForTeam}
          clearVote={clearVote}
        />
      </aside>
    </main>
  )
}

type VoteControlsProps = {
  votes: Votes
  voteForTeam: (judgeId: string, teamId: string) => void
  clearVote: (judgeId: string) => void
}

function VoteControls({ votes, voteForTeam, clearVote }: VoteControlsProps) {
  return (
    <section className="vote-controls" aria-labelledby="vote-controls-title">
      <div>
        <p className="eyebrow">Judge votes</p>
        <h2 id="vote-controls-title">Choose one team per judge</h2>
      </div>

      {presentationConfig.judges.map((judge) => (
        <div className="judge-control" key={judge.id}>
          <div>
            <strong>{judge.name}</strong>
            <span>{votes[judge.id] ? 'Vote locked in' : 'Awaiting vote'}</span>
          </div>
          <div className="judge-buttons">
            {presentationConfig.teams.map((team) => {
              const isSelected = votes[judge.id] === team.id

              return (
                <button
                  type="button"
                  className={isSelected ? 'selected' : ''}
                  key={team.id}
                  onClick={() => voteForTeam(judge.id, team.id)}
                >
                  {team.name}
                </button>
              )
            })}
            <button type="button" className="clear-button" onClick={() => clearVote(judge.id)}>
              Clear
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

function AudienceVoteAnimation({ state }: AppViewProps) {
  const judge = presentationConfig.judges.find((candidate) => candidate.id === state.changedJudgeId)
  const team = presentationConfig.teams.find((candidate) => candidate.id === state.votes[state.changedJudgeId ?? ''])
  const teamIndex = presentationConfig.teams.findIndex((candidate) => candidate.id === team?.id)
  const tone = teamIndex === 0 ? 'red' : teamIndex === 1 ? 'green' : 'neutral'

  if (!judge || !team) {
    return null
  }

  return (
    <aside
      aria-live="polite"
      className={`audience-vote-animation ${tone}`}
      key={`${judge.id}-${team.id}-${state.updatedAt}`}
    >
      <span>{judge.name}</span>
      <strong>{team.name}</strong>
      <small>Vote received</small>
    </aside>
  )
}

type SlideFrameProps = {
  children: ReactNode
  compact?: boolean
}

function SlideFrame({ children, compact = false }: SlideFrameProps) {
  return <div className={compact ? 'slide-frame compact' : 'slide-frame'}>{children}</div>
}

function PresentationSlide({ state }: AppViewProps) {
  if (state.slideIndex === 0) {
    return <CoverSlide />
  }

  if (state.slideIndex === 1) {
    return <TeamSlide team={presentationConfig.teams[0]} label="Team A" />
  }

  if (state.slideIndex === 2) {
    return <TeamSlide team={presentationConfig.teams[1]} label="Team B" />
  }

  if (state.slideIndex === 3) {
    return <VotesSlide state={state} />
  }

  return <ResultSlide votes={state.votes} />
}

function CoverSlide() {
  const [firstTeam, secondTeam] = presentationConfig.teams

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="slide cover-slide"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cover-sponsor-strip" aria-label="Event partners">
        {['QB', 'MY', 'UTAR', 'Goxuan', 'Debate', 'Finals', 'Live'].map((sponsor) => (
          <span key={sponsor}>{sponsor}</span>
        ))}
      </div>
      <div className="cover-stage-lights" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="cover-side cover-side-left"
        initial={{ opacity: 0, x: -80 }}
        transition={{ delay: 0.18, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <strong>正</strong>
        <span>{firstTeam.name}</span>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="cover-side cover-side-right"
        initial={{ opacity: 0, x: 80 }}
        transition={{ delay: 0.24, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <strong>反</strong>
        <span>{secondTeam.name}</span>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="cover-title-block"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>第二十届全国大专辩论会</p>
        <h1>总决赛</h1>
        <h2>朝野交锋 / 社会撕裂</h2>
        <span>显当今马来西亚前进的最大阻力</span>
      </motion.div>
      <div className="cover-desk cover-desk-left" aria-hidden="true" />
      <div className="cover-desk cover-desk-right" aria-hidden="true" />
    </motion.section>
  )
}

type TeamSlideProps = {
  team: Team
  label: string
}

function TeamSlide({ team, label }: TeamSlideProps) {
  return (
    <motion.section
      animate={{ opacity: 1, scale: 1 }}
      className="slide team-slide"
      initial={{ opacity: 0, scale: 0.985 }}
      style={{ '--team-accent': team.accentColor } as CSSProperties}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <TeamThreeBackdrop accentColor={team.accentColor} />
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="team-slide-copy"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <SlideChrome eyebrow={label} title={team.name} />
        <p className="school-line">{team.school}</p>
      </motion.div>
      <div className="member-grid">
        {team.members.map((member, index) => (
          <motion.article
            animate={{
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              y: 0,
              z: 0,
            }}
            className="member-card"
            initial={{
              opacity: 0,
              rotateX: -34,
              rotateY: index === 1 ? 0 : index === 0 ? -18 : 18,
              scale: 0.82,
              y: 86,
              z: -180,
            }}
            key={member.name}
            transition={{
              damping: 16,
              delay: 0.16 + index * 0.12,
              stiffness: 118,
              type: 'spring',
            }}
            whileHover={{
              rotateX: -5,
              rotateY: index === 1 ? 0 : index === 0 ? -8 : 8,
              scale: 1.055,
              y: -18,
            }}
          >
            <span className="member-card-glow" aria-hidden="true" />
            <div className="avatar-pop">
              <img src={member.avatarUrl} alt={`${member.name} avatar`} />
            </div>
            <div className="member-info-pop">
              <h2>{member.name}</h2>
              <p>{member.school}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function TeamThreeBackdrop({ accentColor }: { accentColor: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    const group = new THREE.Group()
    const accent = new THREE.Color(accentColor)
    const ivory = new THREE.Color('#fff7e8')
    const gold = new THREE.Color('#d9a441')
    const geometries = [
      new THREE.IcosahedronGeometry(1.16, 1),
      new THREE.TorusKnotGeometry(0.62, 0.16, 96, 12),
      new THREE.OctahedronGeometry(0.86, 1),
    ]
    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: accent,
        metalness: 0.26,
        roughness: 0.34,
        transmission: 0.1,
        transparent: true,
        opacity: 0.8,
      }),
      new THREE.MeshPhysicalMaterial({
        color: gold,
        metalness: 0.42,
        roughness: 0.28,
        transparent: true,
        opacity: 0.76,
      }),
      new THREE.MeshPhysicalMaterial({
        color: ivory,
        metalness: 0.12,
        roughness: 0.4,
        transparent: true,
        opacity: 0.5,
      }),
    ]
    const meshes = geometries.map((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index])
      const x = index === 0 ? 3.9 : index === 1 ? -4.4 : 2.2
      const y = index === 0 ? 1.15 : index === 1 ? -1.6 : -2.15
      const scale = index === 0 ? 1.25 : index === 1 ? 1 : 0.8

      mesh.position.set(x, y, index === 1 ? -0.6 : 0)
      mesh.scale.setScalar(scale)
      group.add(mesh)

      return mesh
    })
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(96 * 3)

    for (let index = 0; index < particlePositions.length; index += 3) {
      particlePositions[index] = (Math.random() - 0.5) * 10
      particlePositions[index + 1] = (Math.random() - 0.5) * 5.2
      particlePositions[index + 2] = (Math.random() - 0.5) * 3
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      color: accent,
      size: 0.045,
      transparent: true,
      opacity: 0.42,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    const resizeRenderer = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    camera.position.set(0, 0, 7)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.setAttribute('aria-hidden', 'true')

    scene.add(group)
    scene.add(particles)
    scene.add(new THREE.AmbientLight('#fff7e8', 1.6))

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.5)
    const rimLight = new THREE.PointLight(accent, 26, 16)

    keyLight.position.set(-3, 4, 5)
    rimLight.position.set(3.5, 0.5, 3.5)
    scene.add(keyLight, rimLight)

    container.appendChild(renderer.domElement)
    resizeRenderer()

    const resizeObserver = new ResizeObserver(resizeRenderer)
    let frameId = 0
    let rotation = 0

    resizeObserver.observe(container)

    const renderScene = () => {
      rotation += 0.01
      group.rotation.y = rotation * 0.4
      particles.rotation.y = -rotation * 0.14

      for (const [index, mesh] of meshes.entries()) {
        mesh.rotation.x += 0.005 + index * 0.001
        mesh.rotation.y += 0.008 + index * 0.002
        mesh.position.y += Math.sin(rotation + index) * 0.0025
      }

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(renderScene)
    }

    renderScene()

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      container.removeChild(renderer.domElement)
      renderer.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()

      for (const geometry of geometries) {
        geometry.dispose()
      }

      for (const material of materials) {
        material.dispose()
      }
    }
  }, [accentColor])

  return <div className="team-three-backdrop" ref={containerRef} />
}

function VotesSlide({ state }: AppViewProps) {
  return (
    <section className="slide votes-slide">
      <SlideChrome eyebrow="Live decisions" title="Judge Votes" />
      <p className="vote-slide-note">Votes are displayed judge by judge. Team totals stay hidden until the final result slide.</p>
      <div className="vote-board">
        {presentationConfig.judges.map((judge) => {
          const vote = state.votes[judge.id]
          const team = presentationConfig.teams.find((candidate) => candidate.id === vote)
          const teamIndex = presentationConfig.teams.findIndex((candidate) => candidate.id === vote)
          const tone = teamIndex === 0 ? 'red' : teamIndex === 1 ? 'green' : 'pending'
          const isChanged = state.changedJudgeId === judge.id

          return (
            <article
              className={`vote-chip ${tone} ${isChanged ? 'changed' : ''}`}
              key={`${judge.id}-${isChanged ? state.updatedAt : 'stable'}`}
            >
              <span className="judge-name">{judge.name}</span>
              <strong>{team?.name ?? 'Awaiting vote'}</strong>
              <small>{team?.school ?? 'No decision submitted'}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ResultSlide({ votes }: { votes: Votes }) {
  const totals = calculateTotals(votes)
  const winner = getWinner(totals)
  const resultTitle = winner ? `${winner.name} Wins` : 'Tie Result'

  return (
    <section className="slide result-slide">
      <SlideChrome eyebrow="Final result" title={resultTitle} />
      <div className="result-stage">
        {presentationConfig.teams.map((team) => (
          <article
            className={winner?.id === team.id ? 'result-card winner' : 'result-card'}
            key={team.id}
            style={{ '--team-accent': team.accentColor } as CSSProperties}
          >
            <span>{team.name}</span>
            <strong>{totals[team.id]}</strong>
            <small>{totals[team.id] === 1 ? 'vote' : 'votes'}</small>
          </article>
        ))}
      </div>
      <p className="result-caption">
        {winner
          ? `${winner.school} takes the round by majority decision.`
          : 'Both teams received the same number of judge votes.'}
      </p>
    </section>
  )
}

type SlideChromeProps = {
  eyebrow: string
  title: string
}

function SlideChrome({ eyebrow, title }: SlideChromeProps) {
  return (
    <header className="slide-header">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{presentationConfig.eventTitle}</span>
    </header>
  )
}

export default App
