import React from 'react'

function PayIcon({ name }) {
  const initials = name.split(/[ /]/).map(s => s[0]).join('').slice(0, 2).toUpperCase()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 22, height: 16, borderRadius: 3,
      background: 'var(--surface-2)', color: 'var(--fg-2)',
      fontFamily: 'var(--f-mono)', fontSize: 9, fontWeight: 600, letterSpacing: 0,
      border: '1px solid var(--line-2)',
    }}>{initials}</span>
  )
}

function PayStrip({ c }) {
  const p = c.plans
  return (
    <section className="pay-strip" aria-label="Payment methods">
      <span className="lbl">{p.payHd}</span>
      <div className="pay-list">
        {p.payMethods.map(m => (
          <span key={m} className="pay-pill">
            <PayIcon name={m} />
            {m}
          </span>
        ))}
      </div>
      <span className="foot">{p.payFoot}</span>
    </section>
  )
}

function fmtMoney(n, lang) {
  if (typeof n !== 'number') return n
  const sep = lang === 'en' ? ',' : '.'
  return n.toLocaleString('en-US').replace(/,/g, sep)
}

function PlanCard({ plan, c, lang }) {
  const p = c.plans
  const isCommission = typeof plan.price === 'string' && plan.priceNum
  const isOneOff     = plan.priceLead != null

  return (
    <div className={`plan${plan.featured ? ' featured' : ''}`}>
      {plan.featured && <span className="plan-tag">{p.featured}</span>}
      <div>
        <div className="plan-name">{plan.tier}</div>
        <div className="plan-sub">{plan.sub}</div>
      </div>

      <div className="col" style={{gap: 6}}>
        {isCommission ? (
          <>
            <div className="plan-price">
              <span className="plan-num">{plan.priceNum}</span>
            </div>
            <div className="plan-setup">{plan.priceSuffix}</div>
            <div className="plan-setup" style={{marginTop: 4}}>
              {p.setup}: {plan.setup === 0
                ? (lang === 'es' ? <b>sin setup</b> : <b>no setup</b>)
                : typeof plan.setup === 'number'
                  ? <><b>{p.currency} {fmtMoney(plan.setup, lang)}</b></>
                  : <b>{plan.setup}</b>}
            </div>
          </>
        ) : isOneOff ? (
          <>
            <div className="plan-price">
              <span className="plan-currency">{p.currency}</span>
              <span className="plan-num">{fmtMoney(plan.priceLead, lang)}</span>
              <span className="plan-per">{lang === 'es' ? 'único' : 'one-off'}</span>
            </div>
            <div className="plan-setup">
              + <b>{p.currency} {fmtMoney(plan.price, lang)}{p.monthly}</b> hosting
            </div>
          </>
        ) : (
          <>
            <div className="plan-price">
              <span className="plan-currency">{p.currency}</span>
              <span className="plan-num">{fmtMoney(plan.price, lang)}</span>
              <span className="plan-per">{p.monthly}</span>
            </div>
            <div className="plan-setup">
              {p.setup}: {plan.setup === 0
                ? (lang === 'es' ? <b>sin setup</b> : <b>no setup</b>)
                : typeof plan.setup === 'number'
                  ? <b>{p.currency} {fmtMoney(plan.setup, lang)}</b>
                  : <b>{plan.setup}</b>}
            </div>
          </>
        )}
      </div>

      <ul className="plan-feats">
        {plan.feats.map((f, i) => (
          <li key={i}>
            <span>
              {f[0] && <b>{f[0]} </b>}
              {f[1]}
            </span>
          </li>
        ))}
        {(plan.muted || []).map((m, i) => (
          <li key={`m-${i}`} className="muted"><span>{m}</span></li>
        ))}
      </ul>

      <div className="plan-cta">
        <a href="#contacto" className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} btn-lg`}>
          {plan.tier === 'Pro' ? p.ctaPro : `${p.cta} ${plan.tier}`}
          <svg className="arr" width="12" height="12" viewBox="0 0 11 11" fill="none">
            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export function Plans({ c, lang }) {
  const p = c.plans
  const [active, setActive] = React.useState('ecommerce')
  const tab = p.tabs.find(t => t.id === active) || p.tabs[0]
  const tiers = p.software[active] || []

  return (
    <section className="sec" id="planes" style={{paddingTop: 0}}>
      <div className="sec-hd" style={{paddingTop: 'clamp(80px, 12vh, 140px)'}}>
        <div>
          <div className="sec-num">{p.eyebrow}</div>
          <h2>
            {p.title}{' '}
            <span style={{
              fontFamily:'var(--f-serif)', fontStyle:'italic', fontWeight:400,
              color:'var(--accent)', textTransform:'none', fontSize:'0.92em',
            }}>{p.titleEm}</span>
          </h2>
        </div>
        <p className="lead">{p.lead}</p>
      </div>

      <PayStrip c={c} />

      <div className="plans-tabs" role="tablist">
        {p.tabs.map(t => (
          <button key={t.id} type="button" role="tab"
                  aria-selected={t.id === active}
                  className="plans-tab"
                  data-on={t.id === active ? '1' : '0'}
                  onClick={() => setActive(t.id)}>
            <span className="tnum">/ {t.n}</span>
            <span className="tname">{t.name}</span>
          </button>
        ))}
      </div>

      <div className="plans-content">
        <div className="plans-intro">
          <h3>
            {tab.name}
            <span style={{
              fontFamily:'var(--f-serif)', fontStyle:'italic', fontWeight:400,
              color:'var(--accent)', textTransform:'none', fontSize:'0.78em',
              marginLeft: 16,
            }}>— {tab.intro}</span>
          </h3>
          <p>{tab.lead}</p>
        </div>

        <div className="plans-grid">
          {tiers.map((tier, i) => (
            <PlanCard key={i} plan={tier} c={c} lang={lang} />
          ))}
        </div>
      </div>

      <div className="plans-foot">
        {p.footer.map((f, i) => (
          <div key={i} className="ff">
            <h6>{f.h}</h6>
            <p>{f.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
