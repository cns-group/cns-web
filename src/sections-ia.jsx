import React from 'react'
import { Reveal } from './reveal'
import { SectionHeader } from './sections-mid'
import { WHATSAPP_URL } from './constants'
import { IA } from '../seo/seo.config.mjs'
import './ia.css'

/** Sistemas de IA. Los textos salen de seo/seo.config.mjs para que coincidan con lo que lee Google. */
export function AiSection() {
  return (
    <section className="sec ia" id="ia">
      <SectionHeader eyebrow="— Inteligencia artificial" title="Sistemas de IA" titleEm="para tu negocio" />
      <Reveal as="p" className="ia-intro">{IA.intro}</Reveal>
      <div className="ia-grid">
        {IA.items.map(([titulo, texto], i) => (
          <Reveal as="article" key={titulo} index={i} className="tut-why-card">
            <span className="tut-why-n">{i + 1}</span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </Reveal>
        ))}
      </div>
      <Reveal as="div" className="ia-cta">
        <a className="btn btn-primary btn-lg" href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero agendar una llamada: la auditoría gratis de 15 minutos de mi negocio.')}`} target="_blank" rel="noopener noreferrer">
          Agendá una llamada
        </a>
      </Reveal>
    </section>
  )
}
