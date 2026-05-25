import fs from 'fs/promises'
import path from 'path'

const root = process.cwd()
const outDir = path.join(root, 'public', 'fonts')

const files = [
  ['node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2', 'bebas-neue-latin-400-normal.woff2'],
  ['node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', 'jetbrains-mono-latin-400-normal.woff2'],
  ['node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', 'jetbrains-mono-latin-500-normal.woff2'],
]

await fs.mkdir(outDir, { recursive: true })

for (const [srcRel, name] of files) {
  const src = path.join(root, srcRel)
  const dest = path.join(outDir, name)
  try {
    await fs.copyFile(src, dest)
    const kb = ((await fs.stat(dest)).size / 1024).toFixed(1)
    console.log(`fonts: ${name} (${kb}KB)`)
  } catch (err) {
    console.warn(`fonts: skip ${name} — ${err.message}`)
  }
}
