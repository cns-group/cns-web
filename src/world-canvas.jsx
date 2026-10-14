import React from 'react'

const TAU = Math.PI * 2
const SPACING = 38

/** Fondo interactivo: una malla de puntos que se deforma con el cursor, ondula sola y responde a los clics. */
export function WorldCanvas() {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: 0 }
    const ripples = []
    let width = 0
    let height = 0
    let raf = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (event) => {
      if (pointer.tx < -9000) { pointer.x = event.clientX; pointer.y = event.clientY }
      pointer.tx = event.clientX
      pointer.ty = event.clientY
    }
    const onLeave = () => { pointer.tx = -9999; pointer.ty = -9999 }
    const onDown = (event) => {
      ripples.push({ x: event.clientX, y: event.clientY, born: performance.now() })
      if (ripples.length > 6) ripples.shift()
    }

    const draw = (time = 0) => {
      const seconds = time * .001
      const scrollY = window.scrollY
      pointer.x += (pointer.tx - pointer.x) * .12
      pointer.y += (pointer.ty - pointer.y) * .12
      const hasPointer = pointer.tx > -9000
      pointer.active += ((hasPointer ? 1 : 0) - pointer.active) * .08

      context.clearRect(0, 0, width, height)

      const offsetY = -(scrollY * .25) % SPACING
      const cols = Math.ceil(width / SPACING) + 2
      const rows = Math.ceil(height / SPACING) + 3
      const radius = 190
      const now = performance.now()

      for (let r = -1; r < rows; r += 1) {
        for (let c = -1; c < cols; c += 1) {
          const bx = c * SPACING
          const by = r * SPACING + offsetY
          const wave = reduceMotion ? 0 : Math.sin(seconds * .7 + bx * .012 + by * .009)
          let x = bx + wave * 3
          let y = by + Math.cos(seconds * .6 + bx * .008 - by * .011) * (reduceMotion ? 0 : 3)
          let glow = 0

          if (pointer.active > .01) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            const dist = Math.hypot(dx, dy)
            if (dist < radius) {
              const f = (1 - dist / radius) ** 2
              const push = f * 26 * pointer.active
              x += (dx / (dist || 1)) * push
              y += (dy / (dist || 1)) * push
              glow = f * pointer.active
            }
          }

          for (const ripple of ripples) {
            const age = (now - ripple.born) / 1000
            if (age > 1.8) continue
            const dx = x - ripple.x
            const dy = y - ripple.y
            const dist = Math.hypot(dx, dy)
            const front = age * 420
            const band = Math.max(0, 1 - Math.abs(dist - front) / 70)
            if (band > 0) {
              const k = band * (1 - age / 1.8)
              x += (dx / (dist || 1)) * k * 16
              y += (dy / (dist || 1)) * k * 16
              glow = Math.max(glow, k)
            }
          }

          const alpha = .16 + glow * .7
          const size = .9 + glow * 2.2
          context.fillStyle = `rgba(125, 211, 252, ${alpha})`
          context.beginPath()
          context.arc(x, y, size, 0, TAU)
          context.fill()
        }
      }

      if (!reduceMotion) raf = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    draw()

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="world-canvas" aria-hidden="true" />
}
