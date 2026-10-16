export const TWEAK_DEFAULTS = {
  palette:     ['#000000', '#f2f7fb', '#0e82ec', '#0e82ec'],
  theme:       'dark',
  density:     'regular',
  fontDisplay: 'system',
  lang:        'es',
  fontSize:    18,
}

export function applyTheme(t) {
  const root = document.documentElement
  const [, , ac, ac2] = t.palette

  root.dataset.theme = 'dark'
  root.dataset.density = t.density

  root.style.setProperty('--bg', '#000000')
  root.style.setProperty('--surface', '#080b0d')
  root.style.setProperty('--surface-2', '#0d1216')
  root.style.setProperty('--line', '#20282e')
  root.style.setProperty('--line-2', '#34414a')
  root.style.setProperty('--fg', '#f2f7fb')
  root.style.setProperty('--fg-2', '#c4d0d8')
  root.style.setProperty('--muted', '#aebbc4')
  root.style.setProperty('--muted-2', '#8d9ba5')
  root.style.setProperty('--accent', ac || '#0e82ec')
  root.style.setProperty('--accent-deep', '#0a67bd')
  root.style.setProperty('--accent-2', ac2 || '#0e82ec')
  root.style.setProperty('--accent-hi', '#082635')
  root.style.setProperty('--fs-body', `${t.fontSize}px`)
}
