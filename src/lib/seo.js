import { HOME, SISTEMAS } from '../../seo/seo.config.mjs'

/**
 * Mantiene el título y la descripción de la pestaña en sintonía con lo que se está viendo
 * (la página prerenderizada ya los trae para Google; esto cubre la navegación dentro de la app).
 */
export function setPageMeta(title, description) {
  if (typeof document === 'undefined') return
  document.title = title
  const meta = document.querySelector('meta[name="description"]')
  if (meta && description) meta.setAttribute('content', description)
}

/** Metadatos de la página según la pestaña de sistemas elegida (null = inicio). */
export function metaForTab(tabId) {
  const s = SISTEMAS.find((x) => x.tab === tabId)
  return s ? { title: s.title, description: s.description } : { title: HOME.title, description: HOME.description }
}
