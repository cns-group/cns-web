import React from 'react'
import { Reveal } from './reveal'
import { HERO_VIDEO } from './constants'
import './video.css'

const isEmbed = (src) => /youtube\.com\/embed|youtube-nocookie\.com\/embed|player\.vimeo\.com/i.test(src)

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

const Icon = {
  play: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>,
  pause: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>,
  sound: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>,
  mute: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" /><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>,
  full: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>,
}

function Player({ src, poster, title }) {
  const wrap = React.useRef(null)
  const video = React.useRef(null)
  const track = React.useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [dur, setDur] = React.useState(0)

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const seekTo = (clientX) => {
    const v = video.current
    const r = track.current?.getBoundingClientRect()
    if (!v || !r || !dur) return
    v.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * dur
  }

  const onScrub = (e) => {
    e.preventDefault()
    seekTo(e.clientX)
    const move = (ev) => seekTo(ev.clientX)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const fullscreen = () => {
    const el = wrap.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
  }

  const onKey = (e) => {
    if (e.target !== wrap.current) return
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle() }
    if (e.key === 'm') setMuted((m) => !m)
    if (e.key === 'f') fullscreen()
    if (e.key === 'ArrowRight' && video.current) video.current.currentTime += 5
    if (e.key === 'ArrowLeft' && video.current) video.current.currentTime -= 5
  }

  const pct = dur ? (time / dur) * 100 : 0

  return (
    <div
      ref={wrap}
      className={`vp${playing ? ' is-playing' : ''}${started ? ' is-started' : ''}`}
      tabIndex={0}
      role="group"
      aria-label={title}
      onKeyDown={onKey}
    >
      <video
        ref={video}
        src={src}
        poster={poster || undefined}
        playsInline
        preload="metadata"
        muted={muted}
        onClick={toggle}
        onPlay={() => { setPlaying(true); setStarted(true) }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />

      {!playing && (
        <button type="button" className="vp-big" onClick={toggle} aria-label="Reproducir video">
          <span>{Icon.play}</span>
          <em>{started ? 'Seguir viendo' : 'Mirá el video'}</em>
        </button>
      )}

      <div className="vp-bar">
        <button type="button" className="vp-btn" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          {playing ? Icon.pause : Icon.play}
        </button>
        <span className="vp-time">{fmt(time)}</span>
        <div
          className="vp-track"
          ref={track}
          onPointerDown={onScrub}
          role="slider"
          aria-label="Progreso"
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(time)}
        >
          <i style={{ width: `${pct}%` }} />
        </div>
        <span className="vp-time">{fmt(dur)}</span>
        <button type="button" className="vp-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {muted ? Icon.mute : Icon.sound}
        </button>
        <button type="button" className="vp-btn" onClick={fullscreen} aria-label="Pantalla completa">
          {Icon.full}
        </button>
      </div>
    </div>
  )
}

export function HeroVideo() {
  const { src, poster, title } = HERO_VIDEO
  if (!src && !import.meta.env.DEV) return null

  return (
    <Reveal as="div" className="video-frame hero-media" id="video">
        {!src ? (
          <div className="video-empty">
            <span className="video-play" aria-hidden="true">▶</span>
            <p>Acá va el video</p>
            <small>Se oculta solo hasta que se cargue en HERO_VIDEO.src</small>
          </div>
        ) : isEmbed(src) ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <Player src={src} poster={poster} title={title} />
        )}
    </Reveal>
  )
}
