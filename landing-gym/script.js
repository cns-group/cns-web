// Número en formato internacional, sin "+" ni espacios (ej.: 5493515551234).
const WHATSAPP_NUMBER = '5490000000000';

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
