import React from 'react'
import { api } from '../api'
import { Badge, Btn, Card, ErrorBox, PageHeader, Select } from '../components'

const SUGERENCIAS = [
  'Redactame un mensaje para ofrecer la auditoría gratis de 15 minutos a un gimnasio.',
  'Dame 3 ideas para automatizar los turnos de una barbería.',
  'Resumime en dos frases qué hace CNS para una pyme.',
]

const usd = (n) => (n == null ? '—' : `US$ ${n.toFixed(5)}`)

export function AsistentePage() {
  const [status, setStatus] = React.useState(null)
  const [modelo, setModelo] = React.useState('')
  const [mensajes, setMensajes] = React.useState([])
  const [texto, setTexto] = React.useState('')
  const [enviando, setEnviando] = React.useState(false)
  const [error, setError] = React.useState('')
  const [gasto, setGasto] = React.useState({ tokens: 0, costo: 0 })
  const logRef = React.useRef(null)

  React.useEffect(() => {
    api.ai
      .status()
      .then((s) => {
        setStatus(s)
        setModelo(s.modelo)
      })
      .catch((e) => setError(e.message))
  }, [])

  React.useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [mensajes, enviando])

  const enviar = async (contenido) => {
    const t = (contenido ?? texto).trim()
    if (!t || enviando) return
    const historial = [...mensajes, { role: 'user', content: t }]
    setMensajes(historial)
    setTexto('')
    setEnviando(true)
    setError('')
    try {
      const r = await api.ai.chat(
        historial.map(({ role, content }) => ({ role, content })),
        modelo,
      )
      setMensajes([...historial, { role: 'assistant', content: r.respuesta, modelo: r.modelo }])
      setGasto((g) => ({ tokens: g.tokens + r.uso.total, costo: g.costo + (r.uso.costoUsd || 0) }))
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Asistente IA"
        subtitle="Probá el modelo que va a usar el CRM. Las respuestas salen de OpenRouter y se pagan con el crédito de la cuenta."
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
        title="Conversación de prueba"
        actions={
          status && (
            <div className="admin-actions">
              <Select size="compact" value={modelo} onChange={(e) => setModelo(e.target.value)} aria-label="Modelo">
                {status.modelos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
              <Btn variant="ghost" disabled={!mensajes.length} onClick={() => setMensajes([])}>
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
                <p className="admin-muted">Probá con una de estas o escribí lo tuyo:</p>
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" className="admin-chip" disabled={!status?.configurado} onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {mensajes.map((m, i) => (
              <div key={i} className={`wa-msg ${m.role === 'user' ? 'wa-msg--out' : 'wa-msg--in'}`}>
                <p>{m.content}</p>
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
              placeholder="Escribí tu pregunta…"
              disabled={!status?.configurado}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  enviar()
                }
              }}
            />
            <Btn type="submit" disabled={enviando || !texto.trim() || !status?.configurado}>
              {enviando ? 'Pensando…' : 'Enviar'}
            </Btn>
          </form>
        </div>
        <p className="admin-muted ai-gasto">
          Esta sesión: {gasto.tokens} tokens · {usd(gasto.costo)}
        </p>
      </Card>
    </>
  )
}
