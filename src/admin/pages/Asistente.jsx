import React from 'react'
import { api } from '../api'
import { Badge, Btn, Card, ErrorBox, PageHeader, Select } from '../components'
import { crearDictado, detenerVoz, hablar, hayDictado, hayVoz } from '../voz'

const SUGERENCIAS = [
  'Anotá que Hangar Fitness pagó noviembre.',
  'Agendame para mañana a las 10 llamar a Velvet Travel.',
  '¿Qué cobros tengo pendientes esta semana?',
  'Pasá a pausado el cliente Carspa.',
]

const usd = (n) => (n == null ? '—' : `US$ ${n.toFixed(5)}`)

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const PALABRAS_SI = ['si', 'dale', 'ok', 'okey', 'okay', 'confirmo', 'confirmalo', 'confirma', 'confirmar', 'hacelo', 'hacela', 'adelante', 'perfecto', 'correcto', 'listo', 'de', 'aplicalo', 'guardalo']
const PALABRAS_NO = ['no', 'cancela', 'cancelalo', 'cancelar', 'deja', 'dejalo', 'olvidalo', 'anula', 'anulalo']
/** "sí", "dale, confirmalo", "no, cancelalo"…: frases cortas que responden a una propuesta pendiente. */
function respuestaCorta(texto) {
  const palabras = sinTildes(texto).replace(/[^a-zñ\s]/g, ' ').split(/\s+/).filter(Boolean)
  if (!palabras.length || palabras.length > 5) return null
  if (PALABRAS_SI.includes(palabras[0])) return 'si'
  if (PALABRAS_NO.includes(palabras[0])) return 'no'
  return null
}

const leer = (clave, defecto) => {
  try {
    const v = localStorage.getItem(clave)
    return v === null ? defecto : v === '1'
  } catch {
    return defecto
  }
}
const guardar = (clave, valor) => {
  try {
    localStorage.setItem(clave, valor ? '1' : '0')
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export function AsistentePage() {
  const [status, setStatus] = React.useState(null)
  const [modelo, setModelo] = React.useState('')
  const [mensajes, setMensajes] = React.useState([])
  const [texto, setTexto] = React.useState('')
  const [enviando, setEnviando] = React.useState(false)
  const [error, setError] = React.useState('')
  const [gasto, setGasto] = React.useState({ tokens: 0, costo: 0 })
  const [vozActiva, setVozActiva] = React.useState(() => leer('cns_asistente_voz', true))
  const [manosLibres, setManosLibres] = React.useState(false)
  const [escuchando, setEscuchando] = React.useState(false)
  const [hablando, setHablando] = React.useState(false)
  const logRef = React.useRef(null)
  const dictadoRef = React.useRef(null)

  // Los manejadores del dictado y de la voz viven más que un render: se leen siempre desde una referencia al estado actual.
  const vivo = React.useRef({})
  vivo.current = { ...vivo.current, mensajes, enviando, vozActiva, manosLibres, modelo, status }

  React.useEffect(() => {
    api.ai
      .status()
      .then((s) => {
        setStatus(s)
        setModelo(s.modelo)
      })
      .catch((e) => setError(e.message))
    return () => {
      detenerVoz()
      dictadoRef.current?.detener()
    }
  }, [])

  React.useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [mensajes, enviando])

  const reabrirMicrofono = () => {
    if (vivo.current.manosLibres && dictadoRef.current && !dictadoRef.current.activo()) {
      setEscuchando(true)
      dictadoRef.current.iniciar()
    }
  }

  const decir = (frase, alTerminar) => {
    if (vivo.current.vozActiva && hayVoz()) {
      setHablando(true)
      hablar(frase, {
        onFin: () => {
          setHablando(false)
          alTerminar?.()
        },
      })
    } else {
      alTerminar?.()
    }
  }

  const indicePendiente = () => {
    const ms = vivo.current.mensajes
    for (let i = ms.length - 1; i >= 0; i--) if (ms[i].acciones?.length && ms[i].estado === 'pendiente') return i
    return -1
  }

  const resolver = async (indice, confirmar) => {
    const m = vivo.current.mensajes[indice]
    if (!m || m.estado !== 'pendiente') return
    if (!confirmar) {
      const frase = 'Listo, no cambié nada.'
      setMensajes((ms) => [...ms.map((x, i) => (i === indice ? { ...x, estado: 'cancelado' } : x)), { role: 'assistant', content: frase }])
      decir(frase, reabrirMicrofono)
      return
    }
    setEnviando(true)
    setError('')
    try {
      const resultados = await api.ai.ejecutar(m.acciones.map(({ tipo, datos }) => ({ tipo, datos })))
      const hechas = resultados.filter((r) => r.ok).length
      const fallas = resultados.filter((r) => !r.ok)
      const frase = fallas.length
        ? `Apliqué ${hechas} de ${resultados.length}. No pude: ${fallas.map((f) => f.error).join(' ')}`
        : hechas === 1
          ? 'Listo, ya está hecho.'
          : `Listo, hice los ${hechas} cambios.`
      setMensajes((ms) => [...ms.map((x, i) => (i === indice ? { ...x, estado: 'hecho', resultados } : x)), { role: 'assistant', content: frase }])
      decir(frase, reabrirMicrofono)
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const enviar = async (contenido) => {
    const t = (contenido ?? texto).trim()
    if (!t || vivo.current.enviando) return
    setTexto('')

    // Si hay un cambio esperando confirmación, un "sí" o un "no" corto lo resuelve sin pasar por el modelo.
    const p = indicePendiente()
    const corta = p >= 0 ? respuestaCorta(t) : null
    if (corta) {
      setMensajes((ms) => [...ms, { role: 'user', content: t }])
      vivo.current.mensajes = [...vivo.current.mensajes, { role: 'user', content: t }]
      await resolver(p, corta === 'si')
      return
    }
    // Si sigue hablando de otra cosa, la propuesta pendiente queda sin efecto.
    const base = vivo.current.mensajes.map((m, i) => (i === p ? { ...m, estado: 'descartado' } : m))
    const historial = [...base, { role: 'user', content: t }]
    setMensajes(historial)
    setEnviando(true)
    setError('')
    try {
      const r = await api.ai.asistente(
        historial.map(({ role, content }) => ({ role, content })),
        vivo.current.modelo,
      )
      const acciones = r.acciones || []
      setMensajes([...historial, { role: 'assistant', content: r.respuesta, modelo: r.modelo, acciones, estado: acciones.length ? 'pendiente' : undefined }])
      setGasto((g) => ({ tokens: g.tokens + r.uso.total, costo: g.costo + (r.uso.costoUsd || 0) }))
      decir(r.respuesta, reabrirMicrofono)
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const iniciarDictado = () => {
    if (!dictadoRef.current) {
      dictadoRef.current = crearDictado({
        idioma: 'es-AR',
        onParcial: (t) => setTexto(t),
        onFin: () => setEscuchando(false),
        onFinal: (t) => enviar(t),
        onError: (m) => {
          setError(m)
          setManosLibres(false)
          vivo.current.manosLibres = false
        },
      })
    }
    const d = dictadoRef.current
    if (!d || d.activo()) return
    detenerVoz()
    setHablando(false)
    setEscuchando(true)
    d.iniciar()
  }

  const alternarDictado = () => {
    const d = dictadoRef.current
    if (d?.activo()) {
      setManosLibres(false)
      vivo.current.manosLibres = false
      d.detener()
    } else {
      iniciarDictado()
    }
  }

  const alternarManosLibres = () => {
    const nuevo = !manosLibres
    setManosLibres(nuevo)
    vivo.current.manosLibres = nuevo
    if (nuevo) {
      iniciarDictado()
    } else {
      dictadoRef.current?.detener()
      detenerVoz()
      setHablando(false)
    }
  }

  const alternarVoz = () => {
    const nuevo = !vozActiva
    setVozActiva(nuevo)
    vivo.current.vozActiva = nuevo
    guardar('cns_asistente_voz', nuevo)
    if (!nuevo) {
      detenerVoz()
      setHablando(false)
    }
  }

  const dictadoDisponible = hayDictado()
  const listo = Boolean(status?.configurado)
  const hayPendiente = indicePendiente() >= 0
  const titulos = { pendiente: 'Cambios propuestos', hecho: 'Cambios aplicados', cancelado: 'Cambios cancelados', descartado: 'Cambios sin aplicar' }

  return (
    <>
      <PageHeader
        title="Asistente IA"
        subtitle="Hablale o escribile: consulta tus clientes, cobros y agenda, y puede registrar o editar pagos, clientes y tareas. Cada cambio te lo muestra y se aplica recién cuando lo confirmás."
        actions={
          status && (
            <Badge tone={status.configurado ? 'success' : 'danger'}>
              {status.configurado ? 'Conectado' : 'Falta la clave'}
            </Badge>
          )
        }
      />
      <ErrorBox message={error} />

      {status && !status.configurado && (
        <Card title="Falta configurar OpenRouter">
          <p className="admin-text">
            El servidor necesita la variable <code>OPENROUTER_API_KEY</code> en su <code>.env</code>. Opcionalmente{' '}
            <code>OPENROUTER_MODEL</code> (modelo por defecto) y <code>OPENROUTER_MODELS</code> (lista que se puede elegir acá).
          </p>
        </Card>
      )}

      <Card
        title="Conversación"
        actions={
          status && (
            <div className="admin-actions">
              <label className="asist-check">
                <input type="checkbox" checked={vozActiva} onChange={alternarVoz} disabled={!hayVoz()} />
                <span>Respuesta en voz</span>
              </label>
              <Select size="compact" value={modelo} onChange={(e) => setModelo(e.target.value)} aria-label="Modelo">
                {status.modelos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
              <Btn
                variant="ghost"
                disabled={!mensajes.length}
                onClick={() => {
                  detenerVoz()
                  setMensajes([])
                }}
              >
                Limpiar
              </Btn>
            </div>
          )
        }
      >
        <div className="wa-chat">
          <div className="wa-chat-body ai-log" ref={logRef}>
            {mensajes.length === 0 && (
              <div className="ai-sugerencias">
                <p className="admin-muted">Probá con una de estas, dictá o escribí lo tuyo:</p>
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" className="admin-chip" disabled={!listo} onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {mensajes.map((m, i) => (
              <div key={i} className={`wa-msg ${m.role === 'user' ? 'wa-msg--out' : 'wa-msg--in'}`}>
                <p>{m.content}</p>
                {m.acciones?.length > 0 && (
                  <div className={`asist-acciones asist-acciones--${m.estado}`}>
                    <strong>{titulos[m.estado]}</strong>
                    <ul>
                      {m.acciones.map((a, k) => {
                        const r = m.resultados?.[k]
                        return (
                          <li key={k}>
                            {a.resumen}
                            {r && <span className={r.ok ? 'asist-ok' : 'asist-mal'}>{r.ok ? ' — hecho' : ` — no se pudo: ${r.error}`}</span>}
                          </li>
                        )
                      })}
                    </ul>
                    {m.estado === 'pendiente' && (
                      <div className="asist-botones">
                        <Btn disabled={enviando} onClick={() => resolver(i, true)}>
                          Confirmar
                        </Btn>
                        <Btn variant="ghost" disabled={enviando} onClick={() => resolver(i, false)}>
                          Cancelar
                        </Btn>
                        <small className="admin-muted">También podés decir “sí” o “no”.</small>
                      </div>
                    )}
                  </div>
                )}
                {m.modelo && <small>{m.modelo}</small>}
              </div>
            ))}
            {enviando && (
              <div className="wa-msg wa-msg--in ai-pensando" aria-label="Pensando">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          <form
            className="wa-chat-form"
            onSubmit={(e) => {
              e.preventDefault()
              enviar()
            }}
          >
            <textarea
              rows={2}
              value={texto}
              maxLength={4000}
              placeholder={escuchando ? 'Escuchando…' : hayPendiente ? 'Decí “sí” para confirmar o “no” para cancelar…' : 'Escribí tu pedido o tocá Dictar…'}
              disabled={!listo}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  enviar()
                }
              }}
            />
            <div className="asist-controles">
              {dictadoDisponible && (
                <Btn variant={escuchando ? 'primary' : 'ghost'} disabled={!listo} onClick={alternarDictado} aria-pressed={escuchando}>
                  {escuchando ? 'Escuchando… (parar)' : 'Dictar'}
                </Btn>
              )}
              <Btn type="submit" disabled={enviando || !texto.trim() || !listo}>
                {enviando ? 'Pensando…' : 'Enviar'}
              </Btn>
            </div>
          </form>
          {dictadoDisponible ? (
            <label className="asist-check asist-libres">
              <input type="checkbox" checked={manosLibres} onChange={alternarManosLibres} disabled={!listo} />
              <span>Manos libres: dictás, responde en voz y vuelve a escuchar{hablando ? ' (hablando…)' : ''}</span>
            </label>
          ) : (
            <p className="admin-muted">Este navegador no permite dictar por voz; usá Chrome o Edge para hablarle.</p>
          )}
        </div>
        <p className="admin-muted ai-gasto">
          Esta sesión: {gasto.tokens} tokens · {usd(gasto.costo)}
        </p>
      </Card>
    </>
  )
}
