// Número en formato internacional, sin "+" ni espacios (ej.: 5493515551234).
const WHATSAPP_NUMBER = '5493517648146';

const IS_LOCAL = /(^|\.)localhost$|^127\.0\.0\.1$/.test(location.hostname);
const API_BASE = IS_LOCAL
  ? 'http://127.0.0.1:3333/api'
  : 'https://kinectic-production.up.railway.app/api';

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('wa-float').href = waLink(
  'Hola, quiero consultar por el sistema de gestión para gimnasios.'
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

// Aparición al hacer scroll
(function () {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-anim');
  const sel = '.section__head, .card, .price-card, .feature-list li, .faq__list details, .member__grid > *, .contact__copy, .price-note';
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(sel).forEach((el) => {
    el.style.setProperty('--i', [...el.parentNode.children].indexOf(el) % 6);
    el.classList.add('rev');
    io.observe(el);
  });
})();

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
