import React from 'react'
import { api } from '../api'
import { useAuth } from '../auth'
import { Badge, Btn, Card, ErrorBox, Field, Modal, PageHeader, Select } from '../components'
import {
  alCambiarVoces,
  crearDictado,
  crearLocutor,
  detenerVoz,
  esNatural,
  extraerOraciones,
  hablar,
  hayDictado,
  hayVoz,
  esVozMasculina,
  TONO_GRAVE,
  vocesEspanol,
} from '../voz'

const PREFS_KEY = 'cns_entrenador_prefs'
const NIVELES = { amigable: 'Amigable', normal: 'Normal', duro: 'Duro' }

function leerPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
  } catch {
    return {}
  }
}

function guardarPrefs(p) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p))
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

const SUGERENCIAS_COACH = [
  'Un cliente me dice "es caro". ¿Qué le contesto?',
  '¿Cómo hago para que me diga cuál es su problema real?',
  '¿Cómo cierro una venta después de la auditoría gratis?',
]

const FRASE_DE_PRUEBA =
  'Hola Mario, así voy a sonar. Por ejemplo: la auditoría dura 15 minutos y el sistema sale $150.000 por mes. ¿Te parece bien?'

const AVATAR_CLIPS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/avatar/avatar-${n}.mp4`)
/** Clips de silencio: cuando la IA no habla (esperando, escuchando o pensando) se reproduce uno al azar, y al terminar otro (si falta alguno, se ignora). */
const AVATAR_SILENCIO = [1, 2, 3].map((n) => `/avatar/silencio-${n}.mp4`)

function mezclar(n, evitar) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  if (a[a.length - 1] === evitar && n > 1) [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]] // el primero en salir (el último del arreglo) no repite el anterior
  return a
}

/**
 * Avatar del cliente. Mientras la IA habla reproduce sus clips uno tras otro, en orden aleatorio sin repetir hasta usar los 8, a la
 * velocidad de la voz y con un fundido corto entre clip y clip. Cada clip termina con la boca cerrada: si la IA calla a mitad de un clip,
 * ese clip se termina solo (no se pausa ni se corta). Mientras calla (espera, escucha o piensa) pasa clips de silencio al azar, uno
 * tras otro sin repetir el anterior; si no existen en /avatar, queda en el último cuadro del clip.
 */
function AvatarCliente({ hablando, velocidad = 1 }) {
  const [actual, setActual] = React.useState(0)
  const [enCurso, setEnCurso] = React.useState(false) // hay un clip de habla reproduciéndose
  const [idleOn, setIdleOn] = React.useState(null) // índice del clip de silencio visible (null = se ve un clip de habla)
  const [disponibles, setDisponibles] = React.useState(() => new Set())
  const refs = React.useRef([])
  const idleRefs = React.useRef([])
  const ultimoSilencioRef = React.useRef(-1)
  const activoRef = React.useRef(hablando)
  const actualRef = React.useRef(0)
  const corriendoRef = React.useRef(false)
  const velocidadRef = React.useRef(velocidad)
  const bolsaRef = React.useRef([])
  activoRef.current = hablando
  velocidadRef.current = velocidad

  const siguiente = React.useCallback(() => {
    if (!bolsaRef.current.length) bolsaRef.current = mezclar(AVATAR_CLIPS.length, actualRef.current)
    return bolsaRef.current.pop()
  }, [])

  const arrancar = React.useCallback((i) => {
    const v = refs.current[i]
    if (!v) return
    actualRef.current = i
    setActual(i)
    setIdleOn(null)
    idleRefs.current.forEach((x) => x && x.pause())
    v.currentTime = 0
    v.playbackRate = velocidadRef.current
    corriendoRef.current = true
    setEnCurso(true)
    v.play().catch(() => {}) // si falla, el vigilante de abajo lo reintenta
  }, [])

  // Empieza a hablar con el avatar en reposo: arranca un clip.
  React.useEffect(() => {
    if (hablando && !corriendoRef.current) arrancar(siguiente())
  }, [hablando, arrancar, siguiente])

  // La velocidad de la voz también acelera o frena el clip que está sonando.
  React.useEffect(() => {
    const v = refs.current[actualRef.current]
    if (v) v.playbackRate = velocidad
  }, [velocidad])

  // Elige al azar un clip de silencio (distinto del anterior si hay más de uno) y lo reproduce.
  const elegirSilencio = React.useCallback(() => {
    const ok = AVATAR_SILENCIO.map((_, i) => i).filter((i) => disponibles.has(i))
    if (!ok.length) {
      setIdleOn(null)
      return
    }
    const otros = ok.filter((i) => i !== ultimoSilencioRef.current)
    const lista = otros.length ? otros : ok
    const i = lista[Math.floor(Math.random() * lista.length)]
    ultimoSilencioRef.current = i
    setIdleOn(i)
    idleRefs.current.forEach((v, k) => {
      if (!v) return
      if (k === i) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else v.pause()
    })
  }, [disponibles])

  // Sin hablar: arranca un clip de silencio si no hay ninguno en pantalla.
  React.useEffect(() => {
    if (corriendoRef.current) return // se mira la referencia: el estado puede ir un render atrás y pisar el arranque de un clip
    if (idleOn === null) elegirSilencio()
  }, [enCurso, idleOn, disponibles, elegirSilencio])

  // Si el navegador frena un clip a medias (por ejemplo al cambiar de pestaña), se retoma: un clip no se corta.
  const retomar = React.useCallback(() => {
    const v = refs.current[actualRef.current]
    if (corriendoRef.current && v && !v.ended && v.paused) v.play().catch(() => {})
  }, [])
  React.useEffect(() => {
    document.addEventListener('visibilitychange', retomar)
    return () => document.removeEventListener('visibilitychange', retomar)
  }, [retomar])

  // Vigilante: mientras haya un clip en curso, si quedó frenado sin haber terminado se vuelve a reproducir.
  React.useEffect(() => {
    const id = setInterval(() => {
      const v = refs.current[actualRef.current]
      if (corriendoRef.current && v && !v.ended && v.paused) {
        v.playbackRate = velocidadRef.current
        v.play().catch(() => {})
      }
    }, 300)
    return () => clearInterval(id)
  }, [])

  const alTerminar = (i) => {
    if (i !== actualRef.current) return
    if (activoRef.current) {
      arrancar(siguiente())
    } else {
      corriendoRef.current = false
      setEnCurso(false)
    }
  }

  // Quieto y sin clips de reposo, el avatar muestra el último cuadro de un clip (boca cerrada).
  const alCargar = (i) => {
    const v = refs.current[i]
    if (v && i === 0 && !corriendoRef.current && v.currentTime === 0) v.currentTime = Math.max(0, v.duration - 0.05)
  }

  return (
    <div className={`ent-avatar${hablando ? ' ent-avatar--habla' : ''}`} aria-hidden="true">
      {AVATAR_CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => { refs.current[i] = el }}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => alCargar(i)}
          onEnded={() => alTerminar(i)}
          onPause={() => { if (i === actualRef.current) retomar() }}
          className={i === actual && !idleOn ? 'ent-avatar-v ent-avatar-v--on' : 'ent-avatar-v'}
        />
      ))}
      {AVATAR_SILENCIO.map((src, k) => (
        <video
          key={src}
          ref={(el) => { idleRefs.current[k] = el }}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setDisponibles((s) => (s.has(k) ? s : new Set(s).add(k)))}
          onEnded={() => { if (k === idleOn && !corriendoRef.current) elegirSilencio() }}
          className={idleOn === k ? 'ent-avatar-v ent-avatar-v--on' : 'ent-avatar-v'}
        />
      ))}
    </div>
  )
}

export function EntrenadorPage({ publico = false }) {
  const inicial = React.useMemo(leerPrefs, [])
  const { user } = useAuth() || {}
  // En la página pública (/agentedeventas) se usan los endpoints abiertos, sin modelo elegible ni edición de escenarios.
  const ia = publico ? api.publico : api.ai
  // Los escenarios propios son de todos: solo el acceso completo los crea, edita o borra.
  const puedeEditarEscenarios = !publico && (!user?.acceso || user.acceso === 'completo')
  const [status, setStatus] = React.useState(null)
  const [escenarios, setEscenarios] = React.useState([])
  const [modo, setModo] = React.useState(inicial.modo || 'roleplay')
  const [escenario, setEscenario] = React.useState(inicial.escenario || 'gimnasio')
  const [nivel, setNivel] = React.useState(inicial.nivel || 'normal')
  const [modelo, setModelo] = React.useState('')
  const [turnos, setTurnos] = React.useState([])
  const [empezo, setEmpezo] = React.useState(false)
  const [verConfig, setVerConfig] = React.useState(true) // se oculta al empezar para dejar el chat grande
  const [ocupado, setOcupado] = React.useState(false) // generando una respuesta
  const [esperando, setEsperando] = React.useState(false) // todavía no llegó ni la primera palabra
  const [error, setError] = React.useState('')
  const [devolucion, setDevolucion] = React.useState(null)
  const [pidiendoDev, setPidiendoDev] = React.useState(false)
  const [texto, setTexto] = React.useState('')
  const [editor, setEditor] = React.useState(null) // escenario que se está creando o editando

  // Voz
  const [vozOn, setVozOn] = React.useState(inicial.vozOn ?? true)
  const [manosLibres, setManosLibres] = React.useState(inicial.mlV === 2 ? (inicial.manosLibres ?? true) : true)
  const [vozNombre, setVozNombre] = React.useState(inicial.vozNombre || '')
  const [velocidad, setVelocidad] = React.useState(inicial.velocidad || 1)
  const [tonoManual, setTonoManual] = React.useState(typeof inicial.tono === 'number' ? inicial.tono : null) // null = automático
  const [voces, setVoces] = React.useState(() => vocesEspanol())
  // El avatar es un hombre: si la voz que suena no es masculina (en muchas tablets y celulares solo hay voces de mujer) se la baja de tono.
  const vozElegida = voces.find((v) => v.name === vozNombre) || voces[0]
  const tono = tonoManual ?? (vozElegida && !esVozMasculina(vozElegida) ? TONO_GRAVE : 1)
  const [escuchando, setEscuchando] = React.useState(false)
  const [hablando, setHablando] = React.useState(false)
  const [parcial, setParcial] = React.useState('')
  const [pausado, setPausado] = React.useState(false) // micrófono apagado a mano

  const [vistaMovil, setVistaMovil] = React.useState('avatar') // en pantallas chicas: 'avatar' o 'chat'
  const logRef = React.useRef(null)
  const dictadoRef = React.useRef(null)
  const enviarRef = React.useRef(null)
  const locutorRef = React.useRef(null)
  const cortarRef = React.useRef(null)
  const escucharRef = React.useRef(null)
  const alternarMicRef = React.useRef(null)
  const puedeRearmarRef = React.useRef(() => false)
  const pausaRef = React.useRef(false) // el usuario apagó el micrófono a mano: no se reabre solo
  const sinMicRef = React.useRef(false) // el navegador no deja usar el micrófono: no insistir

  const cargarEscenarios = React.useCallback(
    () =>
      ia.entrenador
        .escenarios()
        .then((d) => setEscenarios(d.escenarios))
        .catch((e) => setError(e.message)),
    [],
  )

  const puedeDictar = hayDictado()
  const puedeHablar = hayVoz()
  const hayNatural = voces.some(esNatural)

  /** Corta lo que esté pasando: la voz, la respuesta que llega y el micrófono. */
  const pararTodo = React.useCallback(() => {
    locutorRef.current?.cancelar()
    locutorRef.current = null
    cortarRef.current?.abort()
    cortarRef.current = null
    detenerVoz()
    setHablando(false)
  }, [])

  React.useEffect(() => {
    ia
      .status()
      .then((s) => {
        setStatus(s)
        if (!publico) setModelo(s.modeloVentas || s.modelo)
      })
      .catch((e) => setError(e.message))
    cargarEscenarios()
    const off = alCambiarVoces(() => setVoces(vocesEspanol()))
    return () => {
      off()
      pararTodo()
      dictadoRef.current?.detener()
    }
  }, [pararTodo, cargarEscenarios])

  React.useEffect(() => {
    guardarPrefs({ mlV: 2, modo, escenario, nivel, vozOn, manosLibres, vozNombre, velocidad, tono: tonoManual })
  }, [modo, escenario, nivel, vozOn, manosLibres, vozNombre, velocidad, tonoManual])

  React.useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turnos, esperando, parcial, devolucion, vistaMovil])

  const escuchar = React.useCallback(() => {
    const d = dictadoRef.current
    if (!d || d.activo()) return
    pararTodo() // si la IA estaba hablando, se corta: hablar encima = interrumpirla
    setParcial('')
    setError('')
    d.iniciar()
    setEscuchando(true)
  }, [pararTodo])
  escucharRef.current = escuchar

  /** Prende o apaga el micrófono a mano. Apagarlo frena también la reapertura automática. */
  const alternarMic = () => {
    if (dictadoRef.current?.activo()) {
      pausaRef.current = true
      setPausado(true)
      dictadoRef.current.detener()
    } else {
      pausaRef.current = false
      setPausado(false)
      sinMicRef.current = false
      escuchar()
    }
  }
  alternarMicRef.current = alternarMic

  // El dictado se crea una vez; llama a `enviarRef` para usar siempre la versión más nueva de `enviar`.
  React.useEffect(() => {
    dictadoRef.current = crearDictado({
      onParcial: setParcial,
      onFin: (texto) => {
        setEscuchando(false)
        setParcial('')
        // Manos libres: si no dijiste nada, el micrófono se vuelve a abrir solo (el navegador lo corta tras unos segundos de silencio).
        if (!texto) setTimeout(() => puedeRearmarRef.current() && escucharRef.current?.(), 400)
      },
      onFinal: (t) => enviarRef.current?.(t),
      onError: (m) => {
        sinMicRef.current = true
        setEscuchando(false)
        setError(m)
      },
    })
  }, [])

  /** Genera la respuesta de la IA por pedazos y la va diciendo en voz alta frase por frase. */
  const turnoIA = async (historial) => {
    setOcupado(true)
    setEsperando(true)
    setError('')
    setTurnos([...historial, { role: 'assistant', content: '' }])

    const corte = new AbortController()
    cortarRef.current = corte
    const locutor =
      vozOn && puedeHablar
        ? crearLocutor({
            vozNombre,
            velocidad,
            tono,
            onFin: () => {
              setHablando(false)
              if (locutorRef.current === locutor) locutorRef.current = null
              if (manosLibres) escuchar()
            },
          })
        : null
    locutorRef.current = locutor

    let acumulado = ''
    let buffer = ''
    const alLlegar = (pedazo) => {
      acumulado += pedazo
      buffer += pedazo
      setEsperando(false)
      setTurnos([...historial, { role: 'assistant', content: acumulado }])
      if (!locutor) return
      const { oraciones, resto } = extraerOraciones(buffer)
      buffer = resto
      if (oraciones.length) setHablando(true)
      oraciones.forEach((o) => locutor.decir(o))
    }

    try {
      if (modo === 'roleplay') {
        await ia.entrenador.roleplayStream(escenario, nivel, historial, modelo, alLlegar, corte.signal)
      } else {
        await ia.entrenador.coachStream(historial, modelo, alLlegar, corte.signal)
      }
      if (locutor) {
        if (buffer.trim()) {
          setHablando(true)
          locutor.decir(buffer)
        }
        locutor.cerrar()
      } else if (manosLibres) {
        escuchar()
      }
    } catch (e) {
      locutor?.cancelar()
      setHablando(false)
      if (!corte.signal.aborted) setError(e.message)
    } finally {
      setEsperando(false)
      setOcupado(false)
      if (cortarRef.current === corte) cortarRef.current = null
    }
  }

  const enviar = (contenido) => {
    const t = String(contenido ?? texto).trim()
    if (!t || ocupado) return
    pararTodo()
    setTexto('')
    const historial = [...turnos, { role: 'user', content: t }]
    setTurnos(historial)
    turnoIA(historial)
  }
  enviarRef.current = enviar

  const empezar = () => {
    pararTodo()
    setTurnos([])
    setDevolucion(null)
    setEmpezo(true)
    setVerConfig(false)
    turnoIA([])
  }

  const reiniciar = () => {
    pararTodo()
    dictadoRef.current?.detener()
    setTurnos([])
    setDevolucion(null)
    setEmpezo(false)
    setVerConfig(true)
    setOcupado(false)
    setEsperando(false)
    setError('')
  }

  const pedirDevolucion = async () => {
    setVistaMovil('chat') // la devolución se lee en el chat
    pararTodo()
    dictadoRef.current?.detener()
    setPidiendoDev(true)
    setError('')
    try {
      setDevolucion(await ia.entrenador.feedback(escenario, nivel, turnos, modelo))
    } catch (e) {
      setError(e.message)
    } finally {
      setPidiendoDev(false)
    }
  }

  // Barra espaciadora = tocar el micrófono (si no estás escribiendo en un campo).
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
      if (!dictadoRef.current) return
      e.preventDefault()
      alternarMicRef.current?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const borrarEscenario = async () => {
    const e = escenarios.find((x) => x.id === escenario)
    if (!e || !window.confirm(`¿Eliminar el escenario "${e.titulo}"?`)) return
    try {
      await api.ai.entrenador.deleteScenario(e.id)
      reiniciar()
      const d = await api.ai.entrenador.escenarios()
      setEscenarios(d.escenarios)
      setEscenario(d.escenarios[0]?.id || '')
    } catch (err) {
      setError(err.message)
    }
  }

  const probarVoz = () => {
    pararTodo()
    hablar(FRASE_DE_PRUEBA, { vozNombre, velocidad, tono })
  }

  const roleplay = modo === 'roleplay'
  const configurado = status?.configurado
  const activo = roleplay ? empezo : true
  puedeRearmarRef.current = () =>
    manosLibres && puedeDictar && activo && !pausaRef.current && !sinMicRef.current && !ocupado && !hablando && !devolucion && !pidiendoDev && !document.hidden
  const pasoMario = turnos.filter((t) => t.role === 'user').length
  const esc = escenarios.find((e) => e.id === escenario)

  return (
    <div className="ent-page">
      <PageHeader
        title="Entrenador de ventas"
        subtitle={empezo ? undefined : publico ? 'Practicá tus llamadas de venta: la IA hace de cliente, te contesta y después te dice cómo mejorar.' : "Practicá tus llamadas hablando: la IA hace de cliente, te contesta con voz y después te dice cómo mejorar. Usa lo que aprendiste en tu cerebro."}
        actions={
          <>
            <Btn variant="ghost" className="admin-btn admin-btn--ghost ent-cfg" onClick={() => setVerConfig((v) => !v)} aria-label={verConfig ? 'Ocultar configuración' : 'Configuración'} title="Configuración">
              <span aria-hidden="true" className="ent-cfg-ico">⚙</span>
              <span className="ent-cfg-txt">{verConfig ? 'Ocultar configuración' : 'Configuración'}</span>
            </Btn>
            {status && <Badge tone={configurado ? 'success' : 'danger'}>{configurado ? 'Conectado' : 'Falta la clave'}</Badge>}
          </>
        }
      />
      <ErrorBox message={error} />

      <div className={`ent-layout${verConfig ? '' : ' ent-layout--solo'}`}>
        <Card title="Configuración">
          <div className="ent-config">
            <div className="admin-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={roleplay} className={roleplay ? 'on' : ''} onClick={() => { reiniciar(); setModo('roleplay') }}>
                Práctica
              </button>
              <button type="button" role="tab" aria-selected={!roleplay} className={!roleplay ? 'on' : ''} onClick={() => { reiniciar(); setModo('coach') }}>
                Preguntale al coach
              </button>
            </div>

            {roleplay && (
              <>
                <label className="admin-field">
                  <span>Escenario</span>
                  <Select value={escenario} onChange={(e) => { reiniciar(); setEscenario(e.target.value) }}>
                    {escenarios.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.titulo}
                      </option>
                    ))}
                  </Select>
                </label>
                {esc && <p className="admin-muted ent-persona">Vas a hablar con: {esc.personaje}.</p>}
                {puedeEditarEscenarios && (
                <div className="admin-actions ent-esc-acc">
                  <Btn variant="ghost" onClick={() => setEditor({ titulo: '', personaje: '', dolor: '', objeciones: '' })}>
                    + Agregar escenario
                  </Btn>
                  {esc && (
                    <>
                      <Btn variant="ghost" onClick={() => setEditor({ id: esc.id, titulo: esc.titulo, ...esc.detalle })}>
                        Editar
                      </Btn>
                      <Btn variant="ghost" onClick={borrarEscenario}>
                        Eliminar
                      </Btn>
                    </>
                  )}
                </div>
                )}
                <label className="admin-field">
                  <span>Dificultad</span>
                  <Select value={nivel} onChange={(e) => { reiniciar(); setNivel(e.target.value) }}>
                    {Object.entries(NIVELES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </label>
              </>
            )}

            {status && !publico && (
              <label className="admin-field">
                <span>Modelo</span>
                <Select value={modelo} onChange={(e) => setModelo(e.target.value)}>
                  {status.modelos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </label>
            )}

            <div className="ent-voz">
              <h4>Voz</h4>
              {!puedeDictar && (
                <p className="admin-muted">Tu navegador no tiene dictado por micrófono. Usá Chrome o Edge para hablar; igual podés escribir.</p>
              )}
              {!puedeHablar && <p className="admin-muted">Tu navegador no puede leer en voz alta.</p>}
              <label className="ent-check">
                <input type="checkbox" checked={vozOn} disabled={!puedeHablar} onChange={(e) => { setVozOn(e.target.checked); if (!e.target.checked) pararTodo() }} />
                La IA me responde con voz
              </label>
              <label className="ent-check">
                <input type="checkbox" checked={manosLibres} disabled={!puedeDictar} onChange={(e) => setManosLibres(e.target.checked)} />
                Manos libres: el micrófono queda abierto y se envía solo cuando terminás de hablar
              </label>
              {puedeHablar && (
                <>
                  <label className="admin-field">
                    <span>Voz</span>
                    <Select value={vozNombre} onChange={(e) => setVozNombre(e.target.value)}>
                      <option value="">Automática (la más natural disponible)</option>
                      {voces.map((v) => (
                        <option key={v.name} value={v.name}>
                          {esNatural(v) ? '★ ' : ''}
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </Select>
                  </label>
                  {!hayNatural && (
                    <p className="admin-muted ent-persona">
                      Tu navegador no tiene voces “Natural”. En Microsoft Edge vienen gratis en español argentino (Elena y Tomás) y suenan mucho mejor.
                    </p>
                  )}
                  <label className="admin-field">
                    <span>Velocidad: {velocidad.toFixed(2)}x</span>
                    <input type="range" min="0.8" max="1.4" step="0.05" value={velocidad} onChange={(e) => setVelocidad(Number(e.target.value))} />
                  </label>
                  <label className="admin-field">
                    <span>
                      Tono: {tono.toFixed(2)}
                      {tonoManual === null ? ' (automático)' : ''}
                    </span>
                    <input type="range" min="0.5" max="1.2" step="0.02" value={tono} onChange={(e) => setTonoManual(Number(e.target.value))} />
                    {tonoManual !== null && (
                      <button type="button" className="admin-link" onClick={() => setTonoManual(null)}>
                        Volver al tono automático
                      </button>
                    )}
                  </label>
                  <Btn variant="ghost" onClick={probarVoz}>
                    Probar la voz
                  </Btn>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card
          title={roleplay ? (esc ? esc.titulo : 'Práctica') : 'Coach de ventas'}
          actions={
            <div className="admin-actions">
              {roleplay && empezo && (
                <Btn variant="ghost" disabled={pasoMario < 2 || pidiendoDev || ocupado} onClick={pedirDevolucion}>
                  {pidiendoDev ? 'Evaluando…' : 'Terminar y ver devolución'}
                </Btn>
              )}
              {(empezo || turnos.length > 0) && (
                <Btn variant="ghost" onClick={reiniciar}>
                  {roleplay ? 'Nueva práctica' : 'Limpiar'}
                </Btn>
              )}
            </div>
          }
        >
          {roleplay && empezo && (
            <div className="ent-switch" role="tablist" aria-label="Qué ver">
              <button type="button" role="tab" aria-selected={vistaMovil === 'avatar'} className={vistaMovil === 'avatar' ? 'on' : ''} onClick={() => setVistaMovil('avatar')}>
                Avatar
              </button>
              <button type="button" role="tab" aria-selected={vistaMovil === 'chat'} className={vistaMovil === 'chat' ? 'on' : ''} onClick={() => setVistaMovil('chat')}>
                Chat
              </button>
            </div>
          )}
          <div className={roleplay && empezo ? `ent-escena ent-escena--avatar ent-escena--ver-${vistaMovil}` : 'ent-escena'}>
          <div className="wa-chat ent-chat">
            <div className="wa-chat-body ent-log" ref={logRef}>
              {roleplay && !empezo && (
                <div className="ent-vacio">
                  <p>
                    Elegí un escenario y tocá empezar. El cliente abre la conversación y vos le vendés: podés hablar con el
                    micrófono o escribir. Con la barra espaciadora prendés y apagás el micrófono.
                  </p>
                  <Btn onClick={empezar} disabled={!configurado || !escenarios.length}>
                    Empezar práctica
                  </Btn>
                </div>
              )}
              {!roleplay && turnos.length === 0 && (
                <div className="ai-sugerencias">
                  <p className="admin-muted">Preguntale lo que quieras sobre ventas. Probá con una de estas:</p>
                  {SUGERENCIAS_COACH.map((s) => (
                    <button key={s} type="button" className="admin-chip" disabled={!configurado} onClick={() => enviar(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {turnos
                .filter((t) => t.content)
                .map((t, i) => (
                  <div key={i} className={`wa-msg ${t.role === 'user' ? 'wa-msg--out' : 'wa-msg--in'}`}>
                    <small className="ent-quien">{t.role === 'user' ? 'Vos' : roleplay ? 'Cliente' : 'Coach'}</small>
                    <p>{t.content}</p>
                  </div>
                ))}
              {parcial && (
                <div className="wa-msg wa-msg--out ent-parcial">
                  <p>{parcial}</p>
                </div>
              )}
              {esperando && (
                <div className="wa-msg wa-msg--in ai-pensando" aria-label="Pensando">
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {devolucion && <Devolucion d={devolucion} />}
            </div>

            {activo && !devolucion && (
              <div className="ent-controles">
                {puedeDictar && (
                  <button
                    type="button"
                    className={`ent-mic${escuchando ? ' on' : ''}`}
                    disabled={!configurado || (ocupado && !hablando)}
                    onClick={alternarMic}
                    aria-pressed={escuchando}
                    aria-label={escuchando ? 'Dejar de escuchar' : 'Hablar'}
                  >
                    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" fill="currentColor" />
                    </svg>
                  </button>
                )}
                <div className="ent-estado" aria-live="polite">
                  {escuchando
                    ? 'Escuchando… hablá y se envía solo cuando termines'
                    : hablando
                      ? 'La IA está hablando… tocá el micrófono para interrumpirla'
                      : ocupado
                        ? 'Pensando…'
                        : puedeDictar
                          ? manosLibres && activo && !pausado
                            ? 'Manos libres: hablá cuando quieras'
                            : 'Tocá el micrófono (o la barra espaciadora) y hablá'
                          : 'Escribí tu respuesta'}
                  {hablando && (
                    <button type="button" className="admin-link-btn" onClick={pararTodo}>
                      Silenciar
                    </button>
                  )}
                </div>
                <form
                  className="ent-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    enviar()
                  }}
                >
                  <input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="…o escribí acá"
                    maxLength={1500}
                    disabled={!configurado || (roleplay && !empezo)}
                  />
                  <Btn type="submit" disabled={ocupado || !texto.trim()}>
                    Enviar
                  </Btn>
                </form>
              </div>
            )}
          </div>
          {/* Con voz, el avatar se mueve solo mientras suena (el texto llega antes que el audio); sin voz, mientras llega el texto. */}
          {roleplay && empezo && <AvatarCliente hablando={vozOn && puedeHablar ? hablando : ocupado && !esperando} velocidad={velocidad} />}
          {roleplay && empezo && puedeDictar && (
            <button
              type="button"
              className={`ent-mic ent-mic--flotante${escuchando ? ' on' : ''}`}
              disabled={!configurado || (ocupado && !hablando)}
              onClick={alternarMic}
              aria-pressed={escuchando}
              aria-label={escuchando ? 'Dejar de escuchar' : 'Hablar'}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" fill="currentColor" />
              </svg>
            </button>
          )}
          </div>
        </Card>
      </div>

      <EscenarioEditor
        editor={editor}
        modelo={modelo}
        onClose={() => setEditor(null)}
        onGuardado={async (e) => {
          setEditor(null)
          await cargarEscenarios()
          reiniciar()
          setEscenario(e.id)
        }}
      />
    </div>
  )
}

/** Formulario para crear o editar un escenario propio. Se puede armar con IA a partir de una descripción corta. */
function EscenarioEditor({ editor, modelo, onClose, onGuardado }) {
  const [form, setForm] = React.useState(null)
  const [idea, setIdea] = React.useState('')
  const [armando, setArmando] = React.useState(false)
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    setForm(editor ? { titulo: editor.titulo, personaje: editor.personaje, dolor: editor.dolor, objeciones: editor.objeciones } : null)
    setIdea('')
    setError('')
  }, [editor])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const armar = async () => {
    setArmando(true)
    setError('')
    try {
      setForm(await api.ai.entrenador.generateScenario(idea.trim(), modelo))
    } catch (e) {
      setError(e.message)
    } finally {
      setArmando(false)
    }
  }

  const guardar = async (ev) => {
    ev.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const guardado = editor.id ? await api.ai.entrenador.updateScenario(editor.id, form) : await api.ai.entrenador.createScenario(form)
      await onGuardado(guardado)
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal open={Boolean(editor && form)} title={editor?.id ? 'Editar escenario' : 'Nuevo escenario'} onClose={onClose}>
      {form && editor && (
        <form className="admin-form" onSubmit={guardar}>
          <ErrorBox message={error} />
          {!editor.id && (
            <div className="ent-idea">
              <Field label="¿Con quién querés practicar? Describilo en una frase y la IA arma el escenario">
                <textarea rows={2} value={idea} maxLength={600} onChange={(e) => setIdea(e.target.value)} placeholder="Dueño de una agencia de viajes que atiende todo por WhatsApp y pierde consultas" />
              </Field>
              <Btn variant="ghost" disabled={armando || idea.trim().length < 8} onClick={armar}>
                {armando ? 'Armándolo…' : 'Armarlo con IA'}
              </Btn>
            </div>
          )}
          <Field label="Título (cómo se ve en la lista)">
            <input value={form.titulo} onChange={set('titulo')} maxLength={80} required />
          </Field>
          <Field label="Quién es el cliente y cómo habla">
            <textarea rows={3} value={form.personaje} onChange={set('personaje')} maxLength={600} required />
          </Field>
          <Field label="Su dolor real (lo cuenta solo si le preguntás bien)">
            <textarea rows={3} value={form.dolor} onChange={set('dolor')} maxLength={600} required />
          </Field>
          <Field label="Objeciones que va a poner">
            <textarea rows={3} value={form.objeciones} onChange={set('objeciones')} maxLength={600} required />
          </Field>
          <div className="admin-actions">
            <Btn variant="ghost" onClick={onClose}>
              Cancelar
            </Btn>
            <Btn type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar escenario'}
            </Btn>
          </div>
        </form>
      )}
    </Modal>
  )
}

function Devolucion({ d }) {
  return (
    <div className="ent-dev">
      <div className="ent-dev-top">
        <span className="ent-nota">{d.puntaje ?? '—'}<small>/10</small></span>
        <p>{d.resumen}</p>
      </div>
      <div className="coach-body">
        {d.loQueHizoBien?.length > 0 && (
          <section className="coach-sec coach-sec--ok">
            <h4>Lo que hiciste bien</h4>
            <ul>{d.loQueHizoBien.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {d.aMejorar?.length > 0 && (
          <section className="coach-sec coach-sec--riesgo">
            <h4>Para mejorar</h4>
            <ul>{d.aMejorar.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {d.momentosClave?.length > 0 && (
          <section className="coach-sec">
            <h4>Momentos clave: cómo decirlo mejor</h4>
            <div className="coach-objs">
              {d.momentosClave.map((m, i) => (
                <article key={i}>
                  {m.loQueDijo && <small className="admin-muted">Dijiste: “{m.loQueDijo}”</small>}
                  {m.problema && <strong>{m.problema}</strong>}
                  {m.comoDecirloMejor && <p>Probá: “{m.comoDecirloMejor}”</p>}
                </article>
              ))}
            </div>
          </section>
        )}
        {d.proximaPractica && (
          <section className="coach-cierre">
            <h4>Para la próxima práctica</h4>
            <p>{d.proximaPractica}</p>
          </section>
        )}
        <small className="admin-muted coach-pie">
          {d.dolorDescubierto ? 'Descubriste el dolor' : 'No llegaste al dolor real'} · {d.pidioSiguientePaso ? 'pediste un siguiente paso' : 'no pediste un siguiente paso'} · {d.modelo}
        </small>
      </div>
    </div>
  )
}
