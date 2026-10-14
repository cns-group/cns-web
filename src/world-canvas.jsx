import React from 'react'

const TAU = Math.PI * 2

function seeded(index, salt = 0) {
  const value = Math.sin(index * 9283.17 + salt * 778.31) * 43758.5453
  return value - Math.floor(value)
}

export function WorldCanvas() {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let particles = []

    const createParticles = () => {
      const count = width < 700 ? 42 : 88
      particles = Array.from({ length: count }, (_, index) => ({
        x: seeded(index, 1),
        y: seeded(index, 2),
        depth: .35 + seeded(index, 3) * .95,
        phase: seeded(index, 4) * TAU,
        speed: .35 + seeded(index, 5) * .65,
        size: .55 + seeded(index, 6) * 1.35,
      }))
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles()
    }

    const onPointerMove = (event) => {
      pointer.tx = (event.clientX / width - .5) * 2
      pointer.ty = (event.clientY / height - .5) * 2
    }

    const draw = (time = 0) => {
      const seconds = time * .001
      const scroll = window.scrollY / Math.max(1, document.documentElement.scrollHeight - height)
      pointer.x += (pointer.tx - pointer.x) * .025
      pointer.y += (pointer.ty - pointer.y) * .025

      context.clearRect(0, 0, width, height)

      const glowX = width * (.74 + pointer.x * .025)
      const glowY = height * (.46 + pointer.y * .025)
      const glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * .48)
      glow.addColorStop(0, 'rgba(37, 164, 220, .16)')
      glow.addColorStop(.35, 'rgba(11, 95, 135, .08)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      const points = particles.map((particle) => {
        const drift = reduceMotion ? 0 : seconds * particle.speed
        const waveX = Math.sin(drift + particle.phase) * 22 * particle.depth
        const waveY = Math.cos(drift * .72 + particle.phase) * 15 * particle.depth
        const scrollShift = (scroll * height * .38) / particle.depth
        return {
          x: particle.x * width + waveX + pointer.x * 24 * particle.depth,
          y: ((particle.y * height + waveY - scrollShift) % (height + 100) + height + 100) % (height + 100) - 50,
          depth: particle.depth,
          size: particle.size,
        }
      })

      context.lineWidth = .65
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i]
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)
          const limit = width < 700 ? 112 : 154
          if (distance > limit) continue
          const alpha = (1 - distance / limit) * .17 * Math.min(a.depth, b.depth)
          context.strokeStyle = `rgba(86, 200, 246, ${alpha})`
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }

      for (const point of points) {
        const alpha = .25 + point.depth * .45
        context.fillStyle = `rgba(125, 211, 252, ${alpha})`
        context.beginPath()
        context.arc(point.x, point.y, point.size * point.depth, 0, TAU)
        context.fill()
      }

      context.save()
      context.translate(width * .72 + pointer.x * 12, height * .48 + pointer.y * 8)
      context.rotate(-.16 + Math.sin(seconds * .12) * .025)
      for (let ring = 0; ring < 5; ring += 1) {
        const radius = Math.min(width, height) * (.11 + ring * .055)
        context.strokeStyle = `rgba(56, 189, 248, ${.09 - ring * .012})`
        context.lineWidth = 1
        context.beginPath()
        context.ellipse(0, 0, radius * 1.7, radius * .58, 0, 0, TAU)
        context.stroke()
      }
      context.restore()

      if (!reduceMotion) raf = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    draw()

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="world-canvas" aria-hidden="true" />
}
