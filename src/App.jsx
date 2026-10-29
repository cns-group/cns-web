import React from 'react'
import { COPY } from './copy'
import { Nav, Hero } from './sections-top'
import { Tutorial } from './sections-tutorial'
import { AiSection } from './sections-ia'
import { Plans } from './sections-plans'
import { Work, Quotes, Contact, Footer } from './sections-bot'
import { scrollToSection, sectionClick } from './scroll'
import { WhatsAppFloat } from './whatsapp-float'
import { parsePlanTabFromPath, setPlanPath } from './plan-routes'
import { TWEAK_DEFAULTS, applyTheme } from './theme-config'
import { startParallax } from './reveal'
import { WorldCanvas } from './world-canvas'
import { Tagline } from './tagline'
import { startLandingTracking } from './analytics'
import { iaMeta, metaForTab, setPageMeta } from './lib/seo'

function ChapterRail() {
  const chapters = [
    ['01', 'Inicio', 'top'],
    ['02', 'Cómo trabajamos', 'proceso'],
    ['03', 'Soluciones', 'planes'],
    ['04', 'Casos', 'casos'],
    ['05', 'Contacto', 'contacto'],
  ]

  return (
    <nav className="chapter-rail" aria-label="Capítulos">
      <ul>
        {chapters.map(([number, label, id]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={sectionClick(id, scrollToSection)}>
              <span>{number}</span>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function App() {
  const [t] = React.useState(TWEAK_DEFAULTS)
  const c = COPY[t.lang] || COPY.es
  const contactRef = React.useRef(null)
  const [planTab, setPlanTab] = React.useState(
    () => parsePlanTabFromPath() || 'ecommerce',
  )

  React.useEffect(() => { applyTheme(t) }, [t])

  React.useEffect(() => startParallax(), [])

  // Título y descripción de la pestaña acordes al sistema que se está mirando (/ecommerce, /gimnasios…).
  React.useEffect(() => {
    const onIaPath = window.location.pathname.replace(/\/+$/, '') === '/sistemas-de-ia'
    const onPlanPath = Boolean(parsePlanTabFromPath())
    const m = onIaPath ? iaMeta : metaForTab(onPlanPath ? planTab : null)
    setPageMeta(m.title, m.description)
  }, [planTab])

  React.useEffect(() => startLandingTracking(), [])

  React.useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, '') !== '/sistemas-de-ia') return
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection('ia')))
  }, [])

  React.useEffect(() => {
    const fromPath = parsePlanTabFromPath()
    if (!fromPath) return
    setPlanTab(fromPath)
    const scroll = () => scrollToSection('planes')
    requestAnimationFrame(() => requestAnimationFrame(scroll))
  }, [])

  React.useEffect(() => {
    const onPopState = () => {
      const fromPath = parsePlanTabFromPath()
      if (fromPath) {
        setPlanTab(fromPath)
        scrollToSection('planes')
      } else {
        setPlanTab('ecommerce')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handlePlanTabChange = React.useCallback((tabId) => {
    setPlanTab(tabId)
    setPlanPath(tabId)
    scrollToSection('planes')
  }, [])

  return (
    <div className="app">
      <WorldCanvas />
      <Nav c={c} onSection={scrollToSection} />
      <main id="main">
        <ChapterRail />
        <Hero c={c} onSection={scrollToSection} />
        <Tutorial />
        <AiSection />
        <Tagline label="Nuestra mirada" lines={['El software bien hecho no es un gasto.', 'Es la base sobre la que tu negocio crece.']} />
        <Plans c={c} lang={t.lang} activeTab={planTab} onTabChange={handlePlanTabChange} />
        <Work c={c} />
        <Quotes c={c} />
        <Contact c={c} ctaRef={contactRef} />
      </main>
      <Footer c={c} />
      <WhatsAppFloat />
    </div>
  )
}
