/* sections-mid.jsx — Services grid, Process steps */

function SectionHeader({ num, eyebrow, title, titleEm, lead }) {
  return (
    <div className="sec-hd">
      <div>
        <div className="sec-num">{num}</div>
        <h2>
          {title}{' '}
          <span style={{fontFamily:'var(--f-serif)', fontStyle:'italic', fontWeight:400, color:'var(--accent)'}}>
            {titleEm}
          </span>
        </h2>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

function ServiceCard({ item, span, tall }) {
  return (
    <article className={`svc col-${span}${tall ? ' tall' : ''}`}>
      <div className="svc-arrow" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </div>
      <div className="svc-num">{item.n}</div>
      <h3 className="svc-title">
        {item.title}
        {item.titleEm && <> <em>{item.titleEm}</em></>}
      </h3>
      <p className="svc-body">{item.body}</p>
      <div className="svc-tags">
        {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      {item.stats && (
        <div className="svc-stats">
          {item.stats.map((s, i) => (
            <div key={i} className="stat">
              <b>{s.n}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      )}
      <div className="svc-mock">
        <Mock kind={item.mock} />
      </div>
    </article>
  );
}

function Services({ c }) {
  const s = c.services;
  // ecommerce (8) + gastro (4) | gym (4) + eticketing (8) | queue (6) + landing (6)
  // — emphasises ecommerce + e-ticketing as the dominant cards
  const layout = [8, 4, 4, 8, 6, 6];
  return (
    <section className="sec" id="servicios">
      <SectionHeader num={s.num} eyebrow={s.eyebrow} title={s.title} titleEm={s.titleEm} lead={s.lead} />
      <div className="services">
        {s.items.map((item, i) => (
          <ServiceCard key={i} item={item} span={layout[i]} tall={layout[i] === 8} />
        ))}
      </div>
    </section>
  );
}

function Process({ c }) {
  const p = c.process;
  return (
    <section className="sec" id="proceso">
      <SectionHeader num={p.num} eyebrow={p.eyebrow} title={p.title} titleEm={p.titleEm} lead={p.lead} />
      <div className="process">
        {p.steps.map((step, i) => (
          <div key={i} className="step">
            <div className="step-tick">{step.dur}</div>
            <div className="step-num">
              0{i + 1}<span className="of">/0{p.steps.length}</span>
            </div>
            <div className="step-title">{step.t}</div>
            <p className="step-body">{step.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { SectionHeader, Services, Process });
