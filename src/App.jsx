import React from 'react'
import { COPY } from './copy'
import { Nav, Hero, Marquee } from './sections-top'
import { Process } from './sections-mid'
import { Plans } from './sections-plans'
import { Work, Quotes, FAQ, Contact, Footer } from './sections-bot'
import { scrollToSection } from './scroll'
import { WhatsAppFloat } from './whatsapp-float'
import { parsePlanTabFromPath, setPlanPath } from './plan-routes'
import { TWEAK_DEFAULTS, applyTheme } from './theme-config'
import { startParallax } from './reveal'

export default function App() {
  const [t] = React.useState(TWEAK_DEFAULTS)
  const c = COPY[t.lang] || COPY.es
  const contactRef = React.useRef(null)
  const [planTab, setPlanTab] = React.useState(
    () => parsePlanTabFromPath() || 'ecommerce',
  )

  React.useEffect(() => { applyTheme(t) }, [t])

  React.useEffect(() => startParallax(), [])

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
      <Nav c={c} onSection={scrollToSection} />
      <main id="main">
        <Hero c={c} onSection={scrollToSection} />
        <Marquee items={c.marquee} />
        <Process c={c} />
        <Plans c={c} lang={t.lang} activeTab={planTab} onTabChange={handlePlanTabChange} />
        <Work c={c} />
        <Quotes c={c} />
        <FAQ c={c} />
        <Contact c={c} ctaRef={contactRef} />
      </main>
      <Footer c={c} />
      <WhatsAppFloat />
    </div>
  )
}
