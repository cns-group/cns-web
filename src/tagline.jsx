import React from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** Frase grande que pasa de tono apagado a pleno, palabra por palabra, al cruzar la línea de activación. */
export function Tagline({ lines, label }) {
  const rootRef = React.useRef(null)

  React.useEffect(() => {
    const words = rootRef.current?.querySelectorAll('.tag-word')
    if (!words?.length) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      words.forEach((w) => w.classList.add('is-on'))
      return
    }
    // La palabra se activa al subir por encima del 70% del alto de la ventana, y no se apaga.
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add('is-on')
          obs.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0 })
    words.forEach((w) => obs.observe(w))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="manifesto" aria-label={label} ref={rootRef}>
      {lines.map((line) => (
        <p key={line}>
          {line.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              <span className="tag-word">{word}</span>{' '}
            </React.Fragment>
          ))}
        </p>
      ))}
    </section>
  )
}
