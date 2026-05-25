import sharp from 'sharp'
import { readdir } from 'fs/promises'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')

async function toWebp(file, { maxWidth, quality = 78 }) {
  const src = path.join(publicDir, file)
  const base = file.replace(/\.[^.]+$/, '')
  const out = path.join(publicDir, `${base}.webp`)
  let img = sharp(src)
  const meta = await img.metadata()
  if (maxWidth && meta.width > maxWidth) {
    img = img.resize(maxWidth, null, { withoutEnlargement: true })
  }
  await img.webp({ quality, effort: 6 }).toFile(out)
  const { size: srcSize } = await import('fs').then(fs => fs.promises.stat(src))
  const { size: outSize } = await import('fs').then(fs => fs.promises.stat(out))
  console.log(`${file} → ${base}.webp (${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB)`)
}

async function resizePng(file, maxWidth) {
  const src = path.join(publicDir, file)
  const out = path.join(publicDir, file.replace('.png', '-opt.png'))
  await sharp(src)
    .resize(maxWidth, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out)
  const fs = await import('fs')
  const srcSize = (await fs.promises.stat(src)).size
  const outSize = (await fs.promises.stat(out)).size
  await fs.promises.rename(out, src)
  console.log(`${file} resized ≤${maxWidth}px (${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB)`)
}

await toWebp('bg.png', { maxWidth: 1920, quality: 72 })
await toWebp('cliente1.png', { maxWidth: 1200, quality: 80 })
await toWebp('cliente2.png', { maxWidth: 1200, quality: 80 })
await resizePng('cnslogo.png', 200)

console.log('Done.')
