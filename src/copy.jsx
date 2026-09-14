export const COPY = {
  es: {
    nav: {
      links: [
        { id: 'planes',    label: 'Planes' },
        { id: 'desarrollo-a-medida', label: 'Integraciones' },
        { id: 'proceso',   label: 'Cómo funciona' },
        { id: 'contacto',  label: 'Contacto' },
      ],
      status: 'Sumando negocios nuevos',
      cta: 'Activar mi CRM',
      ctaGhost: 'Ver cómo funciona',
    },
    hero: {
      eyebrow: 'CRM de WhatsApp con IA',
      titleA: 'Tu WhatsApp',
      titleB: 'con un Agente',
      titleC: 'que responde',
      titleD: 'solo.',
      lead:
        'Centralizá todas tus conversaciones de WhatsApp en un solo inbox, con un asistente de IA que responde consultas, arma pedidos y filtra clientes reales las 24 horas. Vos ves todo, decidís vos.',
      footMeta: 'GMT‑3',
      footStatus: 'Operando',
    },
    marquee: [
      'Inbox unificado', 'Asistente IA 24/7', 'CRM y contactos',
      'Mercado Pago · Transferencia',
    ],
    process: {
      eyebrow: 'Cómo trabajamos',
      num: 'Capítulo 02',
      title: 'Una semana',
      titleEm: 'y tu WhatsApp responde solo',
      lead:
        'Conectamos tu número, entrenamos al asistente con tu catálogo y tu forma de vender, y ajustamos hasta que responda exactamente como vos querés.',
      steps: [
        { t: 'Descubrimiento',  d: 'Nos contás tu catálogo, precios y cómo atendés hoy. Definimos qué puede resolver la IA sola y qué pasa a un humano.', dur: 'Día 1' },
        { t: 'Configuración',   d: 'Conectamos tu número de WhatsApp, cargamos tu catálogo y entrenamos al asistente con tu forma de hablar.', dur: 'Día 2' },
        { t: 'Prueba en vivo',  d: 'Revisás conversaciones reales, ajustamos respuestas y sumamos a tu equipo al inbox compartido.', dur: 'Día 3' },
        { t: 'Puesta en marcha',d: 'Tu CRM queda andando: la IA responde, tu equipo hace seguimiento y vos mirás todo desde un solo lugar. Después: soporte mensual opcional.', dur: 'Semana 01' },
      ],
      shotTitle: 'Así se ve funcionando',
      shotCaption: 'El inbox real de un cliente: el asistente responde solo, tu equipo hace seguimiento cuando hace falta y vos ves cada conversación en un solo lugar.',
    },
    stack: {
      eyebrow: 'Stack',
      num: 'Capítulo 04',
      title: 'Lo que usamos,',
      titleEm: 'sin parecer feria',
      lead: 'Apostamos a herramientas estables, no a la moda del mes. Lo que está acá sostiene conversaciones reales todos los días.',
      items: [
        { n: 'WhatsApp Business API', c: 'Mensajería' },
        { n: 'OpenAI / LLM', c: 'Asistente IA' },
        { n: 'TypeScript', c: 'Lenguaje' },
        { n: 'React',      c: 'Frontend' },
        { n: 'Node.js',    c: 'Backend' },
        { n: 'PostgreSQL', c: 'Base de datos' },
        { n: 'Redis',      c: 'Cache / colas' },
        { n: 'Mercado Pago', c: 'Pagos AR' },
        { n: 'Cloudflare', c: 'Infra / CDN' },
      ],
    },
    quotes: {
      eyebrow: 'Testimonios',
      num: 'Capítulo 04',
      title: 'No te creas',
      titleEm: 'lo que decimos',
      lead: 'Creele al que ya lo está usando todos los días.',
      items: [
        {
          q: 'El asistente responde solo la mayoría de las consultas de auriculares y parlantes. Yo entro al inbox y ya veo la conversación resuelta.',
          who: 'Sebastían Segovia', role: 'Director, Impacto Tienda', av: 'SS',
        },
        {
          q: 'Antes perdíamos turnos por no contestar a tiempo. Ahora el CRM guarda cada contacto y el asistente confirma la reserva solo.',
          who: 'Sebastían Pagano', role: 'Dueño, Barbería Authentic', av: 'SP',
        },
        {
          q: 'Tengo todas las consultas de mis clientes en un solo inbox de WhatsApp, con historial completo. Dejé de perder mensajes en el celular personal.',
          who: 'Veronica Kulman', role: 'Abogada, Estudio de Abogacía', av: 'VK',
        },
      ],
    },
    metrics: {
      items: [
        { n: '80', u: '%', l: 'Consultas resueltas por la IA' },
        { n: '<48', u: 'h', l: 'Para tener tu WhatsApp andando' },
        { n: '99.9', u: '%', l: 'Uptime del asistente' },
        { n: '24', u: '/7', l: 'Disponibilidad de respuesta' },
      ],
    },
    plans: {
      eyebrow: 'Planes',
      num: 'Capítulo 01',
      title: 'Un plan,',
      titleEm: 'que crece con tu negocio',
      lead: 'El mismo CRM con WhatsApp e IA, en tres tamaños. Empezás con lo que necesitás hoy, escalás cuando haga falta. Vamos juntos, mes a mes, cancelás cuando quieras.',
      payHd: 'Tus clientes pagan con',
      payFoot: 'Activamos cada método como te quede mas cómodo. Comisiones según el proveedor.',
      payMethods: [
        'Mercado Pago', 'Visa', 'Mastercard', 'Transferencia (CBU/CVU)','Efectivo',
      ],
      tabs: [
        { id: 'crm', n: '01', name: 'CRM + WhatsApp + IA', intro: 'Todo tu negocio en un solo chat', lead: 'Inbox compartido para tu equipo, catálogo cargado y un asistente de IA que responde, cotiza y filtra clientes solo. Vos supervisás todo desde un panel.' },
      ],
      monthly: '/mes',
      priceFrom: 'A partir de',
      setup: 'Costo de implementación',
      featured: 'Más elegido',
      footer: [
        { h: 'Métodos de pago aceptados',    p: 'Mercado Pago, todas las tarjetas argentinas (Visa, Mastercard, Amex, Naranja, Cabal) y transferencia CBU/CVU. Activamos lo que tu negocio necesite.' },
        { h: 'Tus conversaciones, tu CRM',   p: 'Tu historial de WhatsApp y tus contactos son tuyos. Si dejás de trabajar con nosotros, te exportamos todo. Sin lock-in.' },
        { h: 'Sin sorpresas en la factura',  p: 'Precios en pesos argentinos. Sin comisión por venta, sin cargos por usuario, sin tarifas ocultas. Soporte incluido en todos los planes.' },
      ],
      software: {
        crm: [
          { tier: 'Starter', tag: 'STR', sub: 'Para arrancar con la IA', price: 60000, setup: 25000, feats: [
            ['Hasta', '500 conversaciones con IA por mes'], ['', '1 número de WhatsApp · panel admin'],
            ['', 'Inbox compartido, 2 usuarios'], ['', 'Catálogo básico para el asistente'],
            ['', 'CRM de contactos y etiquetas'], ['Soporte', 'personalizado'],
          ], muted: ['Sin campañas masivas', 'Sin integraciones externas'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Para el día a día del negocio', price: 120000, setup: 25000, featured: true, feats: [
            ['', 'Todo lo de Starter, más:'], ['Hasta', '3.000 conversaciones con IA por mes'],
            ['', 'Sin límite de usuarios en el inbox'],
            ['Pagos:', 'Mercado Pago, Transferencia, Tarjetas'],
            ['', 'Campañas y recordatorios por WhatsApp'],
            ['', 'Reportes de conversaciones y ventas'],
            ['Soporte', 'personalizado'],
          ],},
          { tier: 'Pro', tag: 'PRO', sub: 'Volumen alto, a tu medida', price: 'comision',priceNum: '5%', priceSuffix: 'sobre ventas cerradas por WhatsApp', setup: 25000, feats: [
            ['', 'Todo lo de Grow, más:'],
            ['', 'Conversaciones con IA ilimitadas'], ['', 'Múltiples números de WhatsApp'],
            ['', 'Integración con tu sistema (API)'],
            ['Soporte', 'dedicado prioritario'],
          ] },
        ],
      },
      cta: 'Empezar con',
      ctaPro: 'Hablemos',
      currency: 'AR$',
    },
    customDev: {
      eyebrow: '¿Necesitás algo más?',
      title: 'Integraciones',
      titleEm: 'a medida',
      lead: 'Si tu negocio necesita conectar el CRM con un sistema propio, un ERP o un flujo particular de IA, lo diseñamos y construimos desde cero, con alcance claro y cotización fija.',
      points: [
        'Análisis de tu flujo actual y demo personalizada',
        'Propuesta con presupuesto detallado',
        'Integración iterativa hasta producción',
      ],
      cta: 'Pedir cotización',
      hint: 'Contanos qué necesitás conectar y te respondemos con un presupuesto a medida.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      num: 'Capítulo 05',
      title: 'Lo que siempre',
      titleEm: 'nos preguntan',
      items: [
        { q: '¿Cómo funciona el asistente de IA?',
          a: 'Se conecta a tu WhatsApp Business, aprende tu catálogo y tu forma de hablar, y responde solo las consultas frecuentes. Vos definís qué casos pasan a un humano.' },
        { q: '¿Pierdo el control de las conversaciones?',
          a: 'No, todo queda en el inbox compartido. Podés intervenir en cualquier momento y ver el historial completo de cada contacto.' },
        { q: '¿Necesito cambiar mi número de WhatsApp?',
          a: 'No, conectamos tu número actual (o uno nuevo si preferís) mediante WhatsApp Business API.' },
        { q: '¿Cuánto tarda en estar funcionando?',
          a: 'Entre 2 y 5 días desde que nos pasás tu catálogo y precios, según cuánto haya para entrenar al asistente.' },
        { q: '¿Y si necesito algo que no está en la lista?',
          a: 'Lo podemos charlar. Escribinos contando qué necesitás y nos acomodamos a tu medida (puede incluir costos extra dependiendo de la complejidad).' },
      ],
    },
    contact: {
      eyebrow: 'Trabajemos juntos',
      num: 'Capítulo 06',
      title: 'Escribinos',
      titleEm: 'por WhatsApp',
      lead: 'Sin formularios: elegí tu plan y te abrimos el chat con el mensaje listo. Respondemos en el día.',
      waLead: 'Contanos cuántas conversaciones manejás hoy y te armamos una demo del asistente con tu propio catálogo.',
      waCta: 'Abrir WhatsApp',
      waHint: 'De 9 a 19 h (Argentina) · También por email si preferís',
      aside: [
        { h: 'Por email' },
        { h: 'Por WhatsApp' },
      ],
    },
    legal: {
      back: '← Volver al inicio',
      terms: {
        title: 'Términos y Condiciones',
        updatedLabel: 'Última actualización',
        updated: '16 de junio de 2026',
        sections: [
          {
            title: '1. Uso del servicio',
            paragraphs: [
              'Codigo Norte Soluciones provee herramientas SaaS para automatización de comunicaciones, notificaciones y gestión de procesos.',
            ],
          },
          {
            title: '2. Responsabilidad del usuario',
            intro: 'El usuario se compromete a:',
            bullets: [
              'No usar la plataforma para spam',
              'Cumplir con políticas de Meta y WhatsApp',
              'No enviar contenido ilegal',
            ],
          },
          {
            title: '3. Integraciones externas',
            paragraphs: [
              'El servicio puede depender de APIs externas (como Meta/WhatsApp). No garantizamos disponibilidad continua de dichos servicios.',
            ],
          },
          {
            title: '4. Limitación de responsabilidad',
            intro: 'No nos responsabilizamos por:',
            bullets: [
              'Fallas de servicios externos',
              'Pérdidas indirectas',
            ],
          },
          {
            title: '5. Cancelación',
            paragraphs: [
              'Nos reservamos el derecho de suspender cuentas que violen estas condiciones.',
            ],
          },
        ],
        contact: {
          title: '6. Contacto',
          email: 'codigonortesoluciones@gmail.com',
        },
      },
      privacy: {
        title: 'Política de Privacidad',
        updatedLabel: 'Última actualización',
        updated: '16 de junio de 2026',
        sections: [
          {
            title: '1. Información que recopilamos',
            intro: 'En Codigo Norte Soluciones (https://codigonortesoluciones.com), valoramos la privacidad de nuestros usuarios y clientes. Podemos recopilar:',
            bullets: [
              'Nombre y datos de contacto',
              'Información de uso de la plataforma',
              'Datos enviados a través de integraciones (por ejemplo, WhatsApp, APIs de terceros)',
            ],
          },
          {
            title: '2. Uso de la información',
            intro: 'Utilizamos la información para:',
            bullets: [
              'Proveer y mejorar nuestros servicios SaaS',
              'Gestionar comunicaciones automatizadas (notificaciones, recordatorios, etc.)',
              'Brindar soporte técnico',
            ],
          },
          {
            title: '3. Integraciones con terceros',
            paragraphs: [
              'Nuestra plataforma puede integrarse con servicios como Meta (WhatsApp), APIs de mensajería y otras herramientas externas. El uso de estos servicios está sujeto a sus propias políticas de privacidad.',
            ],
          },
          {
            title: '4. Protección de datos',
            paragraphs: [
              'Implementamos medidas de seguridad para proteger la información contra accesos no autorizados.',
            ],
          },
          {
            title: '5. Compartición de datos',
            intro: 'No vendemos datos personales. Solo compartimos información cuando es necesario para:',
            bullets: [
              'Proveer el servicio',
              'Cumplir obligaciones legales',
            ],
          },
          {
            title: '6. Derechos del usuario',
            paragraphs: [
              'Los usuarios pueden solicitar acceso, modificación o eliminación de sus datos.',
            ],
          },
        ],
        contact: {
          title: '7. Contacto',
          email: 'codigonortesoluciones@gmail.com',
        },
      },
    },
    footer: {
      tagline: 'El CRM de WhatsApp con IA para negocios del norte y más allá.',
      cols: [
        {
          h: 'Sitio',
          links: [
            { label: 'Planes', href: '/#planes' },
            { label: 'Integraciones a medida', href: '/#desarrollo-a-medida' },
            { label: 'Cómo funciona', href: '/#proceso' },
            { label: 'Contacto', href: '/#contacto' },
          ],
        },
        {
          h: 'Legal',
          links: [
            { label: 'Términos y condiciones', href: '/terminos' },
            { label: 'Política de privacidad', href: '/privacidad' },
          ],
        },
        {
          h: 'Contacto',
          links: [
            { label: 'codigonortesoluciones@gmail.com', href: 'mailto:codigonortesoluciones@gmail.com' },
            { label: '+54 351 764-8146', href: 'https://wa.me/543517648146', external: true },
            { label: '@codigo.norte.soluciones', href: 'https://www.instagram.com/codigo.norte.soluciones/', external: true },
          ],
        },
      ],
      base: '© 2026 CNS · Argentina',
      baseRight: 'Argentina · GMT‑3',
      wordmark: 'cns.',
    },
  },

  en: {
    nav: {
      links: [
        { id: 'planes',    label: 'Plans' },
        { id: 'desarrollo-a-medida', label: 'Integrations' },
        { id: 'proceso',   label: 'How it works' },
        { id: 'contacto',  label: 'Contact' },
      ],
      status: 'Onboarding new businesses',
      cta: 'Activate my CRM',
      ctaGhost: 'See how it works',
    },
    hero: {
      eyebrow: 'WhatsApp CRM with AI',
      titleA: 'Your WhatsApp,',
      titleB: 'with a CRM',
      titleC: 'that replies',
      titleD: 'on its own.',
      lead:
        'Bring every WhatsApp conversation into one inbox, with an AI assistant that answers questions, builds orders and filters real leads around the clock. You see everything, you stay in control.',
      footMeta: 'GMT‑3',
      footStatus: 'Operational',
    },
    marquee: [
      'Unified inbox', 'AI assistant 24/7', 'CRM & contacts',
      'Mercado Pago · Transferencia',
    ],
    process: {
      eyebrow: 'How we work',
      num: 'Chapter 02',
      title: 'One week',
      titleEm: 'and your WhatsApp replies itself',
      lead:
        'We connect your number, train the assistant on your catalog and tone, and tune it until it answers exactly the way you want.',
      steps: [
        { t: 'Discovery',   d: 'You tell us your catalog, pricing and how you handle chats today. We define what the AI can solve alone and what goes to a human.', dur: 'Day 1' },
        { t: 'Setup',       d: 'We connect your WhatsApp number, load your catalog and train the assistant on your tone.', dur: 'Day 2' },
        { t: 'Live test',   d: 'You review real conversations, we tune replies and add your team to the shared inbox.', dur: 'Day 3' },
        { t: 'Launch',      d: 'Your CRM goes live: the AI replies, your team follows up, you see it all in one place. Then: optional monthly support.', dur: 'Week 01' },
      ],
      shotTitle: 'Here\'s what it looks like',
      shotCaption: 'A real client\'s inbox: the assistant replies on its own, your team follows up when it matters, and you see every conversation in one place.',
    },
    stack: {
      eyebrow: 'Stack',
      num: 'Chapter 04',
      title: 'What we use,',
      titleEm: 'no trade-show vibes',
      lead: 'We pick stable tools, not whatever ate Twitter last month. Everything here carries real conversations every day.',
      items: [
        { n: 'WhatsApp Business API', c: 'Messaging' }, { n: 'OpenAI / LLM', c: 'AI assistant' },
        { n: 'TypeScript', c: 'Language' }, { n: 'React',     c: 'Frontend' },
        { n: 'Node.js',    c: 'Backend' },  { n: 'PostgreSQL', c: 'Database' },
        { n: 'Redis',      c: 'Cache / queues' }, { n: 'Mercado Pago', c: 'AR payments' },
        { n: 'Cloudflare', c: 'Infra / CDN' },
      ],
    },
    quotes: {
      eyebrow: 'Testimonials',
      num: 'Chapter 04',
      title: 'Don\'t take',
      titleEm: 'our word',
      lead: 'Trust the ones using it every day.',
      items: [
        { q: 'The assistant answers most headphone and speaker questions on its own. I open the inbox and the conversation is already resolved.',
          who: 'Sebastían Segovia', role: 'Director, Impacto Tienda', av: 'SS' },
        { q: 'We used to lose bookings by replying too late. Now the CRM keeps every contact and the assistant confirms the booking by itself.',
          who: 'Sebastían Pagano', role: 'Owner, Barbería Authentic', av: 'SP' },
        { q: 'Every client question lands in one WhatsApp inbox, with full history. I stopped losing messages on my personal phone.',
          who: 'Veronica Kulman', role: 'Lawyer, Estudio de Abogacía', av: 'VK' },
      ],
    },
    metrics: {
      items: [
        { n: '80', u: '%', l: 'Questions solved by the AI' },
        { n: '<48', u: 'h', l: 'To get your WhatsApp running' },
        { n: '99.9', u: '%', l: 'Assistant uptime' },
        { n: '24', u: '/7', l: 'Response availability' },
      ],
    },
    plans: {
      eyebrow: 'Plans',
      num: 'Chapter 01',
      title: 'One plan,',
      titleEm: 'that grows with your business',
      lead: 'The same WhatsApp + AI CRM, in three sizes. Start with what you need today, scale when you need to. No eternal contracts: month-to-month, cancel any time.',
      payHd: 'Your customers pay with',
      payFoot: 'We enable each method best for you. Fees apply per provider.',
      payMethods: [
        'Mercado Pago', 'Visa', 'Mastercard', 'Transfer (CBU/CVU)', 'Cash',
      ],
      tabs: [
        { id: 'crm', n: '01', name: 'CRM + WhatsApp + AI', intro: 'Your whole business in one chat', lead: 'A shared inbox for your team, your catalog loaded in, and an AI assistant that answers, quotes and filters leads on its own. You oversee everything from one panel.' },
      ],
      monthly: '/mo',
      priceFrom: 'From',
      setup: 'Setup',
      featured: 'Most picked',
      footer: [
        { h: 'Accepted payment methods', p: 'Mercado Pago, every Argentine card (Visa, Mastercard, Amex, Naranja, Cabal) and CBU/CVU transfer. We enable whatever your business needs.' },
        { h: 'Your conversations, your CRM', p: 'Your WhatsApp history and contacts are yours. If you stop working with us, we export everything. No lock-in.' },
        { h: 'No invoice surprises',     p: 'Argentine peso prices. No commission per sale, no per-user charges, no hidden fees. Support included in every plan.' },
      ],
      software: {
        crm: [
          { tier: 'Starter', tag: 'STR', sub: 'To get the AI running', price: 60000, setup: 25000, feats: [
            ['Up to', '500 AI conversations per month'], ['', '1 WhatsApp number · admin panel'],
            ['', 'Shared inbox, 2 users'], ['', 'Basic catalog for the assistant'],
            ['', 'Contact CRM with tags'], ['Support', 'personalized'],
          ], muted: ['No bulk campaigns', 'No external integrations'] },
          { tier: 'Grow', tag: 'GRW', sub: 'For everyday business', price: 120000, setup: 25000, featured: true, feats: [
            ['', 'Everything in Starter, plus:'], ['Up to', '3,000 AI conversations per month'],
            ['', 'Unlimited inbox users'],
            ['Pay:', 'Mercado Pago, Transfer, Cards'],
            ['', 'WhatsApp campaigns and reminders'],
            ['', 'Conversation and sales reports'],
            ['Support', 'personalized'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'High volume, tailored to you', price: 'fee', priceNum: '5%', priceSuffix: 'on sales closed through WhatsApp', setup: 25000, feats: [
            ['', 'Everything in Grow, plus:'],
            ['', 'Unlimited AI conversations'], ['', 'Multiple WhatsApp numbers'],
            ['', 'Integration with your system (API)'],
            ['Support', 'dedicated priority'],
          ] },
        ],
      },
      cta: 'Start with',
      ctaPro: 'Let\'s talk',
      currency: 'AR$',
    },
    customDev: {
      eyebrow: 'Need something more?',
      title: 'Custom',
      titleEm: 'integrations',
      lead: 'If your business needs to connect the CRM to your own system, an ERP or a particular AI flow, we design and build it from scratch, with clear scope and a fixed quote.',
      points: [
        'Analysis of your current flow and a personalized demo',
        'Detailed proposal and budget',
        'Iterative delivery through to production',
      ],
      cta: 'Request a quote',
      hint: 'Tell us what you need to connect and we\'ll reply with a tailored estimate.',
    },
    faq: {
      eyebrow: 'FAQ',
      num: 'Chapter 05',
      title: 'What we\'re',
      titleEm: 'always asked',
      items: [
        { q: 'How does the AI assistant work?', a: 'It connects to your WhatsApp Business, learns your catalog and tone, and answers frequent questions on its own. You decide which cases go to a human.' },
        { q: 'Do I lose control of the conversations?', a: 'No, everything stays in the shared inbox. You can step in anytime and see the full history for every contact.' },
        { q: 'Do I need to change my WhatsApp number?', a: 'No, we connect your current number (or a new one if you prefer) through the WhatsApp Business API.' },
        { q: 'How long until it\'s running?', a: 'Between 2 and 5 days after you share your catalog and pricing, depending on how much there is to train the assistant on.' },
        { q: 'What if I need something not on the list?', a: 'We can talk it through. Tell us what you need and we\'ll adapt to your case (may include extra cost depending on complexity).' },
      ],
    },
    contact: {
      eyebrow: 'Let\'s work together',
      num: 'Chapter 06',
      title: 'Message us',
      titleEm: 'on WhatsApp',
      lead: 'No forms: pick your plan and we open chat with a pre-filled message. We reply the same day.',
      waLead: 'Tell us how many conversations you handle today and we set up a demo of the assistant with your own catalog.',
      waCta: 'Open WhatsApp',
      waHint: '9am–7pm Argentina time · Email works too',
      aside: [
        { h: 'By email' },
        { h: 'On WhatsApp' },
      ],
    },
    legal: {
      back: '← Back to home',
      terms: {
        title: 'Terms and Conditions',
        updatedLabel: 'Last updated',
        updated: 'June 16, 2026',
        sections: [
          {
            title: '1. Use of the service',
            paragraphs: [
              'Codigo Norte Soluciones provides SaaS tools for communication automation, notifications, and process management.',
            ],
          },
          {
            title: '2. User responsibility',
            intro: 'Users agree to:',
            bullets: [
              'Not use the platform for spam',
              'Comply with Meta and WhatsApp policies',
              'Not send illegal content',
            ],
          },
          {
            title: '3. External integrations',
            paragraphs: [
              'The service may depend on external APIs (such as Meta/WhatsApp). We do not guarantee continuous availability of those services.',
            ],
          },
          {
            title: '4. Limitation of liability',
            intro: 'We are not liable for:',
            bullets: [
              'Failures of external services',
              'Indirect losses',
            ],
          },
          {
            title: '5. Cancellation',
            paragraphs: [
              'We reserve the right to suspend accounts that violate these terms.',
            ],
          },
        ],
        contact: {
          title: '6. Contact',
          email: 'codigonortesoluciones@gmail.com',
        },
      },
      privacy: {
        title: 'Privacy Policy',
        updatedLabel: 'Last updated',
        updated: 'June 16, 2026',
        sections: [
          {
            title: '1. Information we collect',
            intro: 'At Codigo Norte Soluciones (https://codigonortesoluciones.com), we value the privacy of our users and clients. We may collect:',
            bullets: [
              'Name and contact details',
              'Platform usage information',
              'Data sent through integrations (e.g. WhatsApp, third-party APIs)',
            ],
          },
          {
            title: '2. Use of information',
            intro: 'We use the information to:',
            bullets: [
              'Provide and improve our SaaS services',
              'Manage automated communications (notifications, reminders, etc.)',
              'Provide technical support',
            ],
          },
          {
            title: '3. Third-party integrations',
            paragraphs: [
              'Our platform may integrate with services such as Meta (WhatsApp), messaging APIs, and other external tools. Use of these services is subject to their own privacy policies.',
            ],
          },
          {
            title: '4. Data protection',
            paragraphs: [
              'We implement security measures to protect information against unauthorized access.',
            ],
          },
          {
            title: '5. Data sharing',
            intro: 'We do not sell personal data. We only share information when necessary to:',
            bullets: [
              'Provide the service',
              'Comply with legal obligations',
            ],
          },
          {
            title: '6. User rights',
            paragraphs: [
              'Users may request access to, modification of, or deletion of their data.',
            ],
          },
        ],
        contact: {
          title: '7. Contact',
          email: 'codigonortesoluciones@gmail.com',
        },
      },
    },
    footer: {
      tagline: 'The WhatsApp CRM with AI for businesses in the north and beyond.',
      cols: [
        {
          h: 'Site',
          links: [
            { label: 'Plans', href: '/#planes' },
            { label: 'Custom integrations', href: '/#desarrollo-a-medida' },
            { label: 'How it works', href: '/#proceso' },
            { label: 'Contact', href: '/#contacto' },
          ],
        },
        {
          h: 'Legal',
          links: [
            { label: 'Terms and conditions', href: '/terminos' },
            { label: 'Privacy policy', href: '/privacidad' },
          ],
        },
        {
          h: 'Contact',
          links: [
            { label: 'codigonortesoluciones@gmail.com', href: 'mailto:codigonortesoluciones@gmail.com' },
            { label: '+54 351 764-8146', href: 'https://wa.me/543517648146', external: true },
            { label: '@codigo.norte.soluciones', href: 'https://www.instagram.com/codigo.norte.soluciones/', external: true },
          ],
        },
      ],
      base: '© 2026 CNS · Argentina',
      baseRight: 'Argentina · GMT‑3',
      wordmark: 'cns.',
    },
  },
}
