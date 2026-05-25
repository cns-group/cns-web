import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function toWebp(file, { maxWidth, quality = 78 }) {
  const src = path.join(publicDir, file)
  const base = file.replace(/\.[^.]+$/, '')
  const out = path.join(publicDir, `${base}.webp`)

  const hasSrc = await exists(src)
  const hasOut = await exists(out)

  if (!hasSrc) {
    if (hasOut) {
      console.log(`skip ${file} (source missing, ${base}.webp already present)`)
      return
    }
    console.warn(`warn: missing ${file} and ${base}.webp — add source PNG or commit the webp`)
    return
  }

  let img = sharp(src)
  const meta = await img.metadata()
  if (maxWidth && meta.width > maxWidth) {
    img = img.resize(maxWidth, null, { withoutEnlargement: true })
  }
  await img.webp({ quality, effort: 6 }).toFile(out)
  const srcSize = (await fs.stat(src)).size
  const outSize = (await fs.stat(out)).size
  console.log(`${file} → ${base}.webp (${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB)`)
}

async function resizePng(file, maxWidth) {
  const src = path.join(publicDir, file)
  if (!(await exists(src))) {
    console.log(`skip ${file} (not in public/)`)
    return
  }

  const srcSize = (await fs.stat(src)).size
  if (srcSize < 80 * 1024) {
    console.log(`skip ${file} (already small: ${(srcSize / 1024).toFixed(0)}KB)`)
    return
  }

  const out = path.join(publicDir, file.replace('.png', '-opt.png'))
  await sharp(src)
    .resize(maxWidth, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out)
  const outSize = (await fs.stat(out)).size
  await fs.rename(out, src)
  console.log(`${file} resized ≤${maxWidth}px (${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB)`)
}

await toWebp('bg.png', { maxWidth: 1920, quality: 72 })
await toWebp('cliente1.png', { maxWidth: 1200, quality: 80 })
await toWebp('cliente2.png', { maxWidth: 1200, quality: 80 })
await resizePng('cnslogo.png', 200)

console.log('Done.')
