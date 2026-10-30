/**
 * Voz del navegador: dictado (micrófono) y lectura en voz alta. Usa la Web Speech API, que viene en Chrome y Edge
 * (el dictado necesita internet y el permiso del micrófono). Firefox no tiene dictado; la lectura en voz sí.
 */

const reconocimiento = () => (typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null)

export const hayDictado = () => Boolean(reconocimiento())
export const hayVoz = () => typeof window !== 'undefined' && 'speechSynthesis' in window

/** Saca lo que no se lee bien en voz alta: markdown, emojis, links y acotaciones. */
export function textoParaVoz(texto) {
  return String(texto || '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#>~]/g, '')
    .replace(/\([^)]{0,60}\)/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Voces en español disponibles, con las rioplatenses primero. */
export function vocesEspanol() {
  if (!hayVoz()) return []
  const peso = (v) => (/es-AR/i.test(v.lang) ? 0 : /es-(US|MX|419|UY|CL|CO)/i.test(v.lang) ? 1 : 2)
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^es([-_]|$)/i.test(v.lang))
    .sort((a, b) => peso(a) - peso(b) || a.name.localeCompare(b.name))
}

/** Avisa cuando el navegador termina de cargar las voces (en Chrome llegan tarde). */
export function alCambiarVoces(fn) {
  if (!hayVoz()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', fn)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', fn)
}

export function detenerVoz() {
  if (hayVoz()) window.speechSynthesis.cancel()
}

/** Lee el texto en voz alta. `onFin` se llama al terminar (o si no se pudo hablar). */
export function hablar(texto, { vozNombre, velocidad = 1, onFin } = {}) {
  const limpio = textoParaVoz(texto)
  if (!hayVoz() || !limpio) {
    onFin?.()
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(limpio)
  const voces = vocesEspanol()
  const voz = voces.find((v) => v.name === vozNombre) || voces[0]
  if (voz) {
    u.voice = voz
    u.lang = voz.lang
  } else {
    u.lang = 'es-AR'
  }
  u.rate = velocidad
  let terminado = false
  const fin = () => {
    if (terminado) return
    terminado = true
    onFin?.()
  }
  u.onend = fin
  u.onerror = fin
  window.speechSynthesis.speak(u)
}

/**
 * Dictado por micrófono. Devuelve { iniciar, detener }.
 * `onParcial(texto)` mientras se habla; `onFinal(texto)` al terminar de hablar; `onFin()` cuando se cierra el micrófono;
 * `onError(mensaje)` con un texto listo para mostrar.
 */
export function crearDictado({ idioma = 'es-AR', onParcial, onFinal, onFin, onError }) {
  if (!reconocimiento()) return null
  let rec = null
  let final = ''
  let activo = false

  const iniciar = () => {
    if (activo) return
    rec = new (reconocimiento())()
    rec.lang = idioma
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1
    final = ''
    rec.onresult = (e) => {
      let parcial = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else parcial += t
      }
      onParcial?.((final + parcial).trim())
    }
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      onError?.(
        e.error === 'not-allowed' || e.error === 'service-not-allowed'
          ? 'El navegador no tiene permiso para usar el micrófono. Habilitalo desde el candado de la barra de direcciones.'
          : e.error === 'audio-capture'
            ? 'No se encontró ningún micrófono.'
            : e.error === 'network'
              ? 'El dictado necesita conexión a internet.'
              : `No se pudo usar el micrófono (${e.error}).`,
      )
    }
    rec.onend = () => {
      activo = false
      const texto = final.trim()
      onFin?.()
      if (texto) onFinal?.(texto)
    }
    activo = true
    try {
      rec.start()
    } catch {
      activo = false
    }
  }

  const detener = () => {
    if (rec && activo) rec.stop()
  }

  return { iniciar, detener, activo: () => activo }
}
