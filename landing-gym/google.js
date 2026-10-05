// Login con Google centralizado: Google solo permite orígenes registrados (sin comodines), así que
// todos los gimnasios ({slug}.codigonortesoluciones.com) pasan por esta página para obtener la credencial.
const GOOGLE_CLIENT_ID = '243716831027-0kglb6tlbljbtqtmde3g7bl0joqt9b5m.apps.googleusercontent.com';

const IS_LOCAL = /(^|\.)localhost$|^127\.0\.0\.1$/.test(location.hostname);
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/;

const params = new URLSearchParams(location.search);
const slug = String(params.get('gym') || '').toLowerCase();

const msg = document.getElementById('gauth-msg');
const back = document.getElementById('gauth-back');

// El destino se arma solo a partir del slug: nunca se acepta una URL de retorno arbitraria,
// porque la credencial de Google viaja en ella.
function gymBase(s) {
  return IS_LOCAL ? `http://${s}.localhost:3000` : `https://${s}.codigonortesoluciones.com`;
}

function fail(text) {
  msg.textContent = text;
  msg.classList.add('gauth__error');
}

function onCredential(response) {
  if (!response || !response.credential) {
    fail('No pudimos obtener tu cuenta de Google. Probá de nuevo.');
    return;
  }
  location.replace(`${gymBase(slug)}/ingresar#google_credential=${encodeURIComponent(response.credential)}`);
}

function init() {
  if (!SLUG_REGEX.test(slug)) {
    fail('Falta el gimnasio al que querés ingresar. Volvé a la página de tu gimnasio y tocá “Continuar con Google”.');
    return;
  }
  back.href = `${gymBase(slug)}/ingresar`;
  if (!window.google || !google.accounts || !google.accounts.id) {
    setTimeout(init, 150);
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: onCredential,
    ux_mode: 'popup',
    auto_select: false,
  });
  google.accounts.id.renderButton(document.getElementById('gauth-button'), {
    theme: 'filled_black',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    locale: 'es',
    width: 320,
  });
}

init();
