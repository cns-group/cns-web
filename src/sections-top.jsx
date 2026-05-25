import React from 'react'
import { sectionClick } from './scroll'
import { WHATSAPP_URL } from './constants'

export function Nav({ c, onSection }) {
  const [open, setOpen] = React.useState(false)

  const close = () => setOpen(false)
  const go = (id) => (e) => {
    sectionClick(id, onSection)(e)
    close()
  }

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className="nav">
        <a
          className="nav-logo"
          href="#top"
          onClick={go('top')}
        >
          <img
            src="/cnslogo.png"
            alt="Código Norte"
            style={{ width: 68 }}
          />
        </a>

        <div className="nav-links" aria-label="Principal">
          {c.nav.links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <div className="nav-cta nav-cta--desktop">
            <span className="pill nav-status">
              <span className="dot pulse" />
              <span>{c.nav.status}</span>
            </span>
            <button type="button" className="btn btn-primary nav-cta-btn" onClick={go('planes')}>
              {c.nav.cta}
              <svg className="arr" width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        id="nav-drawer"
        className={`nav-drawer${open ? ' open' : ''}`}
        aria-hidden={!open}
        onClick={close}
      >
        <div className="nav-drawer-panel" onClick={e => e.stopPropagation()}>
          <div className="nav-drawer-hd">
            <span className="nav-drawer-title">Menú</span>
            <button type="button" className="nav-drawer-close" aria-label="Cerrar" onClick={close}>×</button>
          </div>
          <nav className="nav-drawer-links" aria-label="Menú móvil">
            {c.nav.links.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>
            ))}
          </nav>
          <div className="nav-drawer-cta">
            <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={go('planes')}>
              {c.nav.cta}
            </button>
            <a
              className="btn btn-ghost btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export function Hero({ c, onSection }) {
  return (
    <section className="hero" id="top">
      <span className="crosshair tl" />
      <span className="crosshair tr" />
      <span className="crosshair bl" />
      <span className="crosshair br" />

      <div className="hero-corner">
        <span>{c.hero.cornerLine1}</span>
        <span>{c.hero.cornerLine2}</span>
        <span>● {c.hero.footStatus}</span>
      </div>

      <div className="hero-grid">
        <div>
          <div className="eyebrow" style={{marginBottom:28}}>{c.hero.eyebrow}</div>
          <h1>
            <span className="word">{c.hero.titleA} </span>
            <span className="word">{c.hero.titleB}</span><br/>
            <span className="word accent">{c.hero.titleC}</span>
            <span className="word"> {c.hero.titleD}</span>
          </h1>
        </div>

        <div className="hero-tail">
          <div>
            <p className="lead">{c.hero.lead}</p>
            <div className="row hero-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={sectionClick('planes', onSection)}>
                {c.nav.cta}
                <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
              <a
                className="btn btn-ghost btn-lg"
                href="#casos"
                onClick={sectionClick('casos', onSection)}
              >
                {c.nav.ctaGhost}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Marquee({ items }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}
