import { motion } from 'motion/react'
import { SlideChrome } from '../layout/SlideChrome'
import type { MatchData } from '../domain/types'

type JudgesSlideProps = {
  match: MatchData
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
}

export function JudgesSlide({ match }: JudgesSlideProps) {
  return (
    <motion.section
      animate="animate"
      className="slide judges-slide relative overflow-hidden bg-[radial-gradient(circle_at_top,#3b2f12_0%,#111827_42%,#020617_100%)] text-white"
      initial="initial"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05),transparent_35%,transparent_70%,rgba(251,191,36,0.05))]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="slide-safe relative z-10">
        <div className="font-serif [&_.slide-title]:text-white [&_.slide-title]:font-black [&_.slide-title]:tracking-[0.18em] [&_.slide-title]:drop-shadow-xl">
          <SlideChrome eyebrow="" title="评审介绍" meta="" />
        </div>

        <div className="mx-auto mt-4 h-px w-36 bg-linear-to-r from-transparent via-amber-300/70 to-transparent" />

        <motion.div
          variants={containerVariants}
          className="mt-12 grid grid-cols-5 gap-7"
        >
          {match.judges.map((judge) => (
            <motion.article
              className="group relative aspect-2/3 min-w-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.42)] ring-1 ring-white/10 backdrop-blur-xl transition-colors duration-300 hover:border-amber-300/40"
              key={judge.id}
              variants={cardVariants}
            >
              <img
                alt={judge.displayName}
                className="absolute inset-0 h-full w-full object-cover brightness-90 transition-[filter] duration-300 group-hover:brightness-100"
                src={`https://i.pravatar.cc/300?u=${judge.id}`}
              />

              <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/85" />

              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end px-5 pb-8 pt-24 text-center">
                <span className="mb-4 h-px w-10 bg-amber-300/80" />

                <span className="font-luxury mb-2 rounded-full border border-amber-300/25 bg-black/25 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-amber-200/90 backdrop-blur-sm">
                  Official Judge
                </span>

                <strong className="font-serif block break-anywhere text-3xl font-bold tracking-[0.16em] text-white drop-shadow-xl">
                  {judge.displayName}
                </strong>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}