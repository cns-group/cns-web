import React from 'react'
import { Reveal, useInView } from './reveal'
import { SectionHeader } from './sections-mid'
import { scrollToSection } from './scroll'
import { WHATSAPP_URL } from './constants'
import { track } from './analytics'
import './tutorial.css'

const AUTOPLAY_MS = 8000

const OPCIONES = [
  { label: 'Sistema a medida', msg: 'Hola, quiero un sistema a medida para mi negocio y me gustaría coordinar una videollamada.' },
  { label: 'Automatizar procesos', msg: 'Hola, quiero automatizar procesos de mi negocio (tareas manuales, planillas, avisos) y coordinar una videollamada.' },
  { label: 'Ecommerce', msg: 'Hola, me interesa un sistema de ecommerce y quiero coordinar la videollamada.' },
  { label: 'Turnero', msg: 'Hola, me interesa un turnero y quiero coordinar la videollamada.' },
  { label: 'Gimnasio', msg: 'Hola, me interesa un sistema para gimnasio y quiero coordinar la videollamada.' },
  { label: 'Gastronomía', msg: 'Hola, me interesa un sistema de gastronomía y quiero coordinar la videollamada.' },
]

const STEPS = [
  {
    id: 'elegir',
    tab: 'Contanos',
    when: 'Día 1',
    title: 'Nos contás qué querés resolver',
    body: 'Sistema a medida, automatización o uno de nuestros sistemas listos. Escribinos por WhatsApp.',
    ask: ['automatizar', 'soluciones'],
  },
  {
    id: 'kickoff',
    tab: 'Auditoría gratis',
    when: 'Día 1 · 15 minutos',
    title: 'Auditoría gratis de tu negocio',
    body: '15 minutos por videollamada, totalmente gratis, para revisar tu negocio y ver qué se puede automatizar.',
    ask: ['auditoria', 'precio'],
  },
  {
    id: 'demo',
    tab: 'Demo y diseño',
    when: 'En 2 días',
    title: 'Ves tu demo con tu marca',
    body: 'Validamos con usuarios reales y integramos tu plan. El sistema lleva tu logo y tus colores: tus clientes ven tu marca, no la nuestra.',
    ask: ['marca', 'pagos'],
  },
  {
    id: 'construccion',
    tab: 'Construcción',
    when: 'Iteramos online',
    title: 'Mirás el avance y opinás',
    body: 'Mostramos avances reales, vos probás, pedís cambios y ajustamos. Iteramos online hasta que estés completamente satisfecho.',
    ask: ['plazo', 'medida'],
  },
  {
    id: 'produccion',
    tab: 'En producción',
    when: 'Puesta en marcha',
    title: 'Sistema andando y acompañamiento',
    body: 'Te capacitamos con tu sistema ya en producción. Una vez que está listo, podés sumar la consultoría de crecimiento de tu negocio.',
    ask: ['soporte', 'dominio'],
  },
]

/* ── Respuestas: salen de lo que ya dice el sitio, sin inventar condiciones ── */
const KB = [
  {
    id: 'precio',
    q: '¿Cuánto sale un proyecto?',
    kw: ['cuanto sale', 'precio', 'cuesta', 'costo', 'valor', 'presupuesto', 'abono', 'mensual', 'cobran', 'tarifa'],
    a: 'Cada solución tiene un precio distinto según el plan que elijas. Todos suman un costo de configuración anual de 25.000 pesos, aparte de nuestro trabajo. Las comisiones de las pasarelas de pago no están incluidas.',
    go: { id: 'planes', label: 'Ver los planes' },
  },
  {
    id: 'auditoria',
    q: '¿Qué es la auditoría gratis de 15 minutos?',
    kw: ['auditoria', 'gratis', 'gratuit', 'sin costo', 'reunion', 'revisar', 'diagnostico', '15 minutos'],
    a: 'Es una videollamada de 15 minutos, totalmente gratis, donde revisamos tu negocio: cómo trabajás hoy y qué se puede mejorar o automatizar. Escribinos por WhatsApp y la agendamos.',
    go: { id: 'contacto', label: 'Pedir mi auditoría' },
  },
  {
    id: 'plazo',
    q: '¿Cuánto tardan en entregarlo?',
    kw: ['cuanto tard', 'tiempo', 'plazo', 'demora', 'semanas', 'entrega', 'rapido', 'cuando estaria', 'listo'],
    a: 'Tu demo la ves en 2 días. Después iteramos con vos hasta que esté a tu gusto y lo ponemos en producción; el plazo final depende de lo que construyamos. No se termina ahí: seguimos acompañándote mes a mes.',
  },
  {
    id: 'remoto',
    q: '¿Trabajan presencial o solo remoto?',
    kw: ['remoto', 'presencial', 'videollamada', 'reunion', 'zoom', 'meet', 'a distancia', 'online', 'donde estan', 'visitar'],
    a: 'Somos 100% remotos. Kickoff por videollamada, iteramos online y entregamos el sistema andando, estés donde estés.',
  },
  {
    id: 'dominio',
    q: '¿El dominio es mío?',
    kw: ['dominio', 'hosting', 'alojamiento', 'servidor', 'url', 'direccion web', 'pagina web'],
    a: 'Sí. El costo de configuración anual incluye tu dominio y el hosting mientras trabajemos juntos. El dominio queda a tu nombre y te lo llevás si algún día te vas.',
  },
  {
    id: 'soporte',
    q: '¿Hacen mantenimiento después?',
    kw: ['mantenimiento', 'soporte', 'despues', 'acompan', 'ayuda', 'problema', 'error', 'falla', 'seguimiento', 'crecer'],
    a: 'Sí, todos los planes tienen soporte personalizado. Y una vez que el sistema está listo, podés contratar la consultoría de crecimiento de tu negocio.',
  },
  {
    id: 'pagos',
    q: '¿Cómo cobran mis clientes?',
    kw: ['mercado pago', 'mercadopago', 'tarjeta', 'cobrar', 'cobro', 'transferencia', 'efectivo', 'pasarela', 'comision', 'pagar', 'pagos', 'visa'],
    a: 'Con Mercado Pago, tarjetas argentinas (Visa, Mastercard, Amex, Naranja, Cabal) y transferencia CBU/CVU. Activamos lo que tu negocio necesite. Cobrás con tu propio Mercado Pago: la plata va directo a tu cuenta.',
  },
  {
    id: 'marca',
    q: '¿El sistema lleva mi marca?',
    kw: ['marca', 'logo', 'colores', 'mi nombre', 'personalizado', 'diseno', 'identidad', 'propio', 'mio'],
    a: 'Sí. El sistema lleva tu logo, tus colores y tu sitio. Tus clientes ven tu marca, no la nuestra.',
  },
  {
    id: 'medida',
    q: '¿Y si necesito algo que no está en la lista?',
    kw: ['a medida', 'medida', 'especial', 'particular', 'custom', 'distinto', 'otro sistema', 'desde cero', 'no esta en', 'otra cosa'],
    a: 'Lo charlamos. Contanos qué necesitás y lo diseñamos y construimos desde cero, con alcance claro y cotización fija. Puede implicar costos extra según la complejidad.',
    go: { id: 'desarrollo-a-medida', label: 'Ver desarrollo a medida' },
  },
  {
    id: 'automatizar',
    q: '¿Pueden automatizar procesos de mi negocio?',
    kw: ['automat', 'proceso', 'planilla', 'excel', 'manual', 'integrar', 'integracion', 'bot', 'avisos', 'repetitivo'],
    a: 'Sí. Vemos cómo trabajás hoy, detectamos las tareas manuales que más tiempo te llevan y las automatizamos con un sistema hecho a tu medida. Lo charlamos en la videollamada.',
    go: { id: 'desarrollo-a-medida', label: 'Ver desarrollo a medida' },
  },
  {
    id: 'soluciones',
    q: '¿Qué sistemas hacen?',
    kw: ['que hacen', 'sistemas', 'soluciones', 'ecommerce', 'tienda', 'turnero', 'turnos', 'gimnasio', 'gym', 'restaurante', 'gastro', 'clinica', 'pos', 'ticket', 'landing', 'servicios'],
    a: 'Hacemos sistemas a medida y automatizaciones, y además tenemos sistemas listos para usar: ecommerce, gimnasios, turneros, landing pro, e-ticketera, gastronomía, clínica médica y sistema POS. Cada uno viene en tres tamaños: empezás con lo que necesitás hoy y escalás cuando haga falta.',
    go: { id: 'planes', label: 'Ver los planes' },
  },
  {
    id: 'empezar',
    q: '¿Cómo empiezo?',
    kw: ['empezar', 'empiezo', 'arrancar', 'contratar', 'primer paso', 'contacto', 'contactar', 'quiero', 'hablar', 'escribir', 'whatsapp'],
    a: 'Escribinos por WhatsApp contando qué necesitás. Respondemos en el día y agendamos una auditoría gratis de 15 minutos de tu negocio, por videollamada.',
    go: { id: 'contacto', label: 'Pedir mi auditoría gratis' },
  },
  {
    id: 'cancelar',
    q: '¿Puedo cancelar cuando quiera?',
    kw: ['cancelar', 'contrato', 'permanencia', 'baja', 'irme', 'salir', 'compromiso', 'mes a mes'],
    a: 'Vamos juntos mes a mes y cancelás cuando quieras.',
  },
  {
    id: 'tecnologia',
    q: '¿Con qué tecnología trabajan?',
    kw: ['tecnologia', 'stack', 'react', 'angular', 'node', 'lenguaje', 'programan', 'base de datos', 'postgres', 'typescript'],
    a: 'Herramientas estables, no la moda del mes: TypeScript, React y Angular, Node.js con NestJS, PostgreSQL, Docker y Cloudinary. Es lo que usamos en los sistemas que ya están en producción.',
  },
  {
    id: 'casos',
    q: '¿Tienen casos reales?',
    kw: ['casos', 'clientes', 'ejemplos', 'trabajos', 'portfolio', 'referencias', 'hicieron', 'experiencia'],
    a: 'Sí: Impacto Tienda, Barbería Authentic, Hangar Fitness, Velvet Travel, Patagonia Inquieta y Barriola Constructora, entre otros. Todos entregados en remoto y funcionando.',
    go: { id: 'casos', label: 'Ver los casos' },
  },
]

const KB_BY_ID = Object.fromEntries(KB.map((k) => [k.id, k]))
const SUGERIDAS = ['precio', 'plazo', 'remoto', 'dominio', 'soporte', 'pagos']

const norm = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:]/g, ' ')

function buscar(texto) {
  const t = ` ${norm(texto).replace(/\s+/g, ' ')} `
  let best = null
  let bestScore = 0
  for (const k of KB) {
    const score = k.kw.reduce((acc, word) => {
      const w = norm(word).trim()
      const hit = w.length <= 4 ? t.includes(` ${w} `) : t.includes(w)
      return acc + (hit ? 1 : 0)
    }, 0)
    if (score > bestScore) {
      best = k
      bestScore = score
    }
  }
  return best
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/* ── Visuales de cada paso (se re-montan al cambiar de paso para repetir la animación) ── */
function VisualElegir() {
  const [sel, setSel] = React.useState(0)
  const op = OPCIONES[sel]
  return (
    <div className="tv tv-pick">
      <div className="tv-label">Tocá lo que necesitás</div>
      <div className="tv-chips">
        {OPCIONES.map((o, i) => (
          <button key={o.label} type="button" className={`tv-chip${i === sel ? ' on' : ''}`} onClick={() => setSel(i)}>
            {o.label}
          </button>
        ))}
      </div>
      <div className="tv-bubble" key={sel}>{op.msg}</div>
      <a
        className="btn btn-ghost tv-wa"
        href={`${WHATSAPP_URL}?text=${encodeURIComponent(op.msg)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Probarlo en WhatsApp
      </a>
    </div>
  )
}

function VisualKickoff() {
  const items = ['Cómo trabajás hoy', 'Qué tareas te llevan más tiempo', 'Qué se puede automatizar', 'Qué querés ver en tu demo']
  return (
    <div className="tv tv-call">
      <div className="tv-badge">Gratis · 15 min</div>
      <div className="tv-tiles">
        <div className="tv-tile"><span className="tv-avatar">VOS</span><i className="tv-live" /></div>
        <div className="tv-tile"><span className="tv-avatar tv-avatar--cns">CNS</span><i className="tv-live" /></div>
      </div>
      <ul className="tv-check">
        {items.map((t, i) => (
          <li key={t} style={{ '--d': `${0.5 + i * 0.9}s` }}>
            <span className="tv-tick" aria-hidden="true">✓</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

const SWATCHES = [
  ['#0e82ec', 'Azul'],
  ['#16a34a', 'Verde'],
  ['#f97316', 'Naranja'],
  ['#a855f7', 'Violeta'],
]

function VisualDemo() {
  const [color, setColor] = React.useState(SWATCHES[0][0])
  return (
    <div className="tv tv-demo" style={{ '--brand': color }}>
      <div className="tv-label">Elegí el color de tu marca</div>
      <div className="tv-swatches">
        {SWATCHES.map(([c, name]) => (
          <button
            key={c}
            type="button"
            className={`tv-swatch${c === color ? ' on' : ''}`}
            style={{ background: c }}
            aria-label={name}
            aria-pressed={c === color}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="tv-browser">
        <div className="tv-browser-bar"><i /><i /><i /><span>tumarca.com</span></div>
        <div className="tv-browser-body">
          <div className="tv-logo">TU LOGO</div>
          <div className="tv-hero-line" />
          <div className="tv-hero-line short" />
          <div className="tv-cards"><b /><b /><b /></div>
          <div className="tv-btn">Reservar</div>
        </div>
      </div>
    </div>
  )
}

function VisualConstruccion() {
  const bars = [
    ['Catálogo y panel', 100],
    ['Cobros online', 72],
    ['Tu feedback aplicado', 45],
  ]
  return (
    <div className="tv tv-build">
      {bars.map(([l, w], i) => (
        <div className="tv-bar" key={l} style={{ '--w': `${w}%`, '--d': `${i * 0.35}s` }}>
          <div className="tv-bar-hd"><span>{l}</span><b>{w}%</b></div>
          <div className="tv-bar-track"><div className="tv-bar-fill" /></div>
        </div>
      ))}
      <div className="tv-thread">
        <div className="tv-bubble tv-bubble--in" style={{ '--d': '1.2s' }}>¿Podemos mover este botón arriba?</div>
        <div className="tv-bubble tv-bubble--out" style={{ '--d': '2.2s' }}>Listo, ya lo ves en la demo ✓</div>
      </div>
    </div>
  )
}

function VisualProduccion() {
  const items = ['Dominio a tu nombre', 'Tu Mercado Pago conectado', 'Capacitación con tu producto', 'En producción']
  return (
    <div className="tv tv-launch">
      <ul className="tv-check">
        {items.map((t, i) => (
          <li key={t} style={{ '--d': `${0.4 + i * 0.7}s` }}>
            <span className="tv-tick" aria-hidden="true">✓</span>
            {t}
          </li>
        ))}
      </ul>
      <div className="tv-months">
        {['Mes 1', 'Mes 2', 'Mes 3'].map((m, i) => (
          <div key={m} style={{ '--d': `${3.4 + i * 0.4}s` }}><b>{m}</b><span>Soporte</span></div>
        ))}
      </div>
      <div className="tv-opt">Opcional: consultoría de crecimiento del negocio</div>
    </div>
  )
}

const VISUALS = {
  elegir: VisualElegir,
  kickoff: VisualKickoff,
  demo: VisualDemo,
  construccion: VisualConstruccion,
  produccion: VisualProduccion,
}

/* ── Sección ── */
export function Tutorial() {
  const [active, setActive] = React.useState(0)
  const [auto, setAuto] = React.useState(true)
  const [viewRef, inView] = useInView()
  const chatRef = React.useRef(null)
  const bodyRef = React.useRef(null)
  const timers = React.useRef([])
  const idRef = React.useRef(1)
  const [typing, setTyping] = React.useState(false)
  const [text, setText] = React.useState('')
  const [messages, setMessages] = React.useState([
    {
      id: 0,
      who: 'bot',
      text: 'Hola. Acá van las respuestas rápidas: tocá una pregunta o escribí la tuya. Si no la tengo a mano, te paso con una persona por WhatsApp.',
    },
  ])

  const reduced = React.useMemo(prefersReducedMotion, [])

  React.useEffect(() => {
    if (!auto || !inView || reduced) return
    const t = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [auto, inView, active, reduced])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  React.useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const pick = (i) => {
    setAuto(false)
    setActive(i)
    track('tutorial_step', { paso: STEPS[i].id })
  }

  const ask = React.useCallback((question, { origen, kb } = {}) => {
    const q = question.trim()
    if (!q) return
    const hit = kb || buscar(q)
    track('ask_question', { origen: origen || 'texto', tema: hit ? hit.id : 'sin_respuesta' })
    setMessages((m) => [...m, { id: idRef.current++, who: 'me', text: q }])
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        hit
          ? { id: idRef.current++, who: 'bot', text: hit.a, go: hit.go }
          : {
              id: idRef.current++,
              who: 'bot',
              text: 'Esa no la tengo a mano. Escribinos por WhatsApp y te respondemos en el día.',
              wa: true,
            },
      ])
    }, reduced ? 0 : 700)
    timers.current.push(t)
  }, [reduced])

  const askFromStep = (kbId) => {
    const k = KB_BY_ID[kbId]
    ask(k.q, { origen: 'paso', kb: k })
    chatRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const step = STEPS[active]
  const Visual = VISUALS[step.id]

  return (
    <section className="sec tut" id="proceso" ref={viewRef}>
      <SectionHeader
        eyebrow="02 — Cómo trabajamos"
        title="Así trabajamos,"
        titleEm="paso a paso"
        lead="De la primera videollamada a tu sistema andando, con tu demo lista en 2 días. Tocá cada paso para verlo en acción."
      />

      <Reveal as="div" className="tut-stage">
        <div className="tut-tabs" role="tablist" aria-label="Pasos del proceso">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tut-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="tut-panel"
              className={`tut-tab${i === active ? ' on' : ''}${i < active ? ' done' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="tut-tab-n">{i + 1}</span>
              <span className="tut-tab-t">{s.tab}</span>
              {i === active && auto && inView && !reduced && (
                <i className="tut-tab-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
              )}
            </button>
          ))}
        </div>

        <div className="tut-panel" id="tut-panel" role="tabpanel" aria-labelledby={`tut-tab-${step.id}`}>
          <div className="tut-copy" key={step.id}>
            <div className="tut-when">{step.when}</div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <div className="tut-ask">
              <span>Lo que suelen preguntar acá</span>
              {step.ask.map((id) => (
                <button key={id} type="button" className="tv-chip" onClick={() => askFromStep(id)}>
                  {KB_BY_ID[id].q}
                </button>
              ))}
            </div>
            <div className="tut-nav">
              <button type="button" className="btn btn-ghost" disabled={active === 0} onClick={() => pick(active - 1)}>
                Anterior
              </button>
              {active < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={() => pick(active + 1)}>
                  Siguiente paso
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => scrollToSection('planes')}>
                  Elegir mi plan
                </button>
              )}
            </div>
          </div>
          <div className="tut-visual" key={`v-${step.id}`}>
            <Visual />
          </div>
        </div>
      </Reveal>

      <Reveal as="div" className="tut-chat" ref={chatRef} id="preguntas">
        <div className="tut-chat-hd">
          <div>
            <div className="sec-num">Preguntas</div>
            <h3>Preguntanos lo que quieras</h3>
          </div>
          <div className="tv-chips">
            {SUGERIDAS.map((id) => (
              <button
                key={id}
                type="button"
                className="tv-chip"
                onClick={() => ask(KB_BY_ID[id].q, { origen: 'sugerida', kb: KB_BY_ID[id] })}
              >
                {KB_BY_ID[id].q}
              </button>
            ))}
          </div>
        </div>

        <div className="tut-log" ref={bodyRef} role="log" aria-live="polite" aria-label="Conversación">
          {messages.map((m) => (
            <div key={m.id} className={`tut-msg tut-msg--${m.who}`}>
              <p>{m.text}</p>
              {m.go && (
                <button type="button" className="tut-link" onClick={() => scrollToSection(m.go.id)}>
                  {m.go.label} →
                </button>
              )}
              {m.wa && (
                <a className="tut-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp →
                </a>
              )}
            </div>
          ))}
          {typing && (
            <div className="tut-msg tut-msg--bot tut-typing" aria-label="Escribiendo">
              <i /><i /><i />
            </div>
          )}
        </div>

        <form
          className="tut-form"
          onSubmit={(e) => {
            e.preventDefault()
            ask(text, { origen: 'texto' })
            setText('')
          }}
        >
          <input
            type="text"
            value={text}
            maxLength={140}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí tu pregunta, por ejemplo: ¿hacen turnero para una barbería?"
            aria-label="Tu pregunta"
          />
          <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
            Preguntar
          </button>
        </form>
      </Reveal>
    </section>
  )
}
