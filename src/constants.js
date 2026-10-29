export const SITE_URL = 'https://www.codigonortesoluciones.com'

export const WHATSAPP_PHONE = '543517648146'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`
export const WHATSAPP_DISPLAY = '+54 351 764-8146'
export const INSTAGRAM_URL = 'https://www.instagram.com/codigo.norte.soluciones/'
export const INSTAGRAM_HANDLE = '@codigo.norte.soluciones'
export const EMAIL = 'codigonortesoluciones@gmail.com'

export function whatsappPlanUrl(productName, planName, lang = 'es') {
  const msg = lang === 'en'
    ? `Hi, I'm interested in the product "${productName}" and I'd like to know more about the "${planName}" plan.`
    : `Hola, me interesa el producto "${productName}" y quiero saber más sobre el plan "${planName}".`
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`
}

export function whatsappCustomDevUrl(lang = 'es') {
  const msg = lang === 'en'
    ? "Hi, I'd like to schedule a call to talk about a custom software project. I have a particular case in mind and would like you to get to know it."
    : 'Hola, quiero organizar una llamada para charlar sobre un desarrollo a medida. Tengo un caso particular y me gustaría que lo conozcan.'
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`
}

/**
 * Video que va justo despues del hero. Dejar `src` vacio lo oculta en produccion
 * (en desarrollo se ve un marco de ejemplo). Acepta un archivo (/video.mp4 en public/)
 * o un link de YouTube/Vimeo en formato embed.
 */
export const HERO_VIDEO = {
  src: '',
  poster: '',
  title: 'Así trabajamos en CNS',
}
