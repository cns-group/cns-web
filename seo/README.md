# SEO / GEO de Código Norte Soluciones

- `seo.config.mjs`: todos los datos (títulos, descripciones, textos de cada sistema, casos, pasos, contacto). **Es lo único que hay que tocar** para cambiar lo que ve Google.
- `vite-seo-plugin.mjs`: después de `vite build` genera `dist/<pagina>.html` (con título, descripción, canonical, Open Graph, JSON-LD y el contenido en HTML), `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` y `agents.txt`.
- `vercel.json` sirve `/ecommerce`, `/gimnasios`, `/turneros`, `/gastronomia`, `/clinica-medica` y `/pos` con su HTML prerenderizado. Si se suma una página, hay que agregarla en `SISTEMAS` y en los `rewrites`.
- `src/lib/seo.js` mantiene el título de la pestaña en sintonía con el sistema que se mira.
- `public/og-cover.jpg` (imagen al compartir) y `public/video-poster.jpg` (portada del video) salen de un cuadro de `HEROVIDEO.mp4`.

Si cambian los textos de la landing (pasos, beneficios, casos), actualizar también `PASOS`, `BENEFICIOS` y `CASOS` en `seo.config.mjs` para que el HTML prerenderizado diga lo mismo que la página.
