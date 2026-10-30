import React from 'react'

/**
 * Texto con un formato mínimo y seguro (sin HTML): **negrita**, *cursiva*, `código` y [texto](https://enlace).
 * Se arma con elementos de React, así que nada de lo escrito puede inyectar código.
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\((?:https?:\/\/|\/|mailto:)[^)\s]+\))/g

export function Inline({ texto }) {
  const partes = String(texto ?? '').split(INLINE)
  return partes.map((p, i) => {
    if (!p) return null
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) return <code key={i}>{p.slice(1, -1)}</code>
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>
    const enlace = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (enlace) {
      const externo = /^https?:\/\//.test(enlace[2])
      return (
        <a key={i} href={enlace[2]} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {enlace[1]}
        </a>
      )
    }
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

/** Los párrafos se separan con una línea en blanco; un salto simple se respeta. */
function Parrafos({ texto }) {
  return String(texto ?? '')
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p, i) => (
      <p key={i}>
        {p.split('\n').map((linea, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            <Inline texto={linea} />
          </React.Fragment>
        ))}
      </p>
    ))
}

/** Pinta los bloques de un artículo. La usan la página pública y la vista previa del admin. */
export function ArticuloContenido({ bloques }) {
  return (
    <div className="art-cuerpo">
      {(bloques || []).map((b, i) => {
        switch (b.tipo) {
          case 'titulo':
            return <h2 key={i}>{b.texto}</h2>
          case 'subtitulo':
            return <h3 key={i}>{b.texto}</h3>
          case 'texto':
            return <Parrafos key={i} texto={b.texto} />
          case 'lista':
            return (
              <ul key={i}>
                {String(b.texto ?? '')
                  .split('\n')
                  .map((x) => x.replace(/^\s*[-•*]\s*/, '').trim())
                  .filter(Boolean)
                  .map((x, j) => (
                    <li key={j}>
                      <Inline texto={x} />
                    </li>
                  ))}
              </ul>
            )
          case 'cita':
            return (
              <blockquote key={i}>
                <Inline texto={b.texto} />
              </blockquote>
            )
          case 'imagen':
            return b.url ? (
              <figure key={i}>
                <img src={b.url} alt={b.pie || ''} loading="lazy" decoding="async" />
                {b.pie && <figcaption>{b.pie}</figcaption>}
              </figure>
            ) : null
          default:
            return null
        }
      })}
    </div>
  )
}

/** Minutos de lectura aproximados (200 palabras por minuto). */
export function minutosDeLectura(bloques) {
  const palabras = (bloques || []).reduce((n, b) => n + (b.texto ? b.texto.split(/\s+/).filter(Boolean).length : 0), 0)
  return Math.max(1, Math.round(palabras / 200))
}
