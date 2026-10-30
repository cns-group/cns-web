import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, fmtDateTime } from '../api'
import { ArticuloContenido } from '../../articulo-contenido'
import '../../articulos.css'
import { Badge, Btn, Card, EmptyState, ErrorBox, Field, PageHeader, Select, Table } from '../components'

const TIPOS = [
  { tipo: 'titulo', label: 'Título de sección', ayuda: 'Un título grande que abre una sección.' },
  { tipo: 'subtitulo', label: 'Subtítulo', ayuda: 'Un título más chico dentro de una sección.' },
  { tipo: 'texto', label: 'Texto', ayuda: 'Párrafos. Dejá una línea en blanco entre uno y otro. Podés usar **negrita**, *cursiva* y [texto](https://enlace).' },
  { tipo: 'imagen', label: 'Imagen', ayuda: '' },
  { tipo: 'lista', label: 'Lista', ayuda: 'Un ítem por línea.' },
  { tipo: 'cita', label: 'Cita destacada', ayuda: 'Una frase que querés resaltar.' },
]

let contador = 0
const conId = (b) => ({ ...b, _id: `b${++contador}` })
const sinId = ({ _id, ...b }) => b

/** Achica la foto antes de subirla (máx. 1600 px de ancho, WebP): pesa mucho menos y carga más rápido en la web. */
async function prepararImagen(archivo) {
  if (!/^image\/(jpeg|png|webp)$/.test(archivo.type)) return archivo // los GIF se suben tal cual
  try {
    const bmp = await createImageBitmap(archivo)
    const escala = Math.min(1, 1600 / bmp.width)
    const lienzo = document.createElement('canvas')
    lienzo.width = Math.round(bmp.width * escala)
    lienzo.height = Math.round(bmp.height * escala)
    lienzo.getContext('2d').drawImage(bmp, 0, 0, lienzo.width, lienzo.height)
    const blob = await new Promise((ok) => lienzo.toBlob(ok, 'image/webp', 0.86))
    return blob && blob.size < archivo.size ? blob : archivo
  } catch {
    return archivo
  }
}

export function ArticulosPage() {
  const navigate = useNavigate()
  const [lista, setLista] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api.articulos.listAdmin().then(setLista).catch((e) => setError(e.message))
  }, [])

  const columns = [
    { key: 'titulo', label: 'Artículo', render: (r) => <strong>{r.titulo}</strong> },
    {
      key: 'publicado',
      label: 'Estado',
      render: (r) => <Badge tone={r.publicado ? 'success' : 'neutral'}>{r.publicado ? 'Publicado' : 'Borrador'}</Badge>,
    },
    { key: 'updatedAt', label: 'Última edición', render: (r) => fmtDateTime(r.updatedAt) },
    {
      key: 'ver',
      label: '',
      render: (r) =>
        r.publicado ? (
          <a href={`/articulos/${r.slug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Ver en la web
          </a>
        ) : null,
    },
  ]

  return (
    <>
      <PageHeader
        title="Artículos"
        subtitle="Escribí artículos con texto e imágenes para la web de CNS. Se publican en /articulos."
        actions={<Btn onClick={() => navigate('/admin/articulos/nuevo')}>Nuevo artículo</Btn>}
      />
      <ErrorBox message={error} />
      {lista && lista.length === 0 && <EmptyState>Todavía no hay artículos. Creá el primero con “Nuevo artículo”.</EmptyState>}
      {lista && lista.length > 0 && <Table columns={columns} rows={lista} onRowClick={(r) => navigate(`/admin/articulos/${r.id}`)} />}
    </>
  )
}

export function ArticuloEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const nuevo = id === 'nuevo'
  const [cargando, setCargando] = React.useState(!nuevo)
  const [guardando, setGuardando] = React.useState(false)
  const [subiendo, setSubiendo] = React.useState('')
  const [error, setError] = React.useState('')
  const [aviso, setAviso] = React.useState('')
  const [vista, setVista] = React.useState(false)
  const [original, setOriginal] = React.useState(null)

  const [titulo, setTitulo] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [slugEditado, setSlugEditado] = React.useState(false)
  const [resumen, setResumen] = React.useState('')
  const [portada, setPortada] = React.useState('')
  const [bloques, setBloques] = React.useState([])
  const [publicado, setPublicado] = React.useState(false)
  const [sucio, setSucio] = React.useState(false)

  const cargar = React.useCallback((a) => {
    setOriginal(a)
    setTitulo(a.titulo)
    setSlug(a.slug)
    setSlugEditado(true)
    setResumen(a.resumen || '')
    setPortada(a.portada || '')
    setBloques((a.bloques || []).map(conId))
    setPublicado(a.publicado)
    setSucio(false)
  }, [])

  React.useEffect(() => {
    if (nuevo) return
    setCargando(true)
    api.articulos
      .getAdmin(id)
      .then(cargar)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [id, nuevo, cargar])

  // Aviso del navegador si hay cambios sin guardar
  React.useEffect(() => {
    if (!sucio) return
    const f = (e) => e.preventDefault()
    window.addEventListener('beforeunload', f)
    return () => window.removeEventListener('beforeunload', f)
  }, [sucio])

  const tocar = (fn) => (...args) => {
    setSucio(true)
    setAviso('')
    return fn(...args)
  }

  const cambiarTitulo = tocar((v) => {
    setTitulo(v)
    if (!slugEditado && nuevo) setSlug(v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
  })

  const agregar = tocar((tipo) => setBloques((l) => [...l, conId({ tipo, texto: '', url: '', pie: '' })]))
  const editar = tocar((_id, cambios) => setBloques((l) => l.map((b) => (b._id === _id ? { ...b, ...cambios } : b))))
  const quitar = tocar((_id) => setBloques((l) => l.filter((b) => b._id !== _id)))
  const mover = tocar((_id, delta) =>
    setBloques((l) => {
      const i = l.findIndex((b) => b._id === _id)
      const j = i + delta
      if (i < 0 || j < 0 || j >= l.length) return l
      const copia = [...l]
      ;[copia[i], copia[j]] = [copia[j], copia[i]]
      return copia
    }),
  )

  const subir = async (archivo, alTerminar, etiqueta) => {
    if (!archivo) return
    setSubiendo(etiqueta)
    setError('')
    try {
      const listo = await prepararImagen(archivo)
      const { url } = await api.articulos.uploadImage(listo)
      alTerminar(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubiendo('')
    }
  }

  const guardar = async (publicar) => {
    if (titulo.trim().length < 3) {
      setError('Ponele un título al artículo.')
      return
    }
    setGuardando(true)
    setError('')
    setAviso('')
    const datos = {
      titulo,
      slug: slug || undefined,
      resumen,
      portada: portada || null,
      bloques: bloques.map(sinId),
      publicado: publicar === undefined ? publicado : publicar,
    }
    try {
      const a = nuevo ? await api.articulos.create(datos) : await api.articulos.update(id, datos)
      setSucio(false)
      if (nuevo) {
        navigate(`/admin/articulos/${a.id}`, { replace: true })
      } else {
        cargar(a)
        setAviso(a.publicado ? 'Guardado y publicado.' : 'Guardado como borrador.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!window.confirm('¿Eliminar este artículo? No se puede deshacer.')) return
    try {
      await api.articulos.remove(id)
      setSucio(false)
      navigate('/admin/articulos')
    } catch (e) {
      setError(e.message)
    }
  }

  if (cargando) return <p className="admin-muted">Cargando…</p>

  return (
    <>
      <PageHeader
        title={nuevo ? 'Nuevo artículo' : 'Editar artículo'}
        subtitle={<Link to="/admin/articulos">← Volver a los artículos</Link>}
        actions={
          <>
            <Btn variant="ghost" onClick={() => setVista((v) => !v)}>
              {vista ? 'Seguir editando' : 'Vista previa'}
            </Btn>
            {original?.publicado && (
              <a className="admin-btn admin-btn--ghost" href={`/articulos/${original.slug}`} target="_blank" rel="noreferrer">
                Ver en la web
              </a>
            )}
            <Btn variant="ghost" onClick={() => guardar()} disabled={guardando || !!subiendo}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </Btn>
            {!publicado ? (
              <Btn onClick={() => guardar(true)} disabled={guardando || !!subiendo}>
                Publicar
              </Btn>
            ) : (
              <Btn variant="ghost" onClick={() => guardar(false)} disabled={guardando || !!subiendo}>
                Pasar a borrador
              </Btn>
            )}
          </>
        }
      />
      <ErrorBox message={error} />
      {aviso && <div className="art-ok">{aviso}</div>}

      {vista ? (
        <Card title="Vista previa">
          <div className="art-prev">
            <h1 className="art-prev-titulo">{titulo || 'Sin título'}</h1>
            {resumen && <p className="art-prev-bajada">{resumen}</p>}
            {portada && <img className="art-prev-portada" src={portada} alt="" />}
            <ArticuloContenido bloques={bloques.map(sinId)} />
          </div>
        </Card>
      ) : (
        <div className="art-editor">
          <Card title="Datos">
            <div className="art-datos">
              <Field label="Título">
                <input value={titulo} onChange={(e) => cambiarTitulo(e.target.value)} maxLength={200} placeholder="Ej: Cómo automatizar los cobros de un gimnasio" />
              </Field>
              <Field label="Dirección (URL)">
                <input
                  value={slug}
                  onChange={tocar((e) => {
                    setSlug(e.target.value)
                    setSlugEditado(true)
                  })}
                  maxLength={160}
                  placeholder="se arma sola a partir del título"
                />
              </Field>
              <small className="admin-muted">codigonortesoluciones.com/articulos/{slug || '…'}</small>
              <Field label="Resumen (se ve en el listado y en Google)">
                <textarea value={resumen} onChange={tocar((e) => setResumen(e.target.value))} rows={3} maxLength={600} />
              </Field>
              <div className="art-portada-ed">
                <span className="art-etq">Imagen de portada</span>
                {portada ? (
                  <div className="art-portada-prev">
                    <img src={portada} alt="" />
                    <Btn variant="ghost" onClick={tocar(() => setPortada(''))}>
                      Quitar
                    </Btn>
                  </div>
                ) : (
                  <label className="art-subir">
                    {subiendo === 'portada' ? 'Subiendo…' : 'Elegir imagen'}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => { subir(e.target.files[0], tocar(setPortada), 'portada'); e.target.value = '' }} />
                  </label>
                )}
              </div>
            </div>
          </Card>

          <Card title="Contenido">
            {bloques.length === 0 && <p className="admin-muted">Armá el artículo sumando bloques: títulos de sección, textos, imágenes, listas…</p>}
            <div className="art-bloques">
              {bloques.map((b, i) => {
                const def = TIPOS.find((t) => t.tipo === b.tipo)
                return (
                  <div key={b._id} className={`art-bloque art-bloque--${b.tipo}`}>
                    <div className="art-bloque-hd">
                      <Select size="compact" value={b.tipo} onChange={(e) => editar(b._id, { tipo: e.target.value })}>
                        {TIPOS.map((t) => (
                          <option key={t.tipo} value={t.tipo}>
                            {t.label}
                          </option>
                        ))}
                      </Select>
                      <div className="art-bloque-acc">
                        <button type="button" onClick={() => mover(b._id, -1)} disabled={i === 0} aria-label="Subir">↑</button>
                        <button type="button" onClick={() => mover(b._id, 1)} disabled={i === bloques.length - 1} aria-label="Bajar">↓</button>
                        <button type="button" onClick={() => quitar(b._id)} aria-label="Eliminar bloque">✕</button>
                      </div>
                    </div>
                    {b.tipo === 'imagen' ? (
                      <div className="art-img-ed">
                        {b.url ? (
                          <img src={b.url} alt="" />
                        ) : (
                          <label className="art-subir">
                            {subiendo === b._id ? 'Subiendo…' : 'Elegir imagen'}
                            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => { subir(e.target.files[0], (url) => editar(b._id, { url }), b._id); e.target.value = '' }} />
                          </label>
                        )}
                        <input value={b.pie || ''} onChange={(e) => editar(b._id, { pie: e.target.value })} maxLength={300} placeholder="Pie de la imagen (opcional)" />
                        {b.url && (
                          <Btn variant="ghost" onClick={() => editar(b._id, { url: '' })}>
                            Cambiar imagen
                          </Btn>
                        )}
                      </div>
                    ) : b.tipo === 'titulo' || b.tipo === 'subtitulo' ? (
                      <input className="art-linea" value={b.texto || ''} onChange={(e) => editar(b._id, { texto: e.target.value })} maxLength={200} placeholder={def?.label} />
                    ) : (
                      <>
                        <textarea className="art-texto" value={b.texto || ''} onChange={(e) => editar(b._id, { texto: e.target.value })} rows={b.tipo === 'texto' ? 7 : 4} placeholder={def?.label} />
                        {def?.ayuda && <small className="admin-muted">{def.ayuda}</small>}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="art-agregar">
              <span className="art-etq">Agregar</span>
              {TIPOS.map((t) => (
                <button key={t.tipo} type="button" onClick={() => agregar(t.tipo)}>
                  + {t.label}
                </button>
              ))}
            </div>
          </Card>

          {!nuevo && (
            <div className="art-peligro">
              <Btn variant="ghost" onClick={eliminar}>
                Eliminar artículo
              </Btn>
            </div>
          )}
        </div>
      )}
    </>
  )
}
