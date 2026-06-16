import React from 'react'
import { Link } from 'react-router-dom'
import { COPY } from './copy'
import { Footer } from './sections-bot'
import { TWEAK_DEFAULTS, applyTheme } from './theme-config'

function LegalDocument({ doc }) {
  return (
    <article className="legal-doc">
      <header className="legal-doc-header">
        <h1>{doc.title}</h1>
        <p className="legal-doc-updated">{doc.updatedLabel}: {doc.updated}</p>
      </header>

      {doc.sections.map((section, i) => (
        <section key={i} className="legal-doc-section">
          <h2>{section.title}</h2>
          {section.paragraphs?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {section.intro && <p>{section.intro}</p>}
          {section.bullets?.length > 0 && (
            <ul>
              {section.bullets.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="legal-doc-section legal-doc-contact">
        <h2>{doc.contact.title}</h2>
        <p>
          <a href={`mailto:${doc.contact.email}`}>{doc.contact.email}</a>
        </p>
      </section>
    </article>
  )
}

function LegalPageShell({ children, c }) {
  return (
    <div className="app legal-page">
      <header className="legal-top">
        <Link className="nav-logo legal-logo" to="/" aria-label="Código Norte — inicio">
          <img
            src="/cnslogo.png"
            alt=""
            width={68}
            height={68}
            decoding="async"
            style={{ width: 68, height: 'auto' }}
          />
        </Link>
        <Link className="legal-back" to="/">{c.legal.back}</Link>
      </header>
      <main id="main" className="legal-main">
        {children}
      </main>
      <Footer c={c} />
    </div>
  )
}

export function TermsPage() {
  const [t] = React.useState(TWEAK_DEFAULTS)
  const c = COPY[t.lang] || COPY.es

  React.useEffect(() => { applyTheme(t) }, [t])

  return (
    <LegalPageShell c={c}>
      <LegalDocument doc={c.legal.terms} />
    </LegalPageShell>
  )
}

export function PrivacyPage() {
  const [t] = React.useState(TWEAK_DEFAULTS)
  const c = COPY[t.lang] || COPY.es

  React.useEffect(() => { applyTheme(t) }, [t])

  return (
    <LegalPageShell c={c}>
      <LegalDocument doc={c.legal.privacy} />
    </LegalPageShell>
  )
}
