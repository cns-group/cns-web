import React from 'react'
import { api } from '../api'
import { Card, PageHeader } from '../components'

const PERIODOS = [7, 28, 90]

const fmt = (n) => new Intl.NumberFormat('es-AR').format(Number(n) || 0)
const pct = (v) => (v == null ? '—' : `${String(v).replace('.', ',')}%`)

function SetupCard({ motivo }) {
  return (
    <Card title="Falta conectar Google Analytics">
      <p>{motivo}</p>
      <ol>
        <li>
          En <b>Google Cloud</b> creá una <i>cuenta de servicio</i> y activá la API <b>Google Analytics Data API</b>.
          Descargá su clave en formato JSON.
        </li>
        <li>
          En <b>Google Analytics → Administrar → Acceso a la propiedad</b> agregá el email de esa cuenta de servicio
          con el rol <b>Lector</b>.
        </li>
        <li>
          Copiá el <b>ID de la propiedad</b> (Administrar → Detalles de la propiedad).
        </li>
        <li>
          En el backend cargá <code>GA4_PROPERTY_ID</code> con ese número y <code>GA4_SERVICE_ACCOUNT_JSON</code> con el
          contenido del JSON (o ese JSON en base64) y reiniciá el servicio.
        </li>
      </ol>
    </Card>
  )
}

function Barras({ visitantes, pasos }) {
  const filas = [
    { key: 'visitantes', label: 'Visitantes de la landing', usuarios: visitantes, nota: '' },
    ...pasos.map((p) => ({
      key: p.evento,
      label: p.label,
      usuarios: p.usuarios,
      nota: `${pct(p.conversion)} de ${p.desdeLabel.toLowerCase()} · ${pct(p.conversionTotal)} del total`,
    })),
  ]
  const max = Math.max(...filas.map((f) => f.usuarios), 1)

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 14 }}>
      {filas.map((f, i) => (
        <li key={f.key}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
            <span>
              {i + 1}. {f.label}
            </span>
            <span>
              <b>{fmt(f.usuarios)}</b> usuarios
              {f.nota && <small style={{ marginLeft: 8, opacity: 0.7 }}>{f.nota}</small>}
            </span>
          </div>
          <div style={{ height: 14, borderRadius: 7, background: 'rgba(127,127,127,.2)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.max(2, Math.round((f.usuarios / max) * 100))}%`,
                height: '100%',
                background: '#0e82ec',
                opacity: 1 - i * 0.15,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function EmbudoPage() {
  const [dias, setDias] = React.useState(28)
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const load = React.useCallback(() => {
    setLoading(true)
    setError('')
    api.analytics
      .embudo(dias)
      .then(setData)
      .catch((e) => {
        setData(null)
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [dias])

  React.useEffect(load, [load])

  const contactos = data?.pasos?.find((p) => p.evento === 'contact_click')?.usuarios ?? 0

  return (
    <>
      <PageHeader
        title="Embudo de la landing"
        subtitle="Cuántos visitantes ven los planes, eligen uno o te contactan. Datos de Google Analytics (GA4)."
        actions={
          <>
            {PERIODOS.map((d) => (
              <button
                key={d}
                type="button"
                className={`admin-btn ${d === dias ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
                onClick={() => setDias(d)}
              >
                {d} días
              </button>
            ))}
            <button type="button" className="admin-btn admin-btn--ghost" onClick={load} disabled={loading}>
              {loading ? 'Cargando…' : 'Actualizar'}
            </button>
          </>
        }
      />

      {error && <p className="admin-error">{error}</p>}
      {data && data.configured === false && <SetupCard motivo={data.motivo} />}
      {data && data.configured && data.error && <p className="admin-error">{data.error}</p>}

      {data && data.configured && !data.error && (
        <>
          <div className="admin-grid admin-grid--4">
            <div className="admin-stat">
              <span>Visitantes</span>
              <strong>{fmt(data.visitantes)}</strong>
            </div>
            <div className="admin-stat">
              <span>Sesiones</span>
              <strong>{fmt(data.sesiones)}</strong>
            </div>
            <div className="admin-stat">
              <span>Contactos (WhatsApp / email)</span>
              <strong>{fmt(contactos)}</strong>
            </div>
            <div className="admin-stat">
              <span>De visitante a contacto</span>
              <strong>{pct(data.visitantes ? Math.round((contactos / data.visitantes) * 1000) / 10 : null)}</strong>
            </div>
          </div>

          <Card title={`Embudo · últimos ${data.dias} días`}>
            <Barras visitantes={data.visitantes} pasos={data.pasos} />
          </Card>

          <Card title="Por canal de entrada">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Canal</th>
                    <th>Sesiones</th>
                    <th>Contactos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.canales.length === 0 && (
                    <tr>
                      <td colSpan={3}>Todavía no hay datos de canales.</td>
                    </tr>
                  )}
                  {data.canales.map((c) => (
                    <tr key={c.canal}>
                      <td>{c.canal}</td>
                      <td>{fmt(c.sesiones)}</td>
                      <td>{fmt(c.contactos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <p style={{ opacity: 0.7, fontSize: 13 }}>
            Google Analytics puede tardar hasta 48 hs en procesar los datos. Cada paso cuenta usuarios únicos que hicieron
            esa acción en el período: es una aproximación del recorrido y no un seguimiento persona por persona.
            Actualizado: {new Date(data.actualizado).toLocaleString('es-AR')}.
          </p>
        </>
      )}
    </>
  )
}
