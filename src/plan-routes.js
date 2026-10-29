/** IDs internos de pestaña en copy.plans.tabs que se muestran y tienen ruta */
// Ocultas temporalmente: 'landing', 'ticket'
export const PLAN_TAB_IDS = ['ecommerce', 'gym', 'queue', 'gastro', 'clinic', 'pos']

/** Slug en URL → id de pestaña */
const SLUG_TO_TAB = {
  // slugs actuales (los que indexa Google)
  'tienda-online': 'ecommerce',
  'software-para-gimnasios': 'gym',
  'sistema-de-turnos': 'queue',
  'software-para-restaurantes': 'gastro',
  'software-para-clinicas': 'clinic',
  'sistema-pos': 'pos',
  // slugs anteriores: siguen resolviendo (Vercel los redirige a los nuevos)
  ecommerce: 'ecommerce',
  'e-ticketera': 'ticket',
  ticketera: 'ticket',
  gastronomia: 'gastro',
  gastro: 'gastro',
  gimnasios: 'gym',
  gym: 'gym',
  turneros: 'queue',
  turnero: 'queue',
  'landing-pro': 'landing',
  landing: 'landing',
  'clinica-medica': 'clinic',
  clinica: 'clinic',
  pos: 'pos',
}

/** id de pestaña → slug canónico para compartir */
export const TAB_TO_SLUG = {
  ecommerce: 'tienda-online',
  ticket: 'e-ticketera',
  gastro: 'software-para-restaurantes',
  gym: 'software-para-gimnasios',
  queue: 'sistema-de-turnos',
  landing: 'landing',
  clinic: 'software-para-clinicas',
  pos: 'sistema-pos',
}

export function parsePlanTabFromPath(pathname = window.location.pathname) {
  const segment = pathname.replace(/^\/+|\/+$/g, '').split('/')[0]?.toLowerCase()
  if (!segment) return null
  const tabId = SLUG_TO_TAB[segment]
  return PLAN_TAB_IDS.includes(tabId) ? tabId : null
}

export function planPathForTab(tabId) {
  const slug = TAB_TO_SLUG[tabId]
  return slug ? `/${slug}` : '/'
}

export function setPlanPath(tabId, { replace = false } = {}) {
  const path = planPathForTab(tabId)
  const url = `${path}${window.location.search}${window.location.hash}`
  if (replace) {
    window.history.replaceState({ planTab: tabId }, '', url)
  } else {
    window.history.pushState({ planTab: tabId }, '', url)
  }
}

export function clearPlanPath() {
  const url = `/${window.location.search}${window.location.hash}`
  window.history.replaceState({}, '', url)
}
