import React from 'react'
import { SectionHeader } from './sections-mid'
import { WorkScreen } from './mockups'

export function Work({ c }) {
  const w = c.work
  return (
    <section className="sec" id="casos">
      <SectionHeader num={w.num} title={w.title} titleEm={w.titleEm} lead={w.lead} />
      <div className="work">
        {w.items.map((it, i) => (
          <article key={i} className="work-card">
            <div className="work-meta">
              <div className="work-cat">{it.cat}</div>
              <div className="work-cat">// {String(i+1).padStart(2,'0')}</div>
            </div>
            <h3 className="work-title">{it.t}</h3>
            <div className="work-screen">
              <WorkScreen kind={it.kind} />
            </div>
            <p style={{color:'var(--muted)', fontSize:14}}>{it.m}</p>
          </article>
        ))}
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
          <div key={i}
               className={`faq-item${open === i ? ' open' : ''}`}
               onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="faq-q">
              <span>{it.q}</span>
              <span className="faq-icon">+</span>
            </div>
            <p className="faq-a">{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contact({ c, ctaRef }) {
  const [sent, setSent] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '', company: '', email: '', type: '', budget: '', msg: '',
  })
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const cc = c.contact
  return (
    <section className="sec" id="contacto" ref={ctaRef}>
      <SectionHeader num={cc.num} title={cc.title} titleEm={cc.titleEm} lead={cc.lead} />
      <div className="contact">
        {sent ? (
          <div className="form-success">
            <h4>✓ {cc.successTitle}</h4>
            <p>{cc.successBody}</p>
            <p style={{marginTop:8, fontFamily:'var(--f-mono)', fontSize:12, color:'var(--muted)'}}>
              REF: CN-{Math.floor(Math.random()*900000+100000)} · {new Date().toISOString().slice(0,16).replace('T',' ')}
            </p>
            <div style={{marginTop:8}}>
              <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>
                {c.nav.links[0].label === 'Servicios' ? 'Enviar otra' : 'Send another'}
              </button>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label>{cc.form.name}</label>
              <input required type="text" value={form.name} onChange={upd('name')} />
            </div>
            <div className="field">
              <label>{cc.form.company}</label>
              <input type="text" value={form.company} onChange={upd('company')} />
            </div>
            <div className="field">
              <label>{cc.form.email}</label>
              <input required type="email" value={form.email} onChange={upd('email')} placeholder="vos@empresa.com" />
            </div>
            <div className="field">
              <label>{cc.form.type}</label>
              <select required value={form.type} onChange={upd('type')}>
                <option value="">—</option>
                {cc.form.types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{cc.form.budget}</label>
              <select value={form.budget} onChange={upd('budget')}>
                <option value="">—</option>
                {cc.form.budgets.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{cc.form.msg}</label>
              <textarea value={form.msg} onChange={upd('msg')} />
            </div>
            <div className="row" style={{justifyContent:'space-between', marginTop:8}}>
              <span className="meta">↵ enter para enviar</span>
              <button type="submit" className="btn btn-primary btn-lg">
                {cc.form.send}
                <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </div>
          </form>
        )}
        <aside className="contact-aside">
          {cc.aside.map((a, i) => (
            <div key={i} className="contact-card">
              <h4>{a.h}</h4>
              <p>{a.body}</p>
            </div>
          ))}
          <div className="callout">
            <strong style={{color:'var(--accent)'}}>+ </strong>
            {c.nav.links[0].label === 'Servicios'
              ? 'Si estás en Jujuy, Salta o Tucumán, vamos a tu local. Sin cargo, sin compromiso.'
              : 'If you\'re in Jujuy, Salta or Tucumán, we visit your place. Free, no strings.'}
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
        <div className="footer-col">
          <div className="row" style={{gap:10, marginBottom:14}}>
            <span style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:32, height:32, borderRadius:8,
              background:'linear-gradient(140deg, var(--accent), #c25e3b)',
              color:'#0e0e0c', fontFamily:'var(--f-mono)', fontWeight:700, fontSize:12,
            }}>CN</span>
            <span style={{fontFamily:'var(--f-display)', fontSize:18, fontWeight:600, letterSpacing:'-0.02em'}}>
              Código&nbsp;Norte&nbsp;Soluciones
            </span>
          </div>
          <p style={{color:'var(--muted)', fontSize:13.5, maxWidth:'34ch', lineHeight:1.55}}>
            {c.nav.links[0].label === 'Servicios'
              ? 'Software a medida desde San Salvador de Jujuy, para todo el norte y un poco más allá.'
              : 'Custom software from San Salvador de Jujuy, for the north and a bit beyond.'}
          </p>
        </div>
        {f.cols.map((col, i) => (
          <div key={i} className="footer-col">
            <h5>{col.h}</h5>
            {col.links.map(l => <a key={l} href="#">{l}</a>)}
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
