export const COPY = {
  es: {
    nav: {
      links: [
        { id: 'planes',    label: 'Planes' },
        { id: 'desarrollo-a-medida', label: 'A medida' },
        { id: 'proceso',   label: 'Proceso' },
        { id: 'casos',     label: 'Casos' },
        { id: 'contacto',  label: 'Contacto' },
      ],
      status: 'Aceptando proyectos',
      cta: 'Elegir proyecto',
      ctaGhost: 'Ver casos',
    },
    hero: {
      eyebrow: 'Consultora remota',
      titleA: 'Software',
      titleB: 'a medida.',
      titleC: 'Remoto,',
      titleD: 'de punta a punta.',
      lead:
        'Diseñamos y construimos sistemas para pymes desde cualquier lugar: ecommerce, turneros, gestión de gimnasios y restaurantes, e-ticketera. Kickoff por videollamada, iteramos online y entregamos andando. Sin promesas raras.',
      footMeta: 'GMT‑3',
      footStatus: 'Operando',
    },
    marquee: [
      '100% remoto', 'Videollamada', 'Software a medida',
      'Mercado Pago · Transferencia',
    ],
    process: {
      eyebrow: '02 — Cómo trabajamos',
      num: 'Capítulo 02',
      title: 'Dos semanas',
      titleEm: 'a producción',
      lead:
        'Desde TU demo hasta producción, iteramos con vos hasta que estés completamente satisfecho, mostramos avances reales y entregamos tu sistema andando.',
      steps: [
        { t: 'Descubrimiento',  d: 'Elegís tu solución, te escuchamos, definimos lo que queres hacer y te presentamos tu demo personalizada.', dur: 'Semana 01' },
        { t: 'Diseño',          d: 'Validamos con los usuarios reales y realizamos la integracion de tu plan.', dur: 'Semana 01' },
        { t: 'Construcción',    d: 'Vos ves el progreso, opinás, ajustamos.', dur: 'Semana 02' },
        { t: 'Puesta en marcha',d: 'Capacitación con tu producto en producción. Listo para usar. Después: soporte mensual opcional.', dur: 'Semana 02' },
      ],
    },
    work: {
      eyebrow: '03 — Casos',
      num: 'Capítulo 03',
      title: 'Lo último',
      titleEm: 'que hicimos',
      lead: 'Proyectos reales, entregados en remoto. Entrá y mirá el resultado.',
      open: 'Ver sitio',
      items: [
        { n: '01', cat: 'Ecommerce', t: 'Impacto Tienda', m: 'Plan Pro end to end: catálogo, pagos y operación multisucursal en una sola plataforma.', kind: 'shop', image: '/cliente2.webp', url: 'https://www.impactotienda.com.ar' },
        { n: '02', cat: 'Turnero', t: 'Barbería Authentic', m: 'Reservas 24/7 con marca propia, cobros online y agenda del equipo.', kind: 'orders', image: '/cliente1.webp', url: 'https://www.authenticbarberia.com' },
        { n: '03', cat: 'Landing', t: 'Legales MV Kulman', m: 'Sitio profesional para captar consultas y proyectar una imagen de estudio.', kind: 'orders', image: '/cliente3.webp', url: 'https://legalesmvkulman.com' },
        { n: '04', cat: 'Gimnasio', t: 'Buena Vida', m: 'Socios, cuotas y acceso: el plan Grow andando para el día a día del gym.', kind: 'orders', image: '/cliente4.webp', url: 'https://buenavidaarg.com' },
        { n: '05', cat: 'Reservas', t: 'Patagonia Inquieta', m: 'Landing con sistema de reserva de tours, lista para vender online.', kind: 'orders', image: '/cliente5.webp', url: 'https://www.patagoniainquieta.com' },
        { n: '06', cat: 'Gimnasio', t: 'CR-ONFIT', m: 'Gestión de socios y pagos para un gimnasio que opera sin fricción.', kind: 'orders', image: '/cliente6.webp', url: 'https://www.cronfit.com.ar' },
      ],
    },
    stack: {
      eyebrow: '04 — Stack',
      num: 'Capítulo 04',
      title: 'Lo que usamos,',
      titleEm: 'sin parecer feria',
      lead: 'Apostamos a herramientas estables, no a la moda del mes. Lo que está acá lleva años en producción nuestra.',
      items: [
        { n: 'TypeScript', c: 'Lenguaje' },
        { n: 'React',      c: 'Frontend' },
        { n: 'Next.js',    c: 'Framework' },
        { n: 'Node.js',    c: 'Backend' },
        { n: 'PostgreSQL', c: 'Base de datos' },
        { n: 'Redis',      c: 'Cache / colas' },
        { n: 'Prisma',     c: 'ORM' },
        { n: 'Tailwind',   c: 'Estilos' },
        { n: 'Mercado Pago', c: 'Pagos AR' },
        { n: 'Transferencia', c: 'Pagos USD' },
        { n: 'Cloudflare', c: 'Infra / CDN' },
      ],
    },
    quotes: {
      eyebrow: '04 — Lo que dicen',
      num: 'Capítulo 04',
      title: 'No te creas',
      titleEm: 'lo que decimos',
      lead: 'Creele al que ya lo está usando todos los días.',
      items: [
        {
          q: 'Unificamos el trafico de dos webs de cada local en una sola, mejoró nuestro tráfico y el diseño de la pagina nos encanto.',
          who: 'Sebastían Segovia', role: 'Director, Impacto Tienda', av: 'SS',
        },
        {
          q: 'Dejamos un CRM generico para tener nuestro propia marca personal y aprovechamos la promo por miembro para bajar nuestros costos.',
          who: 'Sebastían Pagano', role: 'Dueño, Barbería Authentic', av: 'SP',
        },
        {
          q: 'Abri mi estudio propio y mi web me permitió llegar a mas clientes y tener un sitio y una imagen mucho más profesional.',
          who: 'Veronica Kulman', role: 'Abogada, Estudio de Abogacía', av: 'VK',
        },
      ],
    },
    metrics: {
      items: [
        { n: '37', u: '', l: 'Proyectos entregados' },
        { n: '<5', u: 'sem', l: 'Tiempo a producción' },
        { n: '99.9', u: '%', l: 'Uptime últimos 12m' },
        { n: '100', u: '%', l: 'Trabajo remoto' },
      ],
    },
    plans: {
      eyebrow: '01 — Planes',
      num: 'Capítulo 01',
      title: 'Elegí tu plan,',
      titleEm: 'seis sistemas que entendemos a medida',
      lead: 'Cada uno de nuestros sistemas viene en tres tamaños. Empezás con lo que necesitás hoy, escalás cuando hace falta. Vamos juntos, mes a mes, cancelás cuando quieras.',
      payHd: 'Tus clientes pagan con',
      payFoot: 'Activamos cada método como te quede mas cómodo. Comisiones según el proveedor.',
      payMethods: [
        'Mercado Pago', 'Visa', 'Mastercard', 'Transferencia (CBU/CVU)','Efectivo',
      ],
      tabs: [
        { id: 'ecommerce', n: '01', name: 'Ecommerce',     intro: 'Vendé online 24/7. Controla tu negocio desde cualquier lugar.',         lead: 'Tienda propia con catálogo, carrito, pasarela de pago integrada. Es tu plataforma.' },
        { id: 'gym',       n: '02', name: 'Gimnasios',     intro: 'Socios, cuotas y acceso QR sin volverte loco.',         lead: 'Débito automático, control de acceso por QR, clases con cupo, métricas de retención. Para gimnasios, estudios, pilates, crossfit.' },
        { id: 'queue',     n: '03', name: 'Turneros',      intro: 'Crea tu propia marca personal y tomá el control.',     lead: 'Para profesionales particulares, clínicas y consultorios. Automatiza tus reservas y funciona 24/7.' },
        { id: 'landing',   n: '04', name: 'Landing pro',   intro: 'Tu cara online — sin templates de Wix.',                lead: 'Sitio profesional para abogados, contadores, médicos, arquitectos. Diseño a medida, formularios serios.' },
        { id: 'ticket',    n: '05', name: 'E-ticketera',   intro: 'Vendé entradas y validá QR en la puerta.',     lead: 'Para boliches, teatros, espectáculos y eventos corporativos. Cobrás con Mercado Pago o transferencia y seguí al evento.' },
        { id: 'gastro',    n: '06', name: 'Gastronomía',   intro: 'Mozo, cocina, delivery y caja, en un mismo sistema.',  lead: 'QR para mesas y mostrador, pantalla de pedidos en cocina, seguimiento de delivery, stock por insumo y arqueo de caja.' },
      ],
      monthly: '/mes',
      priceFrom: 'A partir de',
      setup: 'Costo de implementación',
      featured: 'Más elegido',
      footer: [
        { h: 'Métodos de pago aceptados',    p: 'Mercado Pago, todas las tarjetas argentinas (Visa, Mastercard, Amex, Naranja, Cabal) y transferencia CBU/CVU. Activamos lo que tu negocio necesite.' },
        { h: 'Tu data, tu código',           p: 'Repositorio, hosting y credenciales a tu nombre. Si dejás de trabajar con nosotros, te entregamos las llaves y listo. Sin lock-in.' },
        { h: 'Sin sorpresas en la factura',  p: 'Precios en pesos argentinos. Sin comisión por venta, sin cargos por usuario, sin tarifas ocultas. Soporte incluido en todos los planes.' },
      ],
      software: {
        ecommerce: [
          { tier: 'Starter', tag: 'STR', sub: 'Para empezar a vender ya', price: 50000, setup: 25000, feats: [
            ['Hasta', '50 productos'], ['', '1 sucursal · Panel admin/empleados'], ['', 'Catálogo + carrito + checkout hacia Whats App'],
            ['', 'Dominio + SSL + hosting incluido'],['Promociones', 'gestionás tus promociones por la web'],['Soporte', 'personalizado'],
          ], muted: ['Sin pasarela de pago integrada', 'Sin panel de ventas', 'Sin metodos de envio'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Para vender en serio', price: 120000, setup: 25000, featured: true, feats: [
            ['', 'Todo lo de Starter, más:'], ['Catálogo:', 'Sin límite de productos'], ['', '2 sucursales, varios locales'],
            ['Pagos:', 'Mercado Pago, Transferencia, Tarjetas'],
            ['', 'Sin límite de usuarios'],
            ['', 'Integración con Correo Argentino / Andreani'],
            ['Soporte', 'personalizado'],
          ],},
          { tier: 'Pro', tag: 'PRO', sub: 'Sin monto fijo', price: 'comision',priceNum: '5%', priceSuffix: 'por producto vendido', setup: 25000, feats: [
            ['', 'Todo lo de Starter, más:'],
            ['', 'Productos ilimitados'], ['', 'Multi-sucursal'],
            ['', 'Sin límite de usuarios'],
            ['Pagos:', 'Mercado Pago, Transferencia, Tarjetas'],
            ['', 'Integración con Correo Argentino / Andreani'],
            ['Soporte', 'dedicado prioritario'],
          ] },
        ],
        ticket: [
          { tier: 'Starter', tag: 'STR', sub: 'Tu primer evento online', price: 'comisión', priceNum: '4,5%', priceSuffix: 'por ticket vendido', setup: 25000 , feats: [
            ['', 'Sin límite de entradas'], ['', 'Todos los tipos de entrada (general, vip, early, free)'],
            ['Pagos:', 'Mercado Pago + transferencia'], ['', 'QR validable desde celular'],
            ['', 'Reporte de ventas en vivo'],
            ['', 'Reserva y gestión de mesas online'], ['Soporte', 'personalizado'],
          ], muted: ['Sin panel RRPP', 'Sin menu de mesas online'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Festivales y eventos medianos', price: 'comisión', priceNum: '5%', priceSuffix: 'por ticket vendido', setup: 25000, featured: true,
             feats: [
            ['', 'Sin límite de entradas'], ['', 'Todos los tipos de entrada (general, vip, early, free)'], ['', 'Múltiples eventos simultáneos'], 
            ['Pagos:', 'Mercado Pago + Transferencia + tarjetas + débito'],
            ['Galería de fotos', 'para potenciar tu comunidad online'],
            ['Sistema de RRPP','incluido con links de pago'], ['', 'QR validable desde el celular'],
            ['', 'Reserva y gestión de mesas online, con menú propio'],
            ['Soporte', 'personalizado'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Productoras y eventos grandes(según facturación)', price: 'comisión', priceNum: '3,5%', priceSuffix: 'o cuota fija mensual', setup: 'a medida', feats: [
            ['', 'Todo lo de Grow, más:'],['', 'Multi-sucursal'],['', 'Sin límite de usuarios'],
            ['', 'API + integración con ERP'],
            ['APP propia', 'para scanner y promociones por usuario por aplicación'],
            ['Soporte', 'dedicado prioritario'],
          ] },
        ],
        gastro: [
          { tier: 'Starter', tag: 'STR', sub: 'Un solo local', price: 25000, setup: 25000, feats: [
            ['', '1 local'], ['', 'QR para mesas y mostrador'], ['', 'Pantalla de pedidos en cocina'],
            ['', 'Carta y panel de stock de productos sin límite'],
            ['', 'Arqueo de caja'], ['Soporte', 'personalizado'],
          ], muted: ['Sin programa de fidelización', 'Sin panel de promociones', 'Sin pagos online'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Hasta 3 locales', price: 35000, setup: 25000, featured: true, feats: [
            ['', 'Todo lo de Starter, más:'], ['', '3 locales'],
            ['', 'Panel de pedidos de proveedores'], ['', 'Programa de fidelización'],
            ['Pagos:', 'Mercado Pago, Transferencia, tarjetas'],
            ['', 'Panel de registro de pagos'],
            ['', 'Panel de promociones'],
            ['Soporte', 'personalizado'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Sin límite de locales', price: 100000, setup: 'a medida', feats: [
            ['', 'Todo lo de Grow, más:'], ['', 'Sin límite de locales'],
            ['', 'API para integrar tu sistema ERP'],
            ['', 'App móvil del cliente'],
            ['Soporte', 'dedicado prioritario'],
          ] },
        ],
        gym: [
          { tier: 'Starter', tag: 'STR', sub: 'Gym de barrio / estudio', price: 100000, setup: 25000, feats: [
            ['Hasta', '100 socios activos'], ['', '1 sede'],
            ['','Sistema de notificaciones'],
            ['', 'Control de acceso por QR o DNI'],
            ['', 'Gestión de miembros y pagos manuales'],
            ['Soporte', 'personalizado'],
          ], muted: ['Sin pagos online', 'Sin clases personalizadas', 'Sin rutinas y programas de entrenamiento'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Gimnasio establecido', price: 150000, setup: 25000, featured: true, feats: [
            ['', 'Todo lo de Starter, más:'], ['Hasta', '300 socios activos'], ['', 'Hasta 3 sedes'], 
            ['', 'Panel de entrenadores'],
            ['Pagos', 'online Mercado Pago, Transferencia, tarjetas'], ['', 'Gestión de eventos'],
            ['', 'Rutinas y programas de entrenamiento personalizados'],
            ['Soporte', 'personalizado'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Empezá sin costos', price: 'comision',priceNum: '5%', priceSuffix: 'por socio activo', setup: 'a medida', feats: [
            ['', 'Todo lo de Grow, más:'], ['', 'Sin límite de socios'], ['', 'Sin límite de sedes'],
            ['Soporte', 'dedicado prioritario'],
          ] },
        ],
        queue: [
          { tier: 'Starter', tag: 'STR', sub: 'Un profesional', price: 20000, setup: 25000, feats: [
            ['', 'Marca personal'], ['', 'Sin límite de servicios'],
            ['', 'Reserva con mail y panel administrador'],
            ['', 'Configuracion de servicios y horarios'],
            ['', 'Bloqueo de horarios y dias'],
            ['Pagos', 'de reservas online: Mercado Pago, Transferencia, tarjetas'],
            ['', 'Panel de administración de tus cobros y reservas'],
            ['CTA', 'Botón de whatsapp para reservar'],
            ['Soporte', 'personalizado'],
          ] },
          { tier: 'Grow', tag: 'GRW', sub: 'Un equipo', price: 'comision',priceNum: '10.000', priceSuffix: 'por profesional activo /mes', setup: 25000, featured: true, feats: [
            ['', 'Todo lo de Starter, más:'], ['', 'Sin límite de profesionales'],
            ['', 'Configuración de cursos y capacitaciones'],
            ['Soporte', 'personalizado'],
          ] },
        ],
        landing: [
          { tier: 'Grow', tag: 'GRW', sub: 'Pagás una sola vez por un año', price: 'comision',priceNum: '120.000', priceSuffix: 'por año (AHORRO 50% vs mensual)', setup: 19000, featured: false, feats: [
            ['', '1 página · diseño a medida de tu marca'], ['Secciones', 'Sobre mi, Servicios, Testimonios, Contacto'],
            ['', 'Boton de whatsapp para contactar'],
            ['', 'Formulario de contacto'],
            ['Galería', ' hasta 20 fotos'],
            ['', 'Dominio + SSL + hosting incluido'], ['Soporte', 'personalizado'],
          ] },
          { tier: 'Starter', sub: 'Tu sitio  profesional', price: 20000, setup: 19000,featured: true, feats: [
            ['', '1 página · diseño a medida de tu marca'], ['Secciones', 'Sobre mi, Servicios, Testimonios, Contacto'],
            ['', 'Boton de whatsapp para contactar'],
            ['', 'Formulario de contacto'],
            ['Galería', ' hasta 20 fotos'],
            ['', 'Dominio + SSL + hosting incluido'], ['Soporte', 'personalizado'],
          ], muted: ['Sin blog / CMS', 'Sin multi-idioma'] },
          { tier: 'Pro', tag: 'PRO', sub: 'Estudio o agencia grande', price: 50000, setup: '25000', feats: [
            ['', 'Todo lo de Grow, más:'], ['', 'Hasta 5 páginas'],
            ['', 'Multi-idioma (ES/EN/PT)'], ['', 'Galería de fotos ilimitada'],
             ['Soporte', 'dedicado prioritario'],
          ] },
        ],
      },
      cta: 'Empezar con',
      ctaPro: 'Hablemos',
      currency: 'AR$',
    },
    customDev: {
      eyebrow: '¿Nada encaja?',
      title: 'Desarrollo de software',
      titleEm: 'a medida',
      lead: 'Si tu negocio necesita un sistema particular que no está en nuestros planes, lo diseñamos y construimos desde cero — con alcance claro y cotización fija.',
      points: [
        'Análisis de requerimientos y demo personalizada',
        'Propuesta con presupuesto detallado',
        'Entrega iterativa hasta producción',
      ],
      cta: 'Pedir cotización',
      hint: 'Contanos qué necesitás construir y te respondemos con un presupuesto a medida.',
    },
    faq: {
      eyebrow: '05 — Preguntas',
      num: 'Capítulo 05',
      title: 'Lo que siempre',
      titleEm: 'nos preguntan',
      items: [
        { q: '¿Cuánto sale un proyecto?',
          a: 'Cada solución tiene un precio diferente según el plan que elijas, pero todos cuentan con un costo de configuración externo a nuestro trabajo de 25.000 pesos al año. Los costos de pasarelas de pagos no se encuentran incluidos en el precio.' },
        { q: '¿Trabajan presencial o solo remoto?',
          a: 'Somos 100% remotos. Kickoff por videollamada, iteramos por WhatsApp y entregamos el sistema andando, estés donde estés.' },
        { q: '¿Se puede transferir el dominio?',
          a: 'Si, el costo de configuracion anual incluye el dominio y el hosting. Es tuyo para siempre.' },
        { q: '¿Hacen mantenimiento después?',
          a: 'Sí, todos los planes tienen soporte personalizado, estamos para apoyarte en todo lo que necesites.' },
        { q: '¿Y si necesito algo que no está en la lista?',
          a: 'Lo podemos charlar. Escribinos contando qué necesitás y nos acomodamos a tu medida (puede incluir costos extra dependiendo de la complejidad).' },
      ],
    },
    contact: {
      eyebrow: '06 — Trabajemos juntos',
      num: 'Capítulo 06',
      title: 'Escribinos',
      titleEm: 'por WhatsApp',
      lead: 'Sin formularios: elegí tu plan y te abrimos el chat con el mensaje listo. Respondemos en el día.',
      waLead: 'Contanos qué producto y plan te interesan desde la sección Planes, o escribinos directo por WhatsApp.',
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
      tagline: 'Consultora remota de software a medida.',
      cols: [
        {
          h: 'Sitio',
          links: [
            { label: 'Planes', href: '/#planes' },
            { label: 'Desarrollo a medida', href: '/#desarrollo-a-medida' },
            { label: 'Proceso', href: '/#proceso' },
            { label: 'Casos', href: '/#casos' },
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
      base: '© 2026 Código Norte Soluciones — Argentina',
      baseRight: 'Argentina · GMT‑3',
      wordmark: 'codigo norte.',
    },
  },

  en: {
    nav: {
      links: [
        { id: 'planes',    label: 'Plans' },
        { id: 'desarrollo-a-medida', label: 'Custom' },
        { id: 'proceso',   label: 'Process' },
        { id: 'casos',     label: 'Work' },
        { id: 'contacto',  label: 'Contact' },
      ],
      status: 'Booking 2 projects',
      cta: 'Start a project',
      ctaGhost: 'See work',
    },
    hero: {
      eyebrow: 'Remote consultancy',
      titleA: 'Custom',
      titleB: 'software.',
      titleC: 'Remote,',
      titleD: 'end to end.',
      lead:
        'We design and build systems for small businesses from anywhere: ecommerce, booking, gym and restaurant management, ticketing. Kickoff over video, iterate online, ship it running. No weird promises.',
      footMeta: 'GMT‑3',
      footStatus: 'Operational',
    },
    marquee: [
      '100% remote', 'Video kickoff', 'Custom software',
      'Mercado Pago · Transferencia',
    ],
    process: {
      eyebrow: '02 — How we work',
      num: 'Chapter 02',
      title: 'Four weeks',
      titleEm: 'to production',
      lead:
        'No waterfall, no cardboard scrum. We iterate with you every week, show real progress and ship a running system, not a PDF.',
      steps: [
        { t: 'Discovery',   d: 'We jump on a call. Map current flows, listen to the team, define the minimum viable scope.', dur: 'Week 01' },
        { t: 'Design',      d: 'Wireframes and clickable prototypes. Validated with real users before we touch a line of code.', dur: 'Week 02' },
        { t: 'Build',       d: '5-day sprints with Friday demos. You see the progress, give feedback, we adjust.', dur: 'Week 03–04' },
        { t: 'Launch',      d: 'Data migration, team training, hypercare week. Then: optional monthly support.', dur: 'Week 05' },
      ],
    },
    work: {
      eyebrow: '03 — Work',
      num: 'Chapter 03',
      title: 'Latest',
      titleEm: 'we shipped',
      lead: 'Real projects, delivered remotely. Click through and see the result.',
      open: 'Visit site',
      items: [
        { n: '01', cat: 'Ecommerce', t: 'Impacto Tienda', m: 'Pro plan end to end: catalog, payments and multi-store ops in one platform.', kind: 'shop', image: '/cliente2.webp', url: 'https://www.impactotienda.com.ar' },
        { n: '02', cat: 'Booking', t: 'Barbería Authentic', m: '24/7 booking with its own brand, online payments and a shared calendar.', kind: 'orders', image: '/cliente1.webp', url: 'https://www.authenticbarberia.com' },
        { n: '03', cat: 'Landing', t: 'Legales MV Kulman', m: 'A professional site to capture inquiries and look like a real firm.', kind: 'orders', image: '/cliente3.webp', url: 'https://legalesmvkulman.com' },
        { n: '04', cat: 'Gym', t: 'Buena Vida', m: 'Members, fees and access: the Grow plan running the gym day to day.', kind: 'orders', image: '/cliente4.webp', url: 'https://buenavidaarg.com' },
        { n: '05', cat: 'Bookings', t: 'Patagonia Inquieta', m: 'A landing with a tour booking system, ready to sell online.', kind: 'orders', image: '/cliente5.webp', url: 'https://www.patagoniainquieta.com' },
        { n: '06', cat: 'Gym', t: 'CR-ONFIT', m: 'Member and payment management for a gym that runs without friction.', kind: 'orders', image: '/cliente6.webp', url: 'https://www.cronfit.com.ar' },
      ],
    },
    stack: {
      eyebrow: '04 — Stack',
      num: 'Chapter 04',
      title: 'What we use,',
      titleEm: 'no trade-show vibes',
      lead: 'We pick stable tools, not whatever ate Twitter last month. Everything here has been in our production for years.',
      items: [
        { n: 'TypeScript', c: 'Language' }, { n: 'React',     c: 'Frontend' },
        { n: 'Next.js',    c: 'Framework' },{ n: 'Node.js',   c: 'Backend' },
        { n: 'PostgreSQL', c: 'Database' }, { n: 'Redis',     c: 'Cache / queues' },
        { n: 'Prisma',     c: 'ORM' },      { n: 'Tailwind',  c: 'Styling' },
        { n: 'Mercado Pago', c: 'AR payments' }, { n: 'Transferencia', c: 'USD payments' },
      ],
    },
    quotes: {
      eyebrow: '04 — Reviews',
      num: 'Chapter 04',
      title: 'Don\'t take',
      titleEm: 'our word',
      lead: 'Trust the ones using it every day.',
      items: [
        { q: 'We went from Excel to a real system in five weeks. Members renew on their own via auto-debit and I stopped chasing late payments.',
          who: 'Mariano Quispe', role: 'Director, Club San Pedro', av: 'MQ' },
        { q: 'What I valued most: they hopped on a call, understood how we worked and built something my waiter uses without any training.',
          who: 'Laura Mamaní', role: 'Owner, Almacén del Sur', av: 'LM' },
        { q: 'We validated 14,000 tickets in one night without internet on site. Unthinkable with our previous solution.',
          who: 'Diego Fernández', role: 'Producer, Pachamama Festival', av: 'DF' },
      ],
    },
    metrics: {
      items: [
        { n: '37', u: '', l: 'Projects shipped' },
        { n: '<5', u: 'w', l: 'Time to production' },
        { n: '99.9', u: '%', l: 'Uptime last 12m' },
        { n: '100', u: '%', l: 'Fully remote' },
      ],
    },
    plans: {
      eyebrow: '01 — Plans',
      num: 'Chapter 01',
      title: 'Pick your plan,',
      titleEm: 'grow without a ceiling',
      lead: 'Every system comes in three sizes. Start with what you need today, scale when you need to. No eternal contracts: month-to-month, cancel any time.',
      payHd: 'Your customers pay with',
      payFoot: 'We enable each method best for you. Fees apply per provider.',
      payMethods: [
        'Mercado Pago', 'Visa', 'Mastercard', 'Transfer (CBU/CVU)', 'Cash',
      ],
      tabs: [
        { id: 'ecommerce', n: '01', name: 'Ecommerce',     intro: 'Sell online.',         lead: 'Your own store with catalog, cart, payment gateway. It\'s your platform.' },
        { id: 'gym',       n: '02', name: 'Gyms',          intro: 'Members, fees and QR access without losing sleep.',  lead: 'Auto-debit, QR access control, classes with capacity, retention metrics. For gyms, studios, pilates, crossfit.' },
        { id: 'queue',     n: '03', name: 'Queueing',      intro: 'Voice call-out, TV display and live metrics.',       lead: 'For clinics, public offices, banks and surgeries. Multi-counter, TTS, queue and service-time metrics.' },
        { id: 'landing',   n: '04', name: 'Pro landing',   intro: 'Your face online — no Wix templates.',                lead: 'Professional site for lawyers, accountants, doctors, architects. Custom design, serious forms, local SEO.' },
        { id: 'ticket',    n: '05', name: 'E-ticketera',   intro: 'Sell tickets and validate QR at the door.',  lead: 'For festivals, theatres, shows and corporate events. Charge with Mercado Pago, assign seats, enter the venue without internet.' },
        { id: 'gastro',    n: '06', name: 'Restaurants',   intro: 'Waiter, kitchen, delivery and till — one system.',   lead: 'POS for tables and counter, KDS in the kitchen, in-house delivery, recipe-level stock and daily reconciliation.' },
      ],
      monthly: '/mo',
      priceFrom: 'From',
      setup: 'Setup',
      featured: 'Most picked',
      footer: [
        { h: 'Accepted payment methods', p: 'Mercado Pago, every Argentine card (Visa, Mastercard, Amex, Naranja, Cabal) and CBU/CVU transfer. We enable whatever your business needs.' },
        { h: 'Your data, your code',     p: 'Repo, hosting and credentials in your name. If you stop working with us, we hand you the keys. No lock-in.' },
        { h: 'No invoice surprises',     p: 'Argentine peso prices. No commission per sale, no per-user charges, no hidden fees. Support included in every plan.' },
      ],
      software: {
        ecommerce: [
          { tier: 'Starter', tag: 'STR', sub: 'To start selling now', price: 89000, setup: 450000, feats: [
            ['Up to', '100 products'], ['', '1 store · 1 admin'], ['', 'Catalog + cart + checkout'],
            ['Pay:', 'Mercado Pago + transfer'],
            ['', 'Domain + SSL + hosting included'], ['Support', 'email · 48 h'],
          ], muted: ['No recurring subscriptions', 'No native mobile app'] },
          { tier: 'Grow', tag: 'GRW', sub: 'To sell seriously', price: 159000, setup: 850000, featured: true, feats: [
            ['Up to', '1,000 products'], ['', '3 stores · 5 users'], ['', 'Everything in Starter, plus:'],
            ['Pay:', 'MP, Transfer, cards'], ['', 'Recurring / subscription orders'],
            ['', 'Coupons, discounts, gift cards'], ['', 'Andreani / OCA / Correo integration'],
            ['Support', 'WhatsApp · 24 h'],
          ], muted: ['No ERP / SAP integration'] },
          { tier: 'Pro', tag: 'PRO', sub: 'Operations at scale', price: 290000, setup: 'custom', feats: [
            ['', 'Unlimited products'], ['', 'Multi-store · unlimited users'], ['', 'Everything in Grow, plus:'],
            ['', 'Custom API + integrations'], ['', 'ERP / SAP / Tango / Bejerman'],
            ['', 'Multi-currency · multi-language'], ['', 'B2B portal + price lists'],
            ['', 'SLA 99.9% · staging environment'], ['Support', 'dedicated · 4 h'],
          ] },
        ],
        ticket: [
          { tier: 'Starter', tag: 'STR', sub: 'Your first online event', price: 'fee', priceNum: '4.5%', priceSuffix: 'per ticket sold', setup: 0, feats: [
            ['Up to', '500 tickets per event'], ['', '1 producer · 1 event at a time'], ['', 'Ticket types (general, vip, early)'],
            ['Pay:', 'Mercado Pago + transfer'], ['', 'QR validation from phone'],
            ['', 'Live sales reports'], ['Support', 'email'],
          ], muted: ['No seat mapping', 'No physical scanners'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Festivals and mid-size events', price: 'fee', priceNum: '3.5%', priceSuffix: 'per ticket sold', setup: 280000, featured: true, feats: [
            ['Up to', '5,000 tickets per event'], ['', 'Multiple simultaneous events'], ['', 'Everything in Starter, plus:'],
            ['', 'Seat / section mapping'], ['Pay:', 'MP + Transferencia + cards + debit'],
            ['', 'Up to 4 validation points'], ['', 'Optional physical scanners'],
            ['', 'WhatsApp with auto QR'], ['Support', 'WhatsApp · 24 h'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Producers and big tours', price: 'fee', priceNum: '2.5%', priceSuffix: 'or monthly flat fee', setup: 'custom', feats: [
            ['', 'Unlimited tickets'], ['', 'Multi-event · multi-org'], ['', 'Everything in Grow, plus:'],
            ['', 'White-label with your brand'], ['', 'API + ERP integrations'],
            ['', 'Up to 20 validation points'], ['', 'Controlled resale + transfers'],
            ['', 'SLA 99.9% during the event'], ['Support', '24/7 on event night'],
          ] },
        ],
        gastro: [
          { tier: 'Starter', tag: 'STR', sub: 'One single location', price: 69000, setup: 380000, feats: [
            ['', '1 location · 5 devices'], ['', 'POS for tables and counter'], ['', 'Basic kitchen KDS'],
            ['', 'Stock per product'], ['Pay:', 'MP, cards, cash'],
            ['', 'Daily cash reconciliation'], ['Support', 'email · 48 h'],
          ], muted: ['No in-house delivery', 'No loyalty program'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Up to 3 locations', price: 129000, setup: 680000, featured: true, feats: [
            ['', '3 locations · 15 devices'], ['', 'Everything in Starter, plus:'], ['', 'In-house delivery + riders'],
            ['', 'Recipe-level stock'], ['', 'Loyalty program'],
            ['Pay:', 'MP, Transferencia, cards, QR'], ['', 'Rappi / PedidosYa integration'],
            ['Support', 'WhatsApp · 24 h'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Chains and franchises', price: 240000, setup: 'custom', feats: [
            ['', 'Unlimited locations'], ['', 'Everything in Grow, plus:'], ['', 'Multi-brand / multi-entity'],
            ['', 'BI: sales, waste, margin'], ['', 'API to plug your ERP'],
            ['', 'White-label customer app'], ['', 'SLA 99.9% in business hours'],
            ['Support', 'dedicated · 4 h'],
          ] },
        ],
        gym: [
          { tier: 'Starter', tag: 'STR', sub: 'Neighbourhood gym / studio', price: 59000, setup: 320000, feats: [
            ['Up to', '300 active members'], ['', '1 location'], ['', 'Fees + auto reminders'],
            ['Pay:', 'MP, transfer, cash'], ['', 'Manual access control'],
            ['', 'Digital QR card'], ['Support', 'email · 48 h'],
          ], muted: ['No auto-debit', 'No capped classes'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Established gym', price: 119000, setup: 580000, featured: true, feats: [
            ['Up to', '1,500 active members'], ['', 'Up to 3 locations'], ['', 'Everything in Starter, plus:'],
            ['', 'Auto-debit MP / card'], ['', 'QR access control (turnstile)'],
            ['', 'Classes with capacity + waitlist'], ['', 'Retention + churn reports'],
            ['Support', 'WhatsApp · 24 h'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Multi-site chain', price: 220000, setup: 'custom', feats: [
            ['', 'Unlimited members'], ['', 'Unlimited locations'], ['', 'Everything in Grow, plus:'],
            ['', 'Native mobile app (iOS + Android)'], ['', 'Bookings, assessments, training plans'],
            ['', 'Scale / cardio integration'], ['', 'Multi-site BI'],
            ['Support', 'dedicated · 4 h'],
          ] },
        ],
        queue: [
          { tier: 'Starter', tag: 'STR', sub: 'Single small office', price: 49000, setup: 240000, feats: [
            ['', '1 location · 3 counters'], ['', 'TV display + ticket dispenser'], ['', 'Audio call-out'],
            ['', 'Basic wait metrics'], ['', 'Printed or digital tickets'],
            ['Support', 'email · 48 h'],
          ], muted: ['No voice TTS', 'No advance booking'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Multiple offices', price: 99000, setup: 480000, featured: true, feats: [
            ['', 'Up to 5 locations · 10 counters each'], ['', 'Everything in Starter, plus:'], ['', 'TTS: voice call-out per counter'],
            ['', 'Multiple queues / priorities'], ['', 'Online + WhatsApp pre-booking'],
            ['', 'Detailed metrics + dashboards'], ['Support', 'WhatsApp · 24 h'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Banks / public offices', price: 180000, setup: 'custom', feats: [
            ['', 'Unlimited locations · unlimited counters'], ['', 'Everything in Grow, plus:'], ['', 'API + your-system integration'],
            ['', 'Post-service surveys'], ['', 'Complex routing rules'],
            ['', 'SLA 99.9% in business hours'], ['Support', 'dedicated · 4 h'],
          ] },
        ],
        landing: [
          { tier: 'Starter', tag: 'STR', sub: 'A site well-built', price: 19000, priceLead: 380000, setup: 0, feats: [
            ['One-off', '$ 380,000 + $ 19,000/mo hosting'], ['', '1 page · custom design'], ['', 'Up to 4 sections'],
            ['', 'Contact form · email'], ['', 'Local SEO + Google Business'],
            ['', 'Domain + SSL + hosting included'], ['Support', 'email · 1 change/mo'],
          ], muted: ['No blog / CMS', 'No multi-language'] },
          { tier: 'Grow', tag: 'GRW', sub: 'Your firm or surgery', price: 29000, priceLead: 680000, setup: 0, featured: true, feats: [
            ['One-off', '$ 680,000 + $ 29,000/mo hosting'], ['', '5 pages · custom design'], ['', 'Everything in Starter, plus:'],
            ['', 'Blog with CMS you edit'], ['', 'Built-in booking / agenda'],
            ['Pay:', 'MP for deposits / consultations'], ['', 'Multi-form + auto-replies'],
            ['Support', '4 changes/mo'],
          ] },
          { tier: 'Pro', tag: 'PRO', sub: 'Large studio or agency', price: 49000, priceLead: 1200000, setup: 0, feats: [
            ['One-off', '$ 1,200,000 + $ 49,000/mo hosting'], ['', 'Unlimited pages'], ['', 'Everything in Grow, plus:'],
            ['', 'Multi-language (ES/EN/PT)'], ['', 'ERP / HubSpot integration'],
            ['', 'A/B testing + analytics'], ['', 'Performance < 1 s · Lighthouse 95+'],
            ['Support', 'unlimited changes'],
          ] },
        ],
      },
      cta: 'Start with',
      ctaPro: 'Let\'s talk',
      currency: 'AR$',
    },
    customDev: {
      eyebrow: 'Nothing fits?',
      title: 'Custom software',
      titleEm: 'development',
      lead: 'If your business needs a particular system that isn\'t in our plans, we design and build it from scratch — with clear scope and a fixed quote.',
      points: [
        'Requirements analysis and personalized demo',
        'Detailed proposal and budget',
        'Iterative delivery through to production',
      ],
      cta: 'Request a quote',
      hint: 'Tell us what you need to build and we\'ll reply with a tailored estimate.',
    },
    faq: {
      eyebrow: '05 — Questions',
      num: 'Chapter 05',
      title: 'What we\'re',
      titleEm: 'always asked',
      items: [
        { q: 'How much does a project cost?', a: 'Depends on scope, but most start between USD 4K and USD 15K. We give a fixed quote after the discovery phase. No weird clauses.' },
        { q: 'Do you work on-site or remote?', a: 'Fully remote. Kickoff over video, iterate on WhatsApp, and we ship a running system wherever you are.' },
        { q: 'Who owns the code?', a: 'You do. Repo, credentials, hosting — all in your name. If you ever want to switch vendors, we hand you the keys.' },
        { q: 'Do you maintain it afterwards?', a: 'Yes, optional monthly plan from USD 350 with SLA. If you prefer another vendor or in-house team, we leave docs and transfer sessions.' },
        { q: 'Do you integrate with Mercado Pago?', a: 'Yes — already built and battle-tested. QR, discounts, auto-debit, the whole menu.' },
        { q: 'What if I need something not on the list?', a: 'We\'ve probably done it too. Write us what you need; if it\'s not our thing we recommend someone trustworthy.' },
      ],
    },
    contact: {
      eyebrow: '06 — Let\'s work together',
      num: 'Chapter 06',
      title: 'Message us',
      titleEm: 'on WhatsApp',
      lead: 'No forms: pick your plan and we open chat with a pre-filled message. We reply the same day.',
      waLead: 'Choose a product and plan in the Plans section, or message us directly on WhatsApp.',
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
      tagline: 'A remote consultancy for custom software.',
      cols: [
        {
          h: 'Site',
          links: [
            { label: 'Plans', href: '/#planes' },
            { label: 'Custom development', href: '/#desarrollo-a-medida' },
            { label: 'Process', href: '/#proceso' },
            { label: 'Work', href: '/#casos' },
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
      base: '© 2026 Código Norte Soluciones — Argentina',
      baseRight: 'Argentina · GMT‑3',
      wordmark: 'codigo norte.',
    },
  },
}
