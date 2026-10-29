/**
 * Plugin de build para SEO / GEO (buscadores y asistentes de IA).
 *
 * Después de `vite build` genera en `dist/`:
 *  - robots.txt, sitemap.xml (URLs absolutas), llms.txt, llms-full.txt y agents.txt
 *  - una copia de index.html por cada página pública (`/ecommerce.html`, servida en `/ecommerce` por vercel.json)
 *    con <title>, descripción, canonical, Open Graph, JSON-LD y el contenido en HTML,
 *    para que los bots que no ejecutan JavaScript (la mayoría de los de IA) lean el sitio.
 *
 * No consulta ninguna API: todo sale de seo/seo.config.mjs, así el build nunca falla por la red.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  BENEFICIOS,
  BRAND,
  CASOS,
  CONTACT,
  DEFAULT_IMAGE,
  DISALLOW,
  HOME,
  LLMS,
  PASOS,
  SHORT_BRAND,
  SISTEMAS,
  SITE_URL,
  STATIC_PAGES,
  TAGLINE,
} from './seo.config.mjs'

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

const AI_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Applebot',
  'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot',
]

export default function seoPlugin() {
  const site = String(process.env.VITE_PUBLIC_SITE_URL || SITE_URL).trim().replace(/\/$/, '')
  const abs = (p = '/') => `${site}${p.startsWith('/') ? p : `/${p}`}`
  const today = new Date().toISOString().slice(0, 10)

  const organizationLd = () => ({
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'Organization'],
    '@id': abs('/#organization'),
    name: BRAND,
    alternateName: ['CNS', SHORT_BRAND, 'Codigo Norte Soluciones'],
    url: abs('/'),
    logo: abs('/cnslogo.png'),
    image: abs(DEFAULT_IMAGE),
    description: LLMS.summary,
    slogan: TAGLINE,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    areaServed: [{ '@type': 'Country', name: 'Argentina' }],
    availableLanguage: 'es',
    knowsAbout: [
      'Desarrollo de software a medida',
      'Automatización de procesos',
      'Ecommerce',
      'Sistemas de turnos',
      'Software para gimnasios',
      'Software gastronómico',
      'Software para clínicas',
      'Sistemas POS',
    ],
    sameAs: [CONTACT.instagram],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'ventas', telephone: CONTACT.phone, email: CONTACT.email, availableLanguage: 'es', url: CONTACT.whatsapp },
    ],
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desarrollo de software a medida', description: 'Sistemas diseñados y construidos para la forma de trabajar de cada negocio.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automatización de procesos', description: 'Tareas manuales (planillas, mensajes, cobros) pasadas a un sistema que las hace solo.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Auditoría gratuita de 15 minutos', description: 'Videollamada para revisar el negocio y detectar qué se puede mejorar o automatizar.' }, price: '0', priceCurrency: 'ARS' },
      ...SISTEMAS.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nombre, url: abs(`/${s.slug}`) } })),
    ],
  })

  const websiteLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: abs('/'),
    name: BRAND,
    inLanguage: 'es-AR',
    publisher: { '@id': abs('/#organization') },
  })

  const breadcrumbs = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  })

  const nav = `<nav>${[['/', 'Inicio'], ...SISTEMAS.map((s) => [`/${s.slug}`, s.nombre])]
    .map(([href, label]) => `<a href="${esc(href)}">${esc(label)}</a>`)
    .join(' · ')} · <a href="${esc(CONTACT.whatsapp)}">WhatsApp</a></nav>`

  function homePage() {
    const body =
      `<h1>${esc(HOME.h1)}</h1>` +
      `<p>${esc(LLMS.summary)}</p>` +
      `<p>Agendá una llamada: auditoría gratis de 15 minutos de tu negocio y tu demo en 2 días.</p>` +
      `<h2>Así trabajamos, paso a paso</h2><ol>${PASOS.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join('')}</ol>` +
      `<h2>¿En qué te ayuda un sistema a medida?</h2>${BENEFICIOS.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` +
      `<h2>Sistemas que ya están funcionando</h2><ul>${SISTEMAS.map((s) => `<li><a href="/${esc(s.slug)}">${esc(s.h1)}</a>: ${esc(s.description)}</li>`).join('')}</ul>` +
      `<h2>Ellos ya confiaron en nosotros</h2><ul>${CASOS.map((c) => `<li><a href="${esc(c.url)}">${esc(c.nombre)}</a>: ${esc(c.descripcion)}</li>`).join('')}</ul>` +
      `<h2>Contacto</h2><p>WhatsApp ${esc(CONTACT.phone)} · ${esc(CONTACT.email)}. Respondemos en el día.</p>` +
      nav
    return {
      path: HOME.path,
      title: HOME.title,
      description: HOME.description,
      body,
      ld: [
        {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: 'Presentación de Código Norte Soluciones',
          description: 'Mario presenta cómo trabaja Código Norte Soluciones: software a medida y automatización para pymes, 100% remoto.',
          thumbnailUrl: abs('/video-poster.jpg'),
          uploadDate: '2026-10-29',
          contentUrl: abs('/HEROVIDEO.mp4'),
          duration: 'PT17S',
          inLanguage: 'es',
          publisher: { '@id': abs('/#organization') },
        },
      ],
    }
  }

  function sistemaPage(s) {
    const pagePath = `/${s.slug}`
    return {
      path: pagePath,
      title: s.title,
      description: s.description,
      body:
        `<h1>${esc(s.h1)}</h1>` +
        s.parrafos.map((t) => `<p>${esc(t)}</p>`).join('') +
        (s.landing ? `<p><a href="${esc(s.landing)}">Ver el sistema en detalle</a></p>` : '') +
        `<p>Escribinos por WhatsApp y coordinamos una auditoría gratis de 15 minutos de tu negocio: <a href="${esc(CONTACT.whatsapp)}">${esc(CONTACT.phone)}</a>.</p>` +
        nav,
      ld: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.h1,
          serviceType: s.tipo,
          description: s.description,
          url: abs(pagePath),
          provider: { '@id': abs('/#organization') },
          areaServed: { '@type': 'Country', name: 'Argentina' },
        },
        breadcrumbs([{ name: 'Inicio', path: '/' }, { name: s.nombre, path: pagePath }]),
      ],
    }
  }

  const headBlock = (page) => {
    const url = abs(page.path)
    const img = abs(page.image || DEFAULT_IMAGE)
    const lines = [
      `<title>${esc(page.title)}</title>`,
      `<meta name="description" content="${esc(page.description)}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(BRAND)}" />`,
      `<meta property="og:locale" content="es_AR" />`,
      `<meta property="og:title" content="${esc(page.title)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:image" content="${esc(img)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(page.title)}" />`,
      `<meta name="twitter:description" content="${esc(page.description)}" />`,
      `<meta name="twitter:image" content="${esc(img)}" />`,
      // Organización y sitio: permanentes en todas las páginas.
      `<script type="application/ld+json" id="seo-jsonld-org">${json(organizationLd())}</script>`,
      `<script type="application/ld+json" id="seo-jsonld-site">${json(websiteLd())}</script>`,
      ...(page.ld || []).map((o, i) => `<script type="application/ld+json" id="seo-jsonld-page${i ? `-${i + 1}` : ''}">${json(o)}</script>`),
    ]
    return lines.join('\n    ')
  }

  const HIDDEN =
    'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'

  const renderPage = (template, page) =>
    template
      .replace(/<!--seo:head-->[\s\S]*?<!--seo:\/head-->/, `<!--seo:head-->\n    ${headBlock(page)}\n    <!--seo:/head-->`)
      .replace('<!--seo:body-->', `<div id="seo-prerender" aria-hidden="true" style="${HIDDEN}">${page.body}</div>`)

  const robotsTxt = () => `# ${BRAND} — ${TAGLINE}
# Generado automáticamente en cada build.

User-agent: *
Allow: /
${DISALLOW.map((d) => `Disallow: ${d}`).join('\n')}

# Buscadores de IA y asistentes (permitidos: así se recomienda el sitio en sus respuestas)
${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n${DISALLOW.map((d) => `Disallow: ${d}`).join('\n')}\n`).join('\n')}
# Rastreador agresivo sin aporte
User-agent: Bytespider
Disallow: /

# Guías para IA: ${abs('/llms.txt')} · ${abs('/agents.txt')}
Sitemap: ${abs('/sitemap.xml')}
`

  const sitemapXml = (pages) => {
    const entries = [
      ...pages.map((p) => ({ path: p.path, priority: p.path === '/' ? '1.0' : '0.8', freq: p.path === '/' ? 'weekly' : 'monthly' })),
      ...STATIC_PAGES.map((p) => ({ path: p.path, priority: p.priority, freq: 'monthly' })),
    ]
    const urls = entries
      .map((e) => `  <url>\n    <loc>${esc(abs(e.path))}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.freq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`)
      .join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  }

  const llmsTxt = () => `# ${BRAND}

> ${LLMS.summary}

## Páginas principales

- [Inicio](${abs('/')}): software a medida, automatización y sistemas listos para pymes
${SISTEMAS.map((s) => `- [${s.nombre}](${abs(`/${s.slug}`)}): ${s.description}`).join('\n')}

## Casos

${CASOS.map((c) => `- [${c.nombre}](${c.url}): ${c.descripcion}`).join('\n')}

## Contacto

- WhatsApp: ${CONTACT.phone} (${CONTACT.whatsapp})
- Email: ${CONTACT.email}
- Instagram: ${CONTACT.instagram}

## Notas para asistentes

${LLMS.notes.map((n) => `- ${n}`).join('\n')}

## Más información

- [Texto completo para IA](${abs('/llms-full.txt')})
- [agents.txt](${abs('/agents.txt')})
- [Sitemap](${abs('/sitemap.xml')})
`

  const llmsFull = () => `# ${BRAND} — contenido completo

> ${LLMS.summary}

## Cómo trabajamos

${PASOS.map(([t, d], i) => `${i + 1}. ${t}: ${d}`).join('\n')}

## ¿En qué ayuda un sistema a medida?

${BENEFICIOS.map(([q, a]) => `### ${q}\n${a}`).join('\n\n')}

## Sistemas listos para usar

${SISTEMAS.map((s) => `### ${s.nombre}\nURL: ${abs(`/${s.slug}`)}\n\n${s.parrafos.join('\n\n')}`).join('\n\n')}

## Casos

${CASOS.map((c) => `- ${c.nombre} (${c.url}): ${c.descripcion}`).join('\n')}

## Contacto

WhatsApp ${CONTACT.phone} · ${CONTACT.email}

## Notas

${LLMS.notes.map((n) => `- ${n}`).join('\n')}
`

  const agentsTxt = () => `# agents.txt — ${BRAND}
# Guía para agentes y asistentes de IA. Es una convención emergente (no un estándar cerrado):
# lo que más pesa para ser recomendado es robots.txt, llms.txt, el sitemap y los datos estructurados (JSON-LD).

Site: ${abs('/')}
Name: ${BRAND}
Type: Consultora de software a medida y automatización
Language: es-AR
Region: Argentina (atención 100% remota)

## Permisos
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /sitemap.xml
${DISALLOW.map((d) => `Disallow: ${d}`).join('\n')}
Training: allowed (contenido público)
Citation: allowed — citá la URL de la página

## Fuentes recomendadas (en orden)
Docs: ${abs('/llms.txt')}
Full-text: ${abs('/llms-full.txt')}
Sitemap: ${abs('/sitemap.xml')}

## Qué puede hacer un usuario en el sitio
- Agendar por WhatsApp una auditoría gratis de 15 minutos de su negocio
- Ver cómo trabajamos paso a paso y hacer preguntas
- Explorar sistemas ya funcionando: ecommerce, gimnasios, turneros, gastronomía, clínicas, POS
- Ver casos de clientes reales

## Contacto
WhatsApp: ${CONTACT.whatsapp}
Email: ${CONTACT.email}

## Reglas para respuestas
${LLMS.notes.map((n) => `- ${n}`).join('\n')}
`

  return {
    name: 'seo-prerender-and-files',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist')
      const tplPath = path.join(dist, 'index.html')
      if (!fs.existsSync(tplPath)) return
      const template = fs.readFileSync(tplPath, 'utf8')

      const pages = [homePage(), ...SISTEMAS.map(sistemaPage)]
      for (const page of pages) {
        const html = renderPage(template, page)
        const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
        fs.writeFileSync(path.join(dist, file), html)
      }
      fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
      fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml(pages))
      fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt())
      fs.writeFileSync(path.join(dist, 'llms-full.txt'), llmsFull())
      fs.writeFileSync(path.join(dist, 'agents.txt'), agentsTxt())
      console.log(`[seo] ${pages.length} páginas prerenderizadas + robots, sitemap, llms.txt, llms-full.txt y agents.txt`)
    },
  }
}
