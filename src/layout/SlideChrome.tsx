type SlideChromeProps = {
  eyebrow: string
  title: string
  meta?: string
  tone?: 'paper' | 'dark'
}

export function SlideChrome({ eyebrow, title, meta, tone = 'paper' }: SlideChromeProps) {
  return (
    <header className={`slide-chrome ${tone}`}>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      {meta ? <span>{meta}</span> : null}
    </header>
  )
}
