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
    ? 'Hi, I need a quote for custom software development. I have a particular system in mind and would like to discuss scope and pricing.'
    : 'Hola, quiero pedir una cotización para el desarrollo de un sistema a medida. Tengo una necesidad particular y me gustaría charlar alcance y presupuesto.'
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`
}
