export const TWEAK_DEFAULTS = {
  palette:     ['#0e0e0c', '#f5f1e8', '#d97757', '#7a8f5c'],
  theme:       'dark',
  density:     'regular',
  fontDisplay: 'Bebas Neue',
  lang:        'es',
  fontSize:    15.5,
}

export function applyTheme(t) {
  const root = document.documentElement
  const [bg, fg, ac, ac2] = t.palette
  const isLight = (() => {
    const h = bg.replace('#', '')
    const x = h.length === 3 ? h.replace(/./g, c => c + c) : h
    const n = parseInt(x, 16)
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
    return (r + g + b) / 3 > 128
  })()
  root.dataset.theme = isLight ? 'light' : 'dark'
  root.dataset.density = t.density
  root.style.setProperty('--bg', bg)
  root.style.setProperty('--fg', fg)
  root.style.setProperty('--accent', ac)
  root.style.setProperty('--accent-2', ac2)
  root.style.setProperty('--f-display', `'${t.fontDisplay}', 'Bebas Neue', 'Bebas Neue Fallback', ui-sans-serif, system-ui, sans-serif`)
  root.style.setProperty('--fs-body', `${t.fontSize}px`)

  const off = (hex, d) => {
    const h = hex.replace('#', '')
    const x = h.length === 3 ? h.replace(/./g, c => c + c) : h
    const n = parseInt(x, 16)
    let r = ((n >> 16) & 255) + d, g = ((n >> 8) & 255) + d, b = (n & 255) + d
    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  }
  const sign = isLight ? -1 : 1
  root.style.setProperty('--surface',   off(bg, 8 * sign))
  root.style.setProperty('--surface-2', off(bg, 14 * sign))
  root.style.setProperty('--line',      off(bg, 20 * sign))
  root.style.setProperty('--line-2',    off(bg, 32 * sign))
  root.style.setProperty('--fg-2',      off(fg, -24 * sign))
  root.style.setProperty('--muted',     off(fg, -72 * sign))
  root.style.setProperty('--muted-2',   off(fg, -100 * sign))
}
