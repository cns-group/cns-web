import React from 'react'
import { SectionHeader } from './sections-mid'
import { WorkScreen } from './mockups'
import { WHATSAPP_URL, WHATSAPP_DISPLAY, EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from './constants'

function WorkCard({ it, i }) {
  return (
    <article className="work-card work-slide">
      <div className="work-meta">
        <div className="work-cat">{it.cat}</div>
        <div className="work-cat">// {it.n ?? String(i + 1).padStart(2, '0')}</div>
      </div>
      <h3 className="work-title">
        {it.url ? (
          <a href={it.url} target="_blank" rel="noopener noreferrer">{it.t}</a>
        ) : (
          it.t
        )}
      </h3>
      <div className="work-screen">
        {it.image ? (
          it.url ? (
            <a href={it.url} target="_blank" rel="noopener noreferrer" className="work-screen-link">
              <img className="work-img" src={it.image} alt={it.t} loading="lazy" decoding="async" width={1200} height={750} />
            </a>
          ) : (
            <img className="work-img" src={it.image} alt={it.t} loading="lazy" decoding="async" width={1200} height={750} />
          )
        ) : (
          <WorkScreen kind={it.kind} />
        )}
      </div>
      <p className="work-desc">{it.m}</p>
    </article>
  )
}

export function Work({ c }) {
  const w = c.work
  const count = w.items.length
  const [active, setActive] = React.useState(0)
  const trackRef = React.useRef(null)

  const goTo = React.useCallback((idx) => {
    const next = ((idx % count) + count) % count
    trackRef.current?.children[next]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    setActive(next)
  }, [count])

  React.useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const slides = [...track.children]
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!best) return
        const idx = slides.indexOf(best.target)
        if (idx >= 0) setActive(idx)
      },
      { root: track, threshold: [0.55, 0.75, 1] },
    )

    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [count])

  return (
    <section className="sec" id="casos">
      <SectionHeader num={w.num} title={w.title} titleEm={w.titleEm} lead={w.lead} />
      <div className="work-wrap">
        <div className="work-carousel" aria-roledescription="carousel" aria-label={w.title}>
          <div className="work-carousel-controls">
            <span className="work-carousel-count" aria-live="polite">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <div className="work-carousel-nav">
              <button
                type="button"
                className="work-carousel-btn"
                aria-label={w.carouselPrev}
                onClick={() => goTo(active - 1)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="work-carousel-dots" role="tablist" aria-label={w.carouselDots}>
                {w.items.map((it, i) => (
                  <button
                    key={it.n ?? i}
                    type="button"
                    role="tab"
                    className={`work-carousel-dot${active === i ? ' active' : ''}`}
                    aria-label={`${it.t} (${i + 1}/${count})`}
                    aria-selected={active === i}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="work-carousel-btn"
                aria-label={w.carouselNext}
                onClick={() => goTo(active + 1)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="work-carousel-track" ref={trackRef}>
            {w.items.map((it, i) => (
              <WorkCard key={it.n ?? i} it={it} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Stack({ c }) {
  const s = c.stack
  return (
    <section className="sec" id="stack">
      <SectionHeader num={s.num} title={s.title} titleEm={s.titleEm} lead={s.lead} />
      <div className="stack-list">
        {s.items.map((it, i) => (
          <div key={i} className="stack-item">
            <span className="stack-cat">{String(i+1).padStart(2,'0')} · {it.c}</span>
            <span className="stack-name">{it.n}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Quotes({ c }) {
  const q = c.quotes
  return (
    <section className="sec">
      <SectionHeader num={q.num} title={q.title} titleEm={q.titleEm} lead={q.lead} />
      <div className="quotes">
        {q.items.map((it, i) => (
          <figure key={i} className="quote">
            <span className="quote-index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="quote-mark" aria-hidden="true">“</span>
            <blockquote className="quote-text">{it.q}</blockquote>
            <figcaption className="quote-by">
              <div className="quote-av">{it.av}</div>
              <div className="quote-who">
                <b>{it.who}</b>
                <span>{it.role}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Metrics({ c }) {
  return (
    <section className="metrics">
      {c.metrics.items.map((m, i) => (
        <div key={i} className="metric">
          <div className="metric-n">{m.n}<span className="u">{m.u}</span></div>
          <div className="metric-l">{m.l}</div>
        </div>
      ))}
    </section>
  )
}

export function FAQ({ c }) {
  const [open, setOpen] = React.useState(0)
  const f = c.faq
  return (
    <section className="sec">
      <SectionHeader num={f.num} title={f.title} titleEm={f.titleEm} />
      <div className="faq">
        {f.items.map((it, i) => (
          <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
            <h3 className="faq-q-wrap">
              <button
                id={`faq-q-${i}`}
                type="button"
                className="faq-q"
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span>{it.q}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </button>
            </h3>
            <p className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contact({ c, ctaRef }) {
  const cc = c.contact
  return (
    <section className="sec" id="contacto" ref={ctaRef}>
      <SectionHeader num={cc.num} title={cc.title} titleEm={cc.titleEm} lead={cc.lead} />
      <div className="contact-wa">
        <div className="contact-wa-main">
          <p className="contact-wa-lead">{cc.waLead}</p>
          <a
            className="btn btn-primary btn-lg contact-wa-btn"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cc.waCta}
            <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </a>
          <p className="contact-wa-hint">{cc.waHint}</p>
        </div>
        <aside className="contact-aside">
          <div className="contact-card">
            <h4>{cc.aside[0].h}</h4>
            <p>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
          <div className="contact-card">
            <h4>{cc.aside[1].h}</h4>
            <p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a>
            </p>
          </div>
          <div className="contact-card">
            <h4>Instagram</h4>
            <p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a>
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function Footer({ c }) {
  const f = c.footer
  return (
    <>
      <footer className="footer">
        <div className="footer-col footer-brand">
          <a className="nav-logo footer-logo" href="#top" aria-label="Código Norte — inicio">
            <img src="/cnslogo.png" alt="" width={68} height={68} decoding="async" style={{ width: 68, height: 'auto' }} />
          </a>
          <p className="footer-tagline">{f.tagline}</p>
        </div>
        {f.cols.map((col, i) => (
          <div key={i} className="footer-col">
            <h5>{col.h}</h5>
            <nav aria-label={col.h}>
              {col.links.map((link, j) => (
                <a
                  key={j}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </footer>
      <div className="footer-wordmark" aria-hidden="true">{f.wordmark}</div>
      <div className="footer-base">
        <span>{f.base}</span>
        <span>{f.baseRight}</span>
      </div>
    </>
  )
}
