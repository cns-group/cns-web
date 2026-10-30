/**
 * Voz del navegador: dictado (micrófono) y lectura en voz alta. Usa la Web Speech API, que viene en Chrome y Edge
 * (el dictado necesita internet y el permiso del micrófono). Firefox no tiene dictado; la lectura en voz sí.
 *
 * Para que suene más natural sin servicios externos:
 *  - elige primero las voces neuronales del navegador (en Edge, las "Natural" en español argentino);
 *  - normaliza el texto como se dice (números, plata, porcentajes, horas, siglas);
 *  - lee frase por frase, para poder empezar a hablar mientras la IA todavía escribe.
 */

const reconocimiento = () => (typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null)

export const hayDictado = () => Boolean(reconocimiento())
export const hayVoz = () => typeof window !== 'undefined' && 'speechSynthesis' in window

/* ── Números y texto como se dice ───────────────────────────────────────── */

const UNIDADES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve']
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

function menorDeMil(n) {
  if (n < 30) return UNIDADES[n]
  if (n < 100) {
    const d = Math.floor(n / 10)
    const u = n % 10
    return u ? `${DECENAS[d]} y ${UNIDADES[u]}` : DECENAS[d]
  }
  if (n === 100) return 'cien'
  const c = Math.floor(n / 100)
  const resto = n % 100
  return resto ? `${CENTENAS[c]} ${menorDeMil(resto)}` : CENTENAS[c]
}

/** 150000 → "ciento cincuenta mil". Hasta 999.999.999; más que eso devuelve los dígitos. */
export function numeroEnPalabras(n) {
  if (!Number.isInteger(n) || n < 0 || n > 999_999_999) return String(n)
  if (n < 1000) return menorDeMil(n)
  const millones = Math.floor(n / 1_000_000)
  const miles = Math.floor((n % 1_000_000) / 1000)
  const resto = n % 1000
  const partes = []
  if (millones) partes.push(millones === 1 ? 'un millón' : `${apocopado(menorDeMil(millones))} millones`)
  if (miles) partes.push(miles === 1 ? 'mil' : `${apocopado(menorDeMil(miles))} mil`)
  if (resto) partes.push(menorDeMil(resto))
  return partes.join(' ')
}

/** "uno" y "veintiuno" delante de un sustantivo: "un", "veintiún". */
function apocopado(palabras) {
  return palabras.replace(/veintiuno$/, 'veintiún').replace(/\buno$/, 'un')
}

const SIGLAS = [
  [/\bCNS\b/g, 'Ce Ene Ese'],
  [/\bCRM\b/g, 'Ce Erre Eme'],
  [/\bIA\b/g, 'I A'],
  [/\bQR\b/g, 'Cu Erre'],
  [/\bROI\b/g, 'Erre O I'],
  [/\bPOS\b/g, 'Pos'],
  [/\bSaaS\b/gi, 'sas'],
  [/\bWhatsApp\b/gi, 'Guasap'],
  [/\bExcel\b/g, 'Ecsel'],
  [/\bDr\./g, 'doctor'],
  [/\bDra\./g, 'doctora'],
  [/\bSr\./g, 'señor'],
  [/\bSra\./g, 'señora'],
  [/\betc\./gi, 'etcétera'],
  [/\bej\./gi, 'por ejemplo'],
  [/\bhs\b\.?/gi, 'horas'],
]

const sinPuntos = (s) => s.replace(/\./g, '')

/** Deja el texto como se diría en voz alta: sin markdown, con números, plata, horas y siglas en palabras. */
export function normalizarParaVoz(texto, idioma = 'es') {
  let t = String(texto || '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#>~]/g, '')
    .replace(/\[[^\]]{0,60}\]/g, '')
    .replace(/\([^)]{0,60}\)/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[—–]/g, ', ')

  // En inglés no hace falta pasar números ni siglas a palabras: solo se limpia lo que no se lee bien.
  if (/^en/i.test(idioma)) return t.replace(/\s+/g, ' ').trim()

  for (const [re, dicho] of SIGLAS) t = t.replace(re, dicho)

  // Plata: "$150.000", "US$ 1.200", "USD 50"
  t = t.replace(/(US\$|USD|u\$s|\$)\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?/gi, (_m, moneda, ent, cent) => {
    const n = Number(sinPuntos(ent))
    const dolares = /us|usd|u\$s/i.test(moneda)
    const base = numeroEnPalabras(n)
    const de = n >= 1_000_000 && n % 1_000_000 === 0 ? ' de' : ''
    const unidad = dolares ? (n === 1 ? 'dólar' : 'dólares') : n === 1 ? 'peso' : 'pesos'
    const centavos = cent ? ` con ${numeroEnPalabras(Number(cent.padEnd(2, '0')))} centavos` : ''
    return `${apocopado(base)}${de} ${unidad}${centavos}`
  })

  // Horas: "10:30", "9:00", "14:15"
  t = t.replace(/\b(\d{1,2}):(\d{2})\b/g, (_m, h, m) => {
    const hora = numeroEnPalabras(Number(h))
    const min = Number(m)
    if (min === 0) return `${hora} en punto`
    if (min === 15) return `${hora} y cuarto`
    if (min === 30) return `${hora} y media`
    return `${hora} y ${numeroEnPalabras(min)}`
  })

  // Porcentajes: "30%", "2,5%"
  t = t.replace(/(\d+)(?:,(\d+))?\s?%/g, (_m, ent, dec) => `${numeroEnPalabras(Number(ent))}${dec ? ` coma ${[...dec].map((d) => UNIDADES[Number(d)]).join(' ')}` : ''} por ciento`)

  // Decimales: "2,5"
  t = t.replace(/\b(\d+),(\d+)\b/g, (_m, ent, dec) => `${numeroEnPalabras(Number(ent))} coma ${[...dec].map((d) => UNIDADES[Number(d)]).join(' ')}`)

  // Rangos: "2-3 días"
  t = t.replace(/\b(\d+)\s?-\s?(\d+)\b/g, '$1 a $2')

  // Enteros sueltos, con o sin puntos de miles. Delante de una palabra: "un día", "veintiún mil pesos".
  t = t.replace(/\b(\d{1,3}(?:\.\d{3})+|\d+)\b(\s+[a-záéíóúñ])?/gi, (_m, num, siguiente) => {
    const n = Number(sinPuntos(num))
    const palabras = numeroEnPalabras(n)
    return siguiente ? `${apocopado(palabras)}${siguiente}` : palabras
  })

  return t.replace(/\s+([,.;:!?])/g, '$1').replace(/\s+/g, ' ').trim()
}

/** Compatibilidad: igual que normalizarParaVoz. */
export const textoParaVoz = normalizarParaVoz

const ABREVIATURAS = new Set(['dr', 'dra', 'sr', 'sra', 'etc', 'ej', 'hs', 'vs'])

/**
 * Corta de un texto que se va escribiendo las frases ya completas. Devuelve { oraciones, resto }.
 * Une las frases muy cortas con la siguiente para que no se lea entrecortado.
 */
export function extraerOraciones(buffer, { minimo = 28 } = {}) {
  const oraciones = []
  let desde = 0
  const re = /[.!?…]+["')\]]*(?=\s)/g
  let m
  while ((m = re.exec(buffer))) {
    const fin = m.index + m[0].length
    const palabra = buffer.slice(desde, m.index).split(/\s+/).pop()?.toLowerCase().replace(/[^a-záéíóúñ]/g, '')
    if (m[0][0] === '.' && ABREVIATURAS.has(palabra)) continue
    const trozo = buffer.slice(desde, fin).trim()
    if (trozo.length < minimo) continue
    oraciones.push(trozo)
    desde = fin
  }
  return { oraciones, resto: buffer.slice(desde) }
}

/* ── Voces ──────────────────────────────────────────────────────────────── */

/** Las voces neuronales del navegador ("Microsoft Elena Online (Natural)", "Google español") suenan mucho mejor. */
export const esNatural = (v) => /natural|neural/i.test(v.name)

function puntaje(v) {
  let p = 0
  if (esNatural(v)) p -= 20
  else if (/online|google/i.test(v.name)) p -= 8
  if (/es[-_]AR/i.test(v.lang)) p -= 6
  else if (/es[-_](UY|US|MX|419|CL|CO)/i.test(v.lang)) p -= 3
  else if (/en[-_]US/i.test(v.lang)) p -= 6
  else if (/en[-_](GB|AU|CA)/i.test(v.lang)) p -= 3
  return p
}

/** Voces de un idioma ('es' o 'en'), las más naturales primero (en español, las rioplatenses; en inglés, las de EE.UU.). */
export function vocesIdioma(prefijo = 'es') {
  if (!hayVoz()) return []
  const re = new RegExp(`^${prefijo}([-_]|$)`, 'i')
  return window.speechSynthesis
    .getVoices()
    .filter((v) => re.test(v.lang))
    .sort((a, b) => puntaje(a) - puntaje(b) || a.name.localeCompare(b.name))
}

/** Voces en español disponibles, las más naturales y rioplatenses primero. */
export const vocesEspanol = () => vocesIdioma('es')

/** Avisa cuando el navegador termina de cargar las voces (en Chrome llegan tarde). */
export function alCambiarVoces(fn) {
  if (!hayVoz()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', fn)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', fn)
}

export function detenerVoz() {
  if (hayVoz()) window.speechSynthesis.cancel()
}

function armarVoz(texto, { vozNombre, velocidad = 1, idioma = 'es' }) {
  const u = new SpeechSynthesisUtterance(texto)
  const voces = vocesIdioma(idioma)
  const voz = voces.find((v) => v.name === vozNombre) || voces[0]
  if (voz) {
    u.voice = voz
    u.lang = voz.lang
  } else {
    u.lang = /^en/i.test(idioma) ? 'en-US' : 'es-AR'
  }
  // Un poco de vida: las preguntas suben apenas el tono y la velocidad varía una pizca de frase en frase.
  u.pitch = /\?["')\]]*\s*$/.test(texto) ? 1.06 : 1
  u.rate = velocidad * (0.985 + Math.random() * 0.03)
  return u
}

/** Lee un texto en voz alta. `onFin` se llama al terminar (o si no se pudo hablar). */
export function hablar(texto, { vozNombre, velocidad = 1, idioma = 'es', onFin } = {}) {
  const limpio = normalizarParaVoz(texto, idioma)
  if (!hayVoz() || !limpio) {
    onFin?.()
    return
  }
  window.speechSynthesis.cancel()
  const u = armarVoz(limpio, { vozNombre, velocidad, idioma })
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
 * Locutor: recibe frases de a una (a medida que la IA las escribe) y las va diciendo en orden.
 * `cerrar()` avisa que no vienen más; `onFin` se llama cuando se dijo todo. `cancelar()` corta en seco.
 */
export function crearLocutor({ vozNombre, velocidad = 1, idioma = 'es', onFin } = {}) {
  let pendientes = 0
  let cerrado = false
  let cancelado = false
  let avisado = false
  const comprobar = () => {
    if (cancelado || avisado || !cerrado || pendientes > 0) return
    avisado = true
    onFin?.()
  }
  return {
    decir(frase) {
      const limpio = normalizarParaVoz(frase, idioma)
      if (cancelado || !hayVoz() || !limpio) return
      pendientes++
      const u = armarVoz(limpio, { vozNombre, velocidad, idioma })
      const listo = () => {
        pendientes = Math.max(0, pendientes - 1)
        comprobar()
      }
      u.onend = listo
      u.onerror = listo
      window.speechSynthesis.speak(u)
    },
    cerrar() {
      cerrado = true
      comprobar()
    },
    cancelar() {
      cancelado = true
      detenerVoz()
    },
    hablando: () => pendientes > 0,
  }
}

/* ── Dictado ────────────────────────────────────────────────────────────── */

/**
 * Dictado por micrófono. Devuelve { iniciar, detener, activo }.
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
