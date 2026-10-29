/**
 * Datos de SEO / GEO de Código Norte Soluciones.
 * Los lee el plugin de build (seo/vite-seo-plugin.mjs) y también la app (src/lib/seo.js),
 * así el título que ve Google y el que se ve en la pestaña salen del mismo lugar.
 */
export const SITE_URL = 'https://www.codigonortesoluciones.com'
export const BRAND = 'Código Norte Soluciones'
export const SHORT_BRAND = 'Código Norte'
export const TAGLINE = 'Consultora remota de software a medida y automatización para pymes'
export const DEFAULT_IMAGE = '/og-cover.jpg'

export const CONTACT = {
  email: 'codigonortesoluciones@gmail.com',
  phone: '+54 351 764-8146',
  whatsapp: 'https://wa.me/543517648146',
  instagram: 'https://www.instagram.com/codigo.norte.soluciones/',
}

/** Rutas que no deben indexarse. */
export const DISALLOW = ['/admin', '/api/']

/** Páginas estáticas que ya existen fuera de la app (landings por sistema). Solo van al sitemap. */
export const STATIC_PAGES = [
  { path: '/sistema-ecommerce/', priority: '0.8' },
  { path: '/sistema-gimnasios/', priority: '0.8' },
  { path: '/sistema-cafeteria/', priority: '0.8' },
]

const casos = [
  ['Impacto Tienda', 'ecommerce multisucursal con catálogo, pagos y operación', 'https://www.impactotienda.com.ar'],
  ['Barbería Authentic', 'turnero con reservas 24/7, cobros online y agenda del equipo', 'https://www.authenticbarberia.com'],
  ['Barriola Constructora', 'sitio institucional y panel de gestión de obras, asistencias y maquinaria', 'https://www.barriolaconstructora.com'],
  ['Velvet Travel', 'sitio de viajes con reservas online y ERP', 'https://www.velvet-travel.com.ar'],
  ['Legales MV Kulman', 'sitio profesional para estudio de abogacía', 'https://legalesmvkulman.com'],
  ['Patagonia Inquieta', 'sistema de reserva de tours', 'https://www.patagoniainquieta.com'],
  ['CR-ONFIT', 'gestión de socios y pagos para un gimnasio', 'https://www.cronfit.com.ar'],
  ['Hangar Fitness', 'socios, cuotas, rutinas y acceso QR para un gimnasio', 'https://www.hangarfitness.ar'],
]
export const CASOS = casos.map(([nombre, descripcion, url]) => ({ nombre, descripcion, url }))

/** Pasos del proceso, tal como se muestran en la landing. */
export const PASOS = [
  ['Contanos qué querés resolver', 'Sistema a medida, automatización o uno de nuestros sistemas listos. Escribinos por WhatsApp.'],
  ['Auditoría gratis de tu negocio', '15 minutos por videollamada, totalmente gratis, para revisar tu negocio y ver qué se puede automatizar.'],
  ['Ves tu demo con tu marca', 'Tu demo personalizada lista en 2 días, con tu logo y tus colores.'],
  ['Mirás el avance y opinás', 'Mostramos avances reales, vos probás, pedís cambios y ajustamos online.'],
  ['Sistema andando y acompañamiento', 'Te capacitamos con tu sistema en producción. Una vez que está listo, podés sumar la consultoría de crecimiento de tu negocio.'],
]

export const BENEFICIOS = [
  ['¿Qué cambia en tu día a día?', 'Lo que hoy hacés a mano, como planillas, mensajes y cobros, pasa a hacerse solo dentro de un sistema pensado para cómo trabajás.'],
  ['¿Por qué no usar un programa genérico?', 'Porque el sistema se adapta a tu negocio y no al revés: lleva tu marca, tus reglas y solo lo que necesitás.'],
  ['¿Cómo ayuda a que tu negocio crezca?', 'Te ordena la información y te libera tiempo para atender más clientes y decidir mejor, sin sumar trabajo manual.'],
]

/** Sistemas listos (SaaS). `slug` es la URL pública; `tab` el id de pestaña de la app. */
export const SISTEMAS = [
  {
    slug: 'ecommerce',
    tab: 'ecommerce',
    nombre: 'Ecommerce',
    title: 'Tienda online para pymes: catálogo, carrito y pagos | Código Norte',
    description: 'Sistema de ecommerce con tu marca: catálogo, carrito, Mercado Pago y panel de pedidos y stock. Vendé online 24/7 y cobrá directo en tu cuenta.',
    h1: 'Sistema de ecommerce para pymes',
    parrafos: [
      'Tienda propia con catálogo, carrito y pasarela de pago integrada. Es tu plataforma: lleva tu logo y tus colores, y cobrás con tu propio Mercado Pago, sin comisión nuestra.',
      'Incluye panel de pedidos, stock y envíos, y soporte por WhatsApp. Empezás con lo que necesitás hoy y escalás cuando haga falta.',
    ],
    landing: '/sistema-ecommerce/',
    tipo: 'Ecommerce',
  },
  {
    slug: 'gimnasios',
    tab: 'gym',
    nombre: 'Gimnasios',
    title: 'Sistema para gimnasios: socios, cuotas y acceso QR | Código Norte',
    description: 'Software para gimnasios, estudios, pilates y crossfit: débito automático, control de acceso por QR, clases con cupo y métricas de retención.',
    h1: 'Sistema de gestión para gimnasios',
    parrafos: [
      'Débito automático, control de acceso por QR, clases con cupo y métricas de retención. Para gimnasios, estudios, pilates y crossfit.',
      'Cada gimnasio tiene su marca, sus socios, sus cuotas y sus rutinas en un solo lugar.',
    ],
    landing: '/sistema-gimnasios/',
    tipo: 'Gestión de gimnasios',
  },
  {
    slug: 'turneros',
    tab: 'queue',
    nombre: 'Turneros',
    title: 'Turnero online para profesionales y consultorios | Código Norte',
    description: 'Sistema de turnos con tu marca personal: reservas 24/7, agenda del equipo y cobros online para profesionales, clínicas, consultorios y barberías.',
    h1: 'Turnero online con tu propia marca',
    parrafos: [
      'Para profesionales particulares, clínicas, consultorios y barberías. Automatiza tus reservas y funciona 24/7, con tu marca y cobros online.',
    ],
    tipo: 'Sistema de turnos',
  },
  {
    slug: 'gastronomia',
    tab: 'gastro',
    nombre: 'Gastronomía',
    title: 'Sistema para restaurantes y cafeterías: mozo, cocina y caja | Código Norte',
    description: 'Software gastronómico: QR para mesas y mostrador, pantalla de pedidos en cocina, seguimiento de delivery, stock por insumo y arqueo de caja.',
    h1: 'Sistema para restaurantes y cafeterías',
    parrafos: [
      'Mozo, cocina, delivery y caja en un mismo sistema: QR para mesas y mostrador, pantalla de pedidos en cocina, seguimiento de delivery, stock por insumo y arqueo de caja.',
    ],
    landing: '/sistema-cafeteria/',
    tipo: 'Gestión gastronómica',
  },
  {
    slug: 'clinica-medica',
    tab: 'clinic',
    nombre: 'Clínica médica',
    title: 'Software para clínicas y consultorios médicos | Código Norte',
    description: 'MediCore: turnos, historia clínica, telemedicina, sala de espera, portal del paciente y facturación con obras sociales para clínicas y médicos.',
    h1: 'Sistema para clínicas y médicos particulares',
    parrafos: [
      'MediCore reúne agenda, historia clínica y telemedicina: turnos, sala de espera, portal del paciente y facturación con obras sociales.',
    ],
    tipo: 'Gestión de clínicas',
  },
  {
    slug: 'pos',
    tab: 'pos',
    nombre: 'Sistema POS',
    title: 'Sistema POS: inventario, facturación y cobro | Código Norte',
    description: 'Sistema de gestión interna para tu negocio: inventario, facturación y cobro en un solo lugar, hecho a la medida de cómo vendés.',
    h1: 'Sistema POS para tu negocio',
    parrafos: ['Sistema de gestión interna para inventario, facturación y cobro de tu negocio.'],
    tipo: 'Punto de venta',
  },
]

export const HOME = {
  path: '/',
  title: 'Software a medida y automatización para pymes | Código Norte',
  description:
    'Diseñamos sistemas a medida y automatizamos procesos para pymes, 100% remoto. Auditoría gratis de 15 minutos y tu demo en 2 días. Ecommerce, turneros, gimnasios y más.',
  h1: 'Software a medida. Remoto, de punta a punta.',
}

export const LLMS = {
  summary:
    'Código Norte Soluciones (CNS) es una consultora remota argentina que diseña y construye software a medida y automatiza procesos para pymes, y ofrece sistemas listos para usar (ecommerce, turneros, gimnasios, gastronomía, clínicas, POS).',
  notes: [
    'Atiende 100% en forma remota (videollamada y WhatsApp), desde Argentina.',
    'Ofrece una auditoría gratuita de 15 minutos del negocio y una demo personalizada en 2 días.',
    'Cada sistema lleva la marca del cliente; los cobros van directo a la cuenta de Mercado Pago del cliente.',
    'Los precios dependen del sistema y del plan: consultar en la sección Planes o por WhatsApp. No inventar precios.',
    'Para contactar, usar WhatsApp o el email de contacto; respondemos en el día.',
  ],
}
