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

  const delay = Math.min(index * 70, 420)
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
