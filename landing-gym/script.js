// Número en formato internacional, sin "+" ni espacios (ej.: 5493515551234).
const WHATSAPP_NUMBER = '5490000000000';

const IS_LOCAL = /(^|\.)localhost$|^127\.0\.0\.1$/.test(location.hostname);
const API_BASE = IS_LOCAL
  ? 'http://127.0.0.1:3333/api'
  : 'https://kinectic-production.up.railway.app/api';

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('wa-direct').href = waLink(
  'Hola, quiero conocer el sistema de gestión para gimnasios.'
);

// Tabs de módulos
const tabs = Array.from(document.querySelectorAll('.tab[role="tab"]'));

function selectTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next;
    if (e.key in keys) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    selectTab(next);
    next.focus();
  });
});

// Formulario de contacto
const form = document.getElementById('contact-form');
const formError = document.getElementById('form-error');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const name = data.name.trim();
  const gym = data.gym.trim();

  const fields = form.elements;
  fields.name.toggleAttribute('aria-invalid', !name);
  fields.gym.toggleAttribute('aria-invalid', !gym);
  if (!name || !gym) {
    formError.hidden = false;
    (name ? fields.gym : fields.name).focus();
    return;
  }
  formError.hidden = true;

  const lines = [
    `Hola, soy ${name} de ${gym}${data.city.trim() ? ` (${data.city.trim()})` : ''}.`,
    'Quiero ver una demo del sistema de gestión para gimnasios.',
  ];
  if (data.size) lines.push(`Socios activos: ${data.size}.`);
  if (data.message.trim()) lines.push(data.message.trim());

  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

// Precios por forma de pago
const MONTHLY_PRICE = 80000;
const BILLING = {
  monthly: { title: 'Servicio mensual', months: 1, discount: 0 },
  semester: { title: 'Servicio semestral', months: 6, discount: 0.1 },
  annual: { title: 'Servicio anual', months: 12, discount: 0.2 },
};
const money = (n) => `$${Math.round(n).toLocaleString('es-AR')}`;

document.querySelectorAll('.billing__opt').forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = BILLING[btn.dataset.billing];
    document.querySelectorAll('.billing__opt').forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    const perMonth = MONTHLY_PRICE * (1 - plan.discount);
    const total = perMonth * plan.months;
    const saving = MONTHLY_PRICE * plan.months - total;
    document.getElementById('price-title').textContent = plan.title;
    document.getElementById('price-amount').textContent = money(perMonth);
    document.getElementById('price-period').textContent =
      plan.months === 1 ? 'Por mes' : `Por mes · ${money(total)} cada ${plan.months === 12 ? 'año' : '6 meses'}`;
    const savingEl = document.getElementById('price-saving');
    savingEl.hidden = !saving;
    savingEl.textContent = saving ? `Ahorrás ${money(saving)} frente al pago mensual` : '';
  });
});

// Registro de gimnasio
async function platform(method, path, body) {
  const res = await fetch(`${API_BASE}/platform${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg || 'No pudimos procesar la solicitud. Probá de nuevo.');
  }
  return data;
}

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);

const signupForm = document.getElementById('signup-form');
const sentBox = document.getElementById('signup-sent');
const slugInput = document.getElementById('s-slug');
const slugStatus = document.getElementById('s-slug-status');
const signupError = document.getElementById('signup-error');
const sentError = document.getElementById('signup-sent-error');
const sentInfo = document.getElementById('signup-sent-info');

let slugTouched = false;
let slugOk = false;
let slugTimer = 0;
let slugSeq = 0;
let requestId = '';

platform('GET', '/config')
  .then((cfg) => {
    if (!cfg.rootDomain) return;
    document.getElementById('s-domain').textContent = `.${cfg.rootDomain}`;
    document.getElementById('signup-domain-example').textContent = `tugimnasio.${cfg.rootDomain}`;
  })
  .catch(() => {});

function showStep(step) {
  [signupForm, sentBox].forEach((el) => {
    el.hidden = el !== step;
  });
}

function setSlugStatus(text, kind) {
  slugStatus.textContent = text;
  slugStatus.className = `signup__status${kind ? ` is-${kind}` : ''}`;
}

function checkSlug() {
  const slug = slugInput.value;
  slugOk = false;
  clearTimeout(slugTimer);
  if (!slug) return setSlugStatus('', '');
  setSlugStatus('Verificando…', '');
  const seq = ++slugSeq;
  slugTimer = setTimeout(async () => {
    try {
      const r = await platform('GET', `/slug-available?slug=${encodeURIComponent(slug)}`);
      if (seq !== slugSeq) return;
      slugOk = r.available;
      setSlugStatus(r.available ? 'Disponible' : r.reason || 'No disponible', r.available ? 'ok' : 'bad');
    } catch (err) {
      if (seq === slugSeq) setSlugStatus(err.message, 'bad');
    }
  }, 350);
}

signupForm.elements.gymName.addEventListener('input', (e) => {
  if (slugTouched) return;
  slugInput.value = slugify(e.target.value);
  checkSlug();
});

slugInput.addEventListener('input', () => {
  slugTouched = true;
  slugInput.value = slugify(slugInput.value);
  checkSlug();
});

function showError(el, message) {
  el.textContent = message;
  el.hidden = !message;
}

async function withBusy(form, fn) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    await fn();
  } finally {
    btn.disabled = false;
  }
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(signupForm));
  const missing =
    data.gymName.trim().length < 2 ||
    data.ownerName.trim().length < 2 ||
    data.address.trim().length < 4 ||
    !data.email.includes('@');
  if (missing) return showError(signupError, 'Completá todos los datos para continuar.');
  if (!slugOk) return showError(signupError, 'Elegí una dirección web disponible.');
  showError(signupError, '');

  withBusy(signupForm, async () => {
    try {
      const r = await platform('POST', '/signup', data);
      requestId = r.requestId;
      document.getElementById('signup-email-sent').textContent = r.email;
      showError(sentError, '');
      sentInfo.hidden = true;
      showStep(sentBox);
    } catch (err) {
      showError(signupError, err.message);
    }
  });
});

document.getElementById('signup-resend').addEventListener('click', async () => {
  showError(sentError, '');
  sentInfo.hidden = true;
  try {
    await platform('POST', '/signup/resend', { requestId });
    sentInfo.textContent = 'Te enviamos el correo de nuevo.';
    sentInfo.hidden = false;
  } catch (err) {
    showError(sentError, err.message);
  }
});

document.getElementById('signup-back').addEventListener('click', () => showStep(signupForm));
