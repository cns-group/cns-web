import { sectionClick } from './scroll'

export function Nav({ c, onContact, onSection }) {
  return (
    <nav className="nav">
      <a
        className="nav-logo"
        href="#top"
        onClick={sectionClick('top', onSection)}
      >
        <img
          src="/cnslogo.png"
          alt="Código Norte"
          style={{ width: 68 }}
        />
      </a>
      <div className="nav-links">
        {c.nav.links.map(l => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={sectionClick(l.id, onSection)}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-cta">
        <span className="pill" style={{display:'inline-flex'}}>
          <span className="dot pulse" />
          <span>{c.nav.status}</span>
        </span>
        <button className="btn btn-primary" onClick={sectionClick('planes', onSection)}>
          {c.nav.cta}
          <svg className="arr" width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
    </nav>
  )
}

export function Hero({ c, lang, onContact, onSection }) {
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
            <div className="row" style={{marginTop:28, flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-lg" onClick={sectionClick('planes', onSection)}>
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
