export function SectionHeader({ eyebrow, title, titleEm, lead }) {
  return (
    <div className="sec-hd">
      <div>
        {eyebrow && <div className="sec-num">{eyebrow}</div>}
        <h2>
          {title}{' '}
          <span className="title-em">{titleEm}</span>
        </h2>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}

export function Process({ c }) {
  const p = c.process
  return (
    <section className="sec" id="proceso">
      <SectionHeader eyebrow={p.eyebrow} title={p.title} titleEm={p.titleEm} lead={p.lead} />
      <div className="process">
        {p.steps.map((step, i) => (
          <div key={i} className="step">
            <div className="step-tick">{step.dur}</div>
            <div className="step-num">
              {i + 1}
            </div>
            <div className="step-title">{step.t}</div>
            <p className="step-body">{step.d}</p>
          </div>
        ))}
      </div>
      <div className="process-shot">
        <figure className="process-shot-frame">
          <div className="browser-frame">
            <div className="browser-bar">
              <span className="bdot r" /><span className="bdot y" /><span className="bdot g" />
            </div>
            <img
              className="browser-img"
              src="/inbox-hero.png"
              alt=""
              width={1907}
              height={937}
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>
        <div className="process-shot-copy">
          <h3>{p.shotTitle}</h3>
          <p>{p.shotCaption}</p>
        </div>
      </div>
    </section>
  )
}
