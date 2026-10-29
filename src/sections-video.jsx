import React from 'react'
import { Reveal } from './reveal'
import { HERO_VIDEO } from './constants'
import './video.css'

const isEmbed = (src) => /youtube\.com\/embed|youtube-nocookie\.com\/embed|player\.vimeo\.com/i.test(src)

export function VideoSection() {
  const { src, poster, title } = HERO_VIDEO
  if (!src && !import.meta.env.DEV) return null

  return (
    <section className="sec video-sec" id="video" aria-label={title}>
      <Reveal as="div" className="video-frame">
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
          <video src={src} poster={poster || undefined} controls playsInline preload="metadata" />
        )}
      </Reveal>
    </section>
  )
}
