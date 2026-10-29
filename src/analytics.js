/**
 * Eventos de GA4 de la landing. El admin (Embudo) lee estos nombres desde el backend
 * (backend/src/analytics/ga4.service.ts): no renombrarlos sin cambiar ahí también.
 *
 *   view_planes   → la sección de planes entró en pantalla (una vez por visita)
 *   select_plan   → clic en el botón de un plan
 *   contact_click → clic en WhatsApp o en el email (param `canal` y `ubicacion`)
 *   tutorial_step → el visitante eligió un paso del tutorial (param `paso`)
 *   ask_question  → hizo una pregunta en el chat (param `origen` y `tema`, nunca el texto escrito)
 */

function send(name, params) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

function ubicacionDe(link) {
  if (link.closest('.wa-float')) return 'flotante'
  const seccion = link.closest('section[id]')
  if (seccion) return seccion.id
  if (link.closest('nav, header')) return 'menu'
  if (link.closest('footer')) return 'footer'
  return 'otro'
}

/** Evento de la landing que no sale de un clic en un link. */
export function track(name, params) {
  send(name, params)
}

/** Engancha los eventos de la landing. Devuelve la función que los quita. */
export function startLandingTracking() {
  if (typeof document === 'undefined') return () => {}

  const onClick = (event) => {
    const link = event.target?.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href') || ''
    if (/wa\.me|api\.whatsapp\.com|^mailto:/i.test(href)) {
      send('contact_click', {
        canal: href.startsWith('mailto:') ? 'email' : 'whatsapp',
        ubicacion: ubicacionDe(link),
      })
    } else if (link.closest('.plan-cta')) {
      send('select_plan', { destino: href })
    }
  }
  document.addEventListener('click', onClick, true)

  let observer = null
  const planes = document.getElementById('planes')
  if (planes && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          send('view_planes')
          observer.disconnect()
        }
      },
      // La sección es mucho más alta que la pantalla: un umbral por porcentaje nunca se cumpliría.
      // Cuenta cuando el borde superior de la sección sube del 70% de la altura de la pantalla.
      { threshold: 0, rootMargin: '0px 0px -30% 0px' },
    )
    observer.observe(planes)
  }

  return () => {
    document.removeEventListener('click', onClick, true)
    observer?.disconnect()
  }
}
