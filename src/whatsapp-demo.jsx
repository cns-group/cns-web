import React from 'react'

const SCRIPT = [
  { sender: 'their', text: 'Hola, ¿qué auriculares tenés? Busco algo bueno.' },
  { sender: 'own',   text: 'Hola! Tengo varias categorías: económicos, gama media y premium. ¿Qué tipo buscás?' },
  { sender: 'their', text: 'Algo de buena calidad, me interesa Sony.' },
  { sender: 'own',   text: 'Perfecto, te recomiendo los Sony WH-1000XM5, tienen cancelación de ruido top y excelente sonido.' },
  { sender: 'their', text: '¿Y la batería qué tal?' },
  { sender: 'own',   text: 'Dura hasta 30 horas y carga rápido. Es de lo mejor en el mercado. ¿Te lo reservo?' },
  { sender: 'their', text: 'Dale, me convenciste 👍' },
]

function formatTime(i) {
  const totalMin = 8 * 60 + 42 + i * 2
  const hh24 = Math.floor(totalMin / 60) % 24
  const mm = totalMin % 60
  const period = hh24 >= 12 ? 'p.m.' : 'a.m.'
  let hh12 = hh24 % 12
  if (hh12 === 0) hh12 = 12
  const hhStr = hh12 < 10 ? '0' + hh12 : String(hh12)
  const mmStr = mm < 10 ? '0' + mm : String(mm)
  return `${hhStr}:${mmStr} ${period}`
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function WhatsAppDemo({ compact = false }) {
  const [shown, setShown] = React.useState([])
  const [typingSide, setTypingSide] = React.useState(null)
  const [fading, setFading] = React.useState(false)
  const bodyRef = React.useRef(null)
  const timers = React.useRef([])

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(SCRIPT.map((m, i) => ({ ...m, id: i, time: formatTime(i) })))
      return
    }

    const schedule = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timers.current.push(id)
      return id
    }

    function playFrom(i) {
      if (i >= SCRIPT.length) {
        schedule(resetAndReplay, 2800)
        return
      }
      const msg = SCRIPT[i]
      setTypingSide(msg.sender)
      const typingTime = Math.min(1700, 550 + msg.text.length * 16)
      schedule(() => {
        setTypingSide(null)
        setShown((s) => [...s, { ...msg, id: i, time: formatTime(i) }])
        schedule(() => playFrom(i + 1), 480)
      }, typingTime)
    }

    function resetAndReplay() {
      setFading(true)
      schedule(() => {
        setShown([])
        setTypingSide(null)
        setFading(false)
        schedule(() => playFrom(0), 450)
      }, 500)
    }

    playFrom(0)
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [shown, typingSide])

  return (
    <div className={`wa-card${compact ? ' wa-card--compact' : ''}${fading ? ' wa-card--fading' : ''}`} aria-hidden="true">
      <div className="wa-header">
        <svg className="wa-icon-btn" viewBox="0 0 24 24" fill="none">
          <path d="M15 5L8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="wa-id">
          <span className="wa-name">Cliente</span>
          <span className="wa-status">+54 9 11 5555-0123</span>
        </div>
        <div className="wa-icons">
          <svg className="wa-icon-btn" viewBox="0 0 24 24" fill="none">
            <path d="M3 7.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V9H3V7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M4 9h16v8.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5V9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M10 12.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <div className="wa-icon-hi">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 19V6M12 6l-5 5M12 6l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <svg className="wa-icon-btn" viewBox="0 0 24 24" fill="none">
            <path d="M5 7h14M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7M7 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="wa-icon-btn" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="wa-body" ref={bodyRef}>
        {shown.map((m) => (
          <div key={m.id} className={`wa-row${m.sender === 'own' ? ' wa-own' : ' wa-their'}`}>
            <div className="wa-bubble-wrap">
              <div className="wa-bubble">
                <span>{m.text}</span>
                <div className="wa-meta">
                  <span className="wa-time">{m.time}</span>
                  {m.sender === 'own' && <span className="wa-status-label">· enviado</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {typingSide && (
          <div className={`wa-row${typingSide === 'own' ? ' wa-own' : ' wa-their'}`}>
            <div className={`wa-typing${typingSide === 'own' ? ' wa-typing--own' : ''}`}>
              <span className="wa-dot" /><span className="wa-dot" /><span className="wa-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="wa-footer">
        <div className="wa-input">Escribí un mensaje</div>
        <div className="wa-send">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 11l17-8-7 17-3-7-7-2Z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  )
}
