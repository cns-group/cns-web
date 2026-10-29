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
    slug: 'tienda-online',
    oldSlug: 'ecommerce',
    tab: 'ecommerce',
    heading: 'Software para tienda online',
    nombre: 'Ecommerce',
    title: 'Software para tienda online: catálogo, carrito y pagos | Código Norte',
    description: 'Sistema de ecommerce con tu marca: catálogo, carrito, Mercado Pago y panel de pedidos y stock. Vendé online 24/7 y cobrá directo en tu cuenta.',
    h1: 'Software de ecommerce para tu tienda online',
    parrafos: [
      'Tienda propia con catálogo, carrito y pasarela de pago integrada. Es tu plataforma: lleva tu logo y tus colores, y cobrás con tu propio Mercado Pago, sin comisión nuestra.',
      'Incluye panel de pedidos, stock y envíos, y soporte por WhatsApp. Empezás con lo que necesitás hoy y escalás cuando haga falta.',
    ],
    landing: '/sistema-ecommerce/',
    tipo: 'Ecommerce',
  },
  {
    slug: 'software-para-gimnasios',
    oldSlug: 'gimnasios',
    tab: 'gym',
    heading: 'Software para gimnasios',
    nombre: 'Gimnasios',
    title: 'Software para gimnasios: socios, cuotas y acceso QR | Código Norte',
    description: 'Software para gimnasios, estudios, pilates y crossfit: débito automático, control de acceso por QR, clases con cupo y métricas de retención.',
    h1: 'Software de gestión para gimnasios',
    parrafos: [
      'Débito automático, control de acceso por QR, clases con cupo y métricas de retención. Para gimnasios, estudios, pilates y crossfit.',
      'Cada gimnasio tiene su marca, sus socios, sus cuotas y sus rutinas en un solo lugar.',
    ],
    landing: '/sistema-gimnasios/',
    tipo: 'Gestión de gimnasios',
  },
  {
    slug: 'sistema-de-turnos',
    oldSlug: 'turneros',
    tab: 'queue',
    heading: 'Sistema de turnos online',
    nombre: 'Turneros',
    title: 'Sistema de turnos online para profesionales y consultorios | Código Norte',
    description: 'Sistema de turnos con tu marca personal: reservas 24/7, agenda del equipo y cobros online para profesionales, clínicas, consultorios y barberías.',
    h1: 'Sistema de turnos online con tu propia marca',
    parrafos: [
      'Para profesionales particulares, clínicas, consultorios y barberías. Automatiza tus reservas y funciona 24/7, con tu marca y cobros online.',
    ],
    tipo: 'Sistema de turnos',
  },
  {
    slug: 'software-para-restaurantes',
    oldSlug: 'gastronomia',
    tab: 'gastro',
    heading: 'Software para restaurantes y cafeterías',
    nombre: 'Gastronomía',
    title: 'Software para restaurantes y cafeterías: mozo, cocina y caja | Código Norte',
    description: 'Software gastronómico: QR para mesas y mostrador, pantalla de pedidos en cocina, seguimiento de delivery, stock por insumo y arqueo de caja.',
    h1: 'Software para restaurantes y cafeterías',
    parrafos: [
      'Mozo, cocina, delivery y caja en un mismo sistema: QR para mesas y mostrador, pantalla de pedidos en cocina, seguimiento de delivery, stock por insumo y arqueo de caja.',
    ],
    landing: '/sistema-cafeteria/',
    tipo: 'Gestión gastronómica',
  },
  {
    slug: 'software-para-clinicas',
    oldSlug: 'clinica-medica',
    tab: 'clinic',
    heading: 'Software para clínicas y consultorios',
    nombre: 'Clínica médica',
    title: 'Software para clínicas y consultorios: historia clínica y turnos | Código Norte',
    description: 'MediCore: turnos, historia clínica, telemedicina, sala de espera, portal del paciente y facturación con obras sociales para clínicas y médicos.',
    h1: 'Software para clínicas y médicos particulares',
    parrafos: [
      'MediCore reúne agenda, historia clínica y telemedicina: turnos, sala de espera, portal del paciente y facturación con obras sociales.',
    ],
    tipo: 'Gestión de clínicas',
  },
  {
    slug: 'sistema-pos',
    oldSlug: 'pos',
    tab: 'pos',
    heading: 'Sistema POS para tu negocio',
    nombre: 'Sistema POS',
    title: 'Sistema POS: inventario, facturación y cobro | Código Norte',
    description: 'Sistema de gestión interna para tu negocio: inventario, facturación y cobro en un solo lugar, hecho a la medida de cómo vendés.',
    h1: 'Sistema POS para tu negocio',
    parrafos: ['Sistema de gestión interna para inventario, facturación y cobro de tu negocio.'],
    tipo: 'Punto de venta',
  },
]

/** Página de sistemas de IA. Su contenido visible está en src/sections-ia.jsx: mantenerlos iguales. */
export const IA = {
  slug: 'sistemas-de-ia',
  nombre: 'Sistemas de IA',
  title: 'Sistemas de IA para pymes: asistentes y automatización | Código Norte',
  description:
    'Sistemas de inteligencia artificial a medida para tu negocio: asistente de WhatsApp, automatización de tareas repetitivas y reportes. Auditoría gratis de 15 minutos.',
  h1: 'Sistemas de IA para pymes',
  intro:
    'Sumamos inteligencia artificial a los sistemas que construimos para que tu negocio atienda más y trabaje menos a mano. Empezamos por una auditoría gratis de 15 minutos para ver dónde tiene sentido usarla.',
  items: [
    ['Asistente de WhatsApp', 'Responde las consultas frecuentes de tus clientes a toda hora y deriva a una persona cuando hace falta.'],
    ['Automatización de tareas repetitivas', 'Cargar pedidos, mandar recordatorios y avisos, pasar datos de un lado a otro: lo que hoy hacés a mano lo hace el sistema.'],
    ['Resúmenes y reportes del negocio', 'Convierte tus datos (ventas, turnos, socios) en resúmenes claros para decidir mejor.'],
    ['Clasificación de consultas', 'Ordena lo que te escriben por tema y prioridad, para que atiendas primero lo que importa.'],
  ],
}

export const HOME = {
  path: '/',
  title: 'Software a medida y sistemas de IA para pymes | Código Norte Soluciones',
  description:
    'Software a medida, sistemas de IA y automatización de procesos para pymes, 100% remoto. Auditoría gratis de 15 minutos y tu demo en 2 días. Software para gimnasios, restaurantes, clínicas y tiendas online.',
  h1: 'Software a medida. Remoto, de punta a punta.',
}

export const LLMS = {
  summary:
    'Código Norte Soluciones (CNS) es una consultora remota argentina que diseña y construye software a medida, sistemas de inteligencia artificial y automatización de procesos para pymes, y ofrece software listo para usar: para gimnasios, restaurantes y cafeterías, clínicas, tiendas online, sistemas de turnos y POS.',
  notes: [
    'Atiende 100% en forma remota (videollamada y WhatsApp), desde Argentina.',
    'Ofrece una auditoría gratuita de 15 minutos del negocio y una demo personalizada en 2 días.',
    'Cada sistema lleva la marca del cliente; los cobros van directo a la cuenta de Mercado Pago del cliente.',
    'Los precios dependen del sistema y del plan: consultar en la sección Planes o por WhatsApp. No inventar precios.',
    'Para contactar, usar WhatsApp o el email de contacto; respondemos en el día.',
  ],
}
