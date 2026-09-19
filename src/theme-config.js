export const TWEAK_DEFAULTS = {
  palette:     ['#f7f9fc', '#0f172a', '#098eed', '#16a34a'],
  theme:       'light',
  density:     'regular',
  fontDisplay: 'system',
  lang:        'es',
  fontSize:    18,
}

export function applyTheme(t) {
  const root = document.documentElement
  const [, , ac, ac2] = t.palette

  root.dataset.theme = 'light'
  root.dataset.density = t.density

  root.style.setProperty('--bg', '#f7f9fc')
  root.style.setProperty('--surface', '#ffffff')
  root.style.setProperty('--surface-2', '#f1f5f9')
  root.style.setProperty('--line', '#e3e8ef')
  root.style.setProperty('--line-2', '#cbd5e1')
  root.style.setProperty('--fg', '#0f172a')
  root.style.setProperty('--fg-2', '#334155')
  root.style.setProperty('--muted', '#64748b')
  root.style.setProperty('--muted-2', '#94a3b8')
  root.style.setProperty('--accent', ac || '#098eed')
  root.style.setProperty('--accent-2', ac2 || '#16a34a')
  root.style.setProperty('--accent-hi', '#eef4ff')
  root.style.setProperty('--fs-body', `${t.fontSize}px`)
}
