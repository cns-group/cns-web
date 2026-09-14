import React from 'react'
import { SectionHeader } from './sections-mid'
import { Reveal } from './reveal'
import { WHATSAPP_URL, WHATSAPP_DISPLAY, EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from './constants'

export function Stack({ c }) {
  const s = c.stack
  return (
    <section className="sec" id="stack">
      <SectionHeader eyebrow={s.eyebrow} title={s.title} titleEm={s.titleEm} lead={s.lead} />
      <div className="stack-list">
        {s.items.map((it, i) => (
          <Reveal as="div" key={i} index={i} className="stack-item">
            <span className="stack-cat">{String(i+1).padStart(2,'0')} · {it.c}</span>
            <span className="stack-name">{it.n}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Quotes({ c }) {
  const q = c.quotes
  return (
    <section className="sec">
      <SectionHeader eyebrow={q.eyebrow} title={q.title} titleEm={q.titleEm} lead={q.lead} />
      <div className="quotes">
        {q.items.map((it, i) => (
          <Reveal as="figure" key={i} index={i} className="quote">
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
          </Reveal>
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
      <SectionHeader eyebrow={f.eyebrow} title={f.title} titleEm={f.titleEm} />
      <div className="faq">
        {f.items.map((it, i) => (
          <Reveal as="div" key={i} index={i} className={`faq-item${open === i ? ' open' : ''}`}>
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
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Contact({ c, ctaRef }) {
  const cc = c.contact
  return (
    <section className="sec" id="contacto" ref={ctaRef}>
      <SectionHeader eyebrow={cc.eyebrow} title={cc.title} titleEm={cc.titleEm} lead={cc.lead} />
      <div className="contact-wa">
        <Reveal as="div" className="contact-wa-main">
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
        </Reveal>
        <aside className="contact-aside">
          <Reveal as="div" index={1} className="contact-card">
            <h4>{cc.aside[0].h}</h4>
            <p>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </Reveal>
          <Reveal as="div" index={2} className="contact-card">
            <h4>{cc.aside[1].h}</h4>
            <p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a>
            </p>
          </Reveal>
          <Reveal as="div" index={3} className="contact-card">
            <h4>Instagram</h4>
            <p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a>
            </p>
          </Reveal>
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
          <a className="nav-logo footer-logo" href="#top" aria-label="CNS · inicio">
            <img src="/cnslogo.png" alt="" width={94} height={34} decoding="async" style={{ width: 94, height: 'auto' }} />
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
