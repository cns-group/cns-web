export function SectionHeader({ num, eyebrow, title, titleEm, lead }) {
  return (
    <div className="sec-hd">
      <div>
        <div className="sec-num">{num}</div>
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
  )
}
