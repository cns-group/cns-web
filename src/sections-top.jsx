export function Nav({ c, onContact }) {
  return (
    <nav className="nav">
      <a className="nav-logo" href="#top">
        <span className="mark">CN</span>
        <span>Código&nbsp;Norte</span>
      </a>
      <div className="nav-links">
        {c.nav.links.map(l => (
          <a key={l.id} href={`#${l.id}`}>{l.label}</a>
        ))}
      </div>
      <div className="nav-cta">
        <span className="pill" style={{display:'inline-flex'}}>
          <span className="dot pulse" />
          <span>{c.nav.status}</span>
        </span>
        <button className="btn btn-primary" onClick={onContact}>
          {c.nav.cta}
          <svg className="arr" width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
    </nav>
  )
}

function HeroTerminal({ lang }) {
  const lines = lang === 'es'
    ? [
        ['com', '// código-norte / build.sh'],
        ['cmd', <><span className="prompt">$</span> <span className="key">npm</span> create codigo-norte <span className="str">"mi-tienda"</span></>],
        ['out', <>✓ Stack: <span className="str">React + Node + PostgreSQL</span></>],
        ['out', <>✓ Pagos: <span className="str">Mercado Pago + MODO</span></>],
        ['out', <>✓ Factura: <span className="str">AFIP WS habilitado</span></>],
        ['cmd', <><span className="prompt">$</span> <span className="key">npm</span> run deploy --prod</>],
        ['out', <>→ <span className="str">https://mi-tienda.com.ar</span></>],
        ['out', <>→ <span style={{color:'var(--accent-2)'}}>Listo en 28 días.</span> ▍</>],
      ]
    : [
        ['com', '// codigo-norte / build.sh'],
        ['cmd', <><span className="prompt">$</span> <span className="key">npm</span> create codigo-norte <span className="str">"my-store"</span></>],
        ['out', <>✓ Stack: <span className="str">React + Node + PostgreSQL</span></>],
        ['out', <>✓ Payments: <span className="str">Mercado Pago + Stripe</span></>],
        ['out', <>✓ Invoicing: <span className="str">AFIP WS enabled</span></>],
        ['cmd', <><span className="prompt">$</span> <span className="key">npm</span> run deploy --prod</>],
        ['out', <>→ <span className="str">https://my-store.com.ar</span></>],
        ['out', <>→ <span style={{color:'var(--accent-2)'}}>Live in 28 days.</span> ▍</>],
      ]
  return (
    <div className="term">
      <div className="term-hd">
        <span className="dot" style={{background:'#e76161'}} />
        <span className="dot" style={{background:'#e6c463'}} />
        <span className="dot" style={{background:'#7a8f5c'}} />
        <span className="label">~ / build.sh</span>
      </div>
      <div className="term-body">
        {lines.map(([k, l], i) => (
          <div key={i} className={k}>{l}</div>
        ))}
      </div>
    </div>
  )
}

export function Hero({ c, lang, onContact }) {
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
            <span className="word italic">{c.hero.titleB}</span><br/>
            <span className="word accent">{c.hero.titleC}</span>
            <span className="word"> {c.hero.titleD}</span>
          </h1>
        </div>

        <div className="hero-tail">
          <div>
            <p className="lead">{c.hero.lead}</p>
            <div className="row" style={{marginTop:28, flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-lg" onClick={onContact}>
                {c.nav.cta}
                <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
              <a className="btn btn-ghost btn-lg" href="#casos">{c.nav.ctaGhost}</a>
            </div>
          </div>
          <HeroTerminal lang={lang} />
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
