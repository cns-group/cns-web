import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { COPY } from './copy'
import { LegalPageShell } from './legal-pages'
import { ArticuloContenido, minutosDeLectura } from './articulo-contenido'
import { TWEAK_DEFAULTS, applyTheme } from './theme-config'
import { WHATSAPP_URL } from './constants'
import './articulos.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
const SITIO = 'https://www.codigonortesoluciones.com'

async function pedir(ruta) {
  const res = await fetch(`${API_BASE}${ruta}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

/** Título, descripción y datos estructurados de la página, que se restauran al salir. */
function useMeta({ titulo, descripcion, canonical, jsonld }) {
  React.useEffect(() => {
    const previo = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const descPrevia = metaDesc?.getAttribute('content')
    const link = document.querySelector('link[rel="canonical"]')
    const canonPrevio = link?.getAttribute('href')

    document.title = titulo
    metaDesc?.setAttribute('content', descripcion || '')
    link?.setAttribute('href', canonical)
    let script
    if (jsonld) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonld)
      document.head.appendChild(script)
    }
    return () => {
      document.title = previo
      if (descPrevia != null) metaDesc?.setAttribute('content', descPrevia)
      if (canonPrevio != null) link?.setAttribute('href', canonPrevio)
      script?.remove()
    }
  }, [titulo, descripcion, canonical, jsonld])
}

function usePagina() {
  const [t] = React.useState(TWEAK_DEFAULTS)
  React.useEffect(() => {
    applyTheme(t)
  }, [t])
  return COPY[t.lang] || COPY.es
}

export function ArticulosPage() {
  const c = usePagina()
  const [lista, setLista] = React.useState(null)
  const [error, setError] = React.useState(false)

  useMeta({
    titulo: 'Artículos | Código Norte Soluciones',
    descripcion: 'Guías y explicaciones sobre sistemas a medida, automatización e inteligencia artificial para pymes.',
    canonical: `${SITIO}/articulos`,
  })

  React.useEffect(() => {
    pedir('/articulos').then(setLista).catch(() => setError(true))
  }, [])

  return (
    <LegalPageShell c={c}>
      <section className="art-lista">
        <header className="art-lista-hd">
          <h1>Artículos</h1>
          <p>Guías y explicaciones sobre sistemas a medida, automatización e inteligencia artificial para pymes.</p>
        </header>
        {error && <p className="art-aviso">No pudimos cargar los artículos. Probá de nuevo en un rato.</p>}
        {lista && lista.length === 0 && <p className="art-aviso">Estamos preparando los primeros artículos. Volvé pronto.</p>}
        <div className="art-grid">
          {(lista || []).map((a) => (
            <Link key={a.id} to={`/articulos/${a.slug}`} className="art-card">
              {a.portada && <img src={a.portada} alt="" loading="lazy" decoding="async" />}
              <div className="art-card-txt">
                <time dateTime={a.publicadoEn}>{fecha(a.publicadoEn)}</time>
                <h2>{a.titulo}</h2>
                {a.resumen && <p>{a.resumen}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </LegalPageShell>
  )
}

export function ArticuloPage() {
  const { slug } = useParams()
  const c = usePagina()
  const [articulo, setArticulo] = React.useState(undefined) // undefined = cargando, null = no existe
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    setArticulo(undefined)
    setError(false)
    window.scrollTo(0, 0)
    pedir(`/articulos/${encodeURIComponent(slug)}`).then(setArticulo).catch(() => setError(true))
  }, [slug])

  const url = `${SITIO}/articulos/${slug}`
  const jsonld = React.useMemo(
    () =>
      articulo
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: articulo.titulo,
            description: articulo.resumen || undefined,
            image: articulo.portada ? `${SITIO}${articulo.portada}` : undefined,
            datePublished: articulo.publicadoEn,
            dateModified: articulo.updatedAt,
            author: { '@type': 'Organization', name: 'Código Norte Soluciones' },
            publisher: { '@type': 'Organization', name: 'Código Norte Soluciones', logo: { '@type': 'ImageObject', url: `${SITIO}/cnslogo.png` } },
            mainEntityOfPage: url,
          }
        : null,
    [articulo, url],
  )
  useMeta({
    titulo: articulo ? `${articulo.titulo} | Código Norte Soluciones` : 'Artículos | Código Norte Soluciones',
    descripcion: articulo?.resumen || '',
    canonical: url,
    jsonld,
  })

  return (
    <LegalPageShell c={c}>
      <article className="art-pagina">
        <Link to="/articulos" className="art-volver">
          ← Todos los artículos
        </Link>
        {error && <p className="art-aviso">No pudimos cargar el artículo. Probá de nuevo en un rato.</p>}
        {articulo === null && (
          <p className="art-aviso">
            Este artículo no existe o todavía no está publicado. <Link to="/articulos">Ver todos los artículos</Link>
          </p>
        )}
        {articulo && (
          <>
            <header className="art-hd">
              <h1>{articulo.titulo}</h1>
              {articulo.resumen && <p className="art-bajada">{articulo.resumen}</p>}
              <p className="art-meta">
                <time dateTime={articulo.publicadoEn}>{fecha(articulo.publicadoEn)}</time> · {minutosDeLectura(articulo.bloques)} min de lectura
              </p>
            </header>
            {articulo.portada && (
              <figure className="art-portada">
                <img src={articulo.portada} alt="" decoding="async" />
              </figure>
            )}
            <ArticuloContenido bloques={articulo.bloques} />
            <aside className="art-cierre">
              <h2>¿Querés aplicar esto en tu negocio?</h2>
              <p>Te hacemos una auditoría gratis de 15 minutos y te mostramos qué se puede automatizar.</p>
              <a
                className="art-cta"
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola! Leí el artículo "${articulo.titulo}" en su web y quiero agendar una llamada para ver cómo aplicarlo en mi negocio.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Agendá una llamada por WhatsApp
              </a>
            </aside>
          </>
        )}
      </article>
    </LegalPageShell>
  )
}
