import React from 'react'
import { api } from '../api'
import { Badge, Btn, Card, EmptyState, ErrorBox, Field, PageHeader } from '../components'

const ESTADOS = {
  WORKING: ['Conectado', 'success'],
  SCAN_QR_CODE: ['Esperando que escanees el QR', 'warn'],
  STARTING: ['Iniciando sesión…', 'warn'],
  STOPPED: ['Desconectado', 'neutral'],
  FAILED: ['Error en la sesión', 'danger'],
}

/** Mientras una línea espera el QR se consulta seguido; conectada o apagada, más espaciado. */
const esperando = (l) => l.status !== 'WORKING' && l.status !== 'STOPPED' && l.status !== 'FAILED'

export function WhatsAppPage() {
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [name, setName] = React.useState('')

  const load = React.useCallback(
    () =>
      api.whatsapp
        .status()
        .then((d) => {
          setData(d)
          setError('')
        })
        .catch((e) => setError(e.message)),
    [],
  )

  React.useEffect(() => {
    load()
  }, [load])

  const waiting = Boolean(data?.lineas?.some(esperando))
  React.useEffect(() => {
    const t = setInterval(load, waiting ? 4000 : 12000)
    return () => clearInterval(t)
  }, [load, waiting])

  const run = async (id, fn) => {
    setBusy(id)
    setError('')
    try {
      await fn()
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  const connect = (l) => run(l.id, () => api.whatsapp.connect(l.id))
  const disconnect = (l) => {
    if (!window.confirm(`¿Desvincular el WhatsApp "${l.nombre}"? Dejarán de registrarse sus mensajes nuevos.`)) return
    run(l.id, () => api.whatsapp.disconnect(l.id))
  }
  const remove = (l) => {
    if (!window.confirm(`¿Eliminar el número "${l.nombre}"? Las conversaciones guardadas se conservan.`)) return
    run(l.id, () => api.whatsapp.removeLine(l.id))
  }
  const create = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    run('nuevo', async () => {
      await api.whatsapp.createLine(name.trim())
      setName('')
      setAdding(false)
    })
  }

  return (
    <>
      <PageHeader
        title="WhatsApp"
        subtitle="Vinculá los números de CNS escaneando un QR. Los mensajes que lleguen se convierten en consultas y los respondés desde el CRM."
        actions={
          data?.puedeCrear && !adding ? (
            <Btn onClick={() => setAdding(true)}>+ Agregar número</Btn>
          ) : null
        }
      />
      <ErrorBox message={error} />
      {!data && !error && <div className="admin-loading">Consultando…</div>}

      {data && !data.configurado && !data.puedeCrear && (
        <Card title="Falta configurar el servicio de WhatsApp">
          <p className="admin-text">
            Para agregar números desde acá, el servidor necesita las variables <code>WS_SERVICE_ADMIN_EMAIL</code> y{' '}
            <code>WS_SERVICE_ADMIN_PASSWORD</code> (el usuario administrador de ws-service). También se puede cargar a mano
            un proyecto con <code>WHATSAPP_PROJECT_ID</code>, <code>WHATSAPP_API_KEY</code> y{' '}
            <code>WHATSAPP_WEBHOOK_SECRET</code>.
          </p>
        </Card>
      )}

      {data && !data.configurado && data.puedeCrear && !adding && (
        <EmptyState>Todavía no hay ningún número. Agregá el primero: se crea solo y después escaneás el QR.</EmptyState>
      )}

      {adding && (
        <Card title="Nuevo número">
          <form className="admin-form-row" onSubmit={create}>
            <Field label="Nombre del número (Ventas, Soporte…)">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
            </Field>
            <div className="admin-actions">
              <Btn variant="ghost" onClick={() => setAdding(false)}>
                Cancelar
              </Btn>
              <Btn type="submit" disabled={!name.trim() || busy === 'nuevo'}>
                {busy === 'nuevo' ? 'Creando…' : 'Crear número'}
              </Btn>
            </div>
          </form>
        </Card>
      )}

      <div className="admin-stack">
        {data?.lineas?.map((l) => {
          const connected = l.status === 'WORKING'
          const [label, tone] = ESTADOS[l.status] || [l.status, 'neutral']
          return (
            <Card
              key={l.id}
              title={l.nombre}
              actions={
                <div className="admin-actions">
                  <Badge tone={tone}>{label}</Badge>
                  {l.origen === 'panel' && !connected && (
                    <Btn variant="ghost" disabled={busy === l.id} onClick={() => remove(l)}>
                      Eliminar
                    </Btn>
                  )}
                  {connected ? (
                    <Btn variant="ghost" disabled={busy === l.id} onClick={() => disconnect(l)}>
                      Desvincular
                    </Btn>
                  ) : (
                    <Btn disabled={busy === l.id} onClick={() => connect(l)}>
                      {busy === l.id ? 'Generando QR…' : l.status === 'SCAN_QR_CODE' ? 'Nuevo QR' : 'Conectar'}
                    </Btn>
                  )}
                </div>
              }
            >
              {connected && l.displayPhoneNumber && (
                <p className="admin-text">
                  Número vinculado: <strong>+{String(l.displayPhoneNumber).replace(/^\+/, '')}</strong>
                </p>
              )}
              {l.error && <ErrorBox message={l.error} />}
              {l.status === 'SCAN_QR_CODE' && l.qrCode && (
                <div className="wa-qr">
                  <img src={l.qrCode} alt={`Código QR de WhatsApp (${l.nombre})`} width={240} height={240} />
                  <ol className="admin-text">
                    <li>Abrí WhatsApp en el celular de “{l.nombre}”.</li>
                    <li>Entrá a Dispositivos vinculados y tocá Vincular un dispositivo.</li>
                    <li>Escaneá este código. Se actualiza solo.</li>
                  </ol>
                </div>
              )}
              {!connected && l.status !== 'SCAN_QR_CODE' && !l.error && (
                <p className="admin-muted">Tocá Conectar para generar el QR.</p>
              )}
            </Card>
          )
        })}
      </div>

      {data && (data.configurado || data.puedeCrear) && (
        <p className="admin-muted admin-note">
          Si alguien escribe a cualquiera de los números, se crea su consulta en el embudo (o se suma a su conversación si ya
          había escrito). Podés responder desde el CRM o desde el celular.
        </p>
      )}
    </>
  )
}
