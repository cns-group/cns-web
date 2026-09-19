import React from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function useInView(options) {
  const ref = React.useRef(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px', ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, inView]
}

export const Reveal = React.forwardRef(function Reveal(
  { as: Tag = 'div', index = 0, variant = '', className = '', style, children, ...rest },
  forwardedRef,
) {
  const [ref, inView] = useInView()

  const setRefs = (node) => {
    ref.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  const delay = Math.min(index * 90, 540)
  const cls = ['reveal', variant && `reveal--${variant}`, inView && 'is-visible', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={setRefs}
      className={cls}
      style={{ ...style, transitionDelay: inView ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export function startParallax() {
  if (typeof window === 'undefined' || prefersReducedMotion()) return () => {}

  let ticking = false
  let raf = 0
  let nodes = []

  const collect = () => {
    nodes = Array.from(document.querySelectorAll('[data-parallax]'))
  }

  const tick = () => {
    ticking = false
    const vh = window.innerHeight || 1
    for (const el of nodes) {
      const speed = Number(el.getAttribute('data-parallax'))
      if (!Number.isFinite(speed) || speed === 0) continue
      const fromScroll = el.getAttribute('data-plx-from') === 'scroll'
      const host = el.parentElement || el
      const rect = host.getBoundingClientRect()
      if (!fromScroll && (rect.bottom < -200 || rect.top > vh + 200)) continue
      const raw = fromScroll
        ? window.scrollY * speed
        : (rect.top + rect.height / 2 - vh / 2) * speed
      const offset = fromScroll ? raw : Math.max(-88, Math.min(88, raw))
      const scale = el.getAttribute('data-plx-scale')
      el.style.transform = scale
        ? `translate3d(0, ${offset.toFixed(2)}px, 0) scale(${scale})`
        : `translate3d(0, ${offset.toFixed(2)}px, 0)`
    }
  }

  const requestTick = () => {
    if (ticking) return
    ticking = true
    raf = requestAnimationFrame(tick)
  }

  const onResize = () => {
    collect()
    requestTick()
  }

  collect()
  tick()
  window.addEventListener('scroll', requestTick, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', requestTick)
    window.removeEventListener('resize', onResize)
  }
}
