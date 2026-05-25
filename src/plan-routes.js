/** IDs internos de pestaña en copy.plans.tabs */
export const PLAN_TAB_IDS = ['ecommerce', 'ticket', 'gastro', 'gym', 'queue', 'landing']

/** Slug en URL → id de pestaña */
const SLUG_TO_TAB = {
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
}

/** id de pestaña → slug canónico para compartir */
export const TAB_TO_SLUG = {
  ecommerce: 'ecommerce',
  ticket: 'e-ticketera',
  gastro: 'gastronomia',
  gym: 'gimnasios',
  queue: 'turneros',
  landing: 'landing',
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
