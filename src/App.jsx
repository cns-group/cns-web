import React from 'react'
import { COPY } from './copy'
import {
  useTweaks, TweaksPanel, TweakSection,
  TweakColor, TweakSelect, TweakSlider, TweakRadio,
} from './tweaks-panel'
import { Nav, Hero, Marquee } from './sections-top'
import { Services, Process } from './sections-mid'
import { Plans } from './sections-plans'
import { Work, Stack, Quotes, Metrics, FAQ, Contact, Footer } from './sections-bot'

const TWEAK_DEFAULTS = {
  "palette":     ["#0e0e0c", "#f5f1e8", "#d97757", "#7a8f5c"],
  "theme":       "dark",
  "density":     "regular",
  "fontDisplay": "Bebas Neue",
  "lang":        "es",
  "fontSize":    15.5,
}

const PALETTES = [
  ["#0e0e0c", "#f5f1e8", "#d97757", "#7a8f5c"],
  ["#f6f4ef", "#1a1916", "#d97757", "#7a8f5c"],
  ["#0a0e0a", "#e8ffd8", "#7dff9a", "#a39d8f"],
  ["#0a0a0a", "#fafafa", "#ff5733", "#3d7dff"],
  ["#1a1f2e", "#e8d5b7", "#c97064", "#6b8e9f"],
]

const DISPLAY_FONTS = ['Bebas Neue', 'Bricolage Grotesque', 'Instrument Serif']

function applyTheme(t) {
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
  root.style.setProperty('--f-display', `'${t.fontDisplay}', 'Bebas Neue', 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif`)
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
  root.style.setProperty('--muted',     off(fg, -88 * sign))
  root.style.setProperty('--muted-2',   off(fg, -120 * sign))
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const c = COPY[t.lang] || COPY.es
  const contactRef = React.useRef(null)

  React.useEffect(() => { applyTheme(t) }, [t])

  const scrollToContact = React.useCallback(() => {
    const el = contactRef.current
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 60,
      behavior: 'smooth',
    })
    el.querySelector('input, select, textarea')?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="app">
      <Nav c={c} onContact={scrollToContact} />
      <Hero c={c} lang={t.lang} onContact={scrollToContact} />
      <Marquee items={c.marquee} />
      <Services c={c} />
      <Plans c={c} lang={t.lang} />
      <Process c={c} />
      <Metrics c={c} />
      <Work c={c} />
      <Stack c={c} />
      <Quotes c={c} />
      <FAQ c={c} />
      <Contact c={c} ctaRef={contactRef} />
      <Footer c={c} />

      <TweaksPanel title="Tweaks · Código Norte">
        <TweakSection label="Palette" />
        <TweakColor
          label="Theme"
          value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak('palette', v)}
        />

        <TweakSection label="Typography" />
        <TweakSelect
          label="Display font"
          value={t.fontDisplay}
          options={DISPLAY_FONTS}
          onChange={(v) => setTweak('fontDisplay', v)}
        />
        <TweakSlider
          label="Base size"
          value={t.fontSize}
          min={13} max={18} step={0.5} unit="px"
          onChange={(v) => setTweak('fontSize', v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Content" />
        <TweakRadio
          label="Language"
          value={t.lang}
          options={[{ value: 'es', label: 'ES' }, { value: 'en', label: 'EN' }]}
          onChange={(v) => setTweak('lang', v)}
        />
      </TweaksPanel>
    </div>
  )
}
