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
          aria-label="Código Norte · inicio"
          onClick={go('top')}
        >
          <img
            src="/cnslogo.png"
            alt=""
            width={68}
            height={68}
            decoding="async"
            style={{ width: 68, height: 'auto' }}
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
              <svg className="arr" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
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
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">{c.hero.eyebrow}</div>
          <h1>
            <span className="word">{c.hero.titleA} </span>
            <span className="word">{c.hero.titleB}</span><br/>
            <span className="word accent">{c.hero.titleC}</span>
            <span className="word"> {c.hero.titleD}</span>
          </h1>
          <p className="lead">{c.hero.lead}</p>
          <div className="row hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={sectionClick('planes', onSection)}>
              {c.nav.cta}
              <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <a
              className="btn btn-ghost btn-lg"
              href="#proceso"
              onClick={sectionClick('proceso', onSection)}
            >
              {c.nav.ctaGhost}
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="browser-frame">
            <div className="browser-bar">
              <span className="bdot r" /><span className="bdot y" /><span className="bdot g" />
            </div>
            <img
              className="browser-img"
              src="/dashboard-hero.png"
              alt=""
              width={1905}
              height={950}
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
