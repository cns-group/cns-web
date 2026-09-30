import fs from 'fs/promises'
import path from 'path'
import { LANDINGS } from './landings.mjs'

const root = process.cwd()
const distDir = path.join(root, 'dist')

for (const { dir, route } of LANDINGS) {
  const src = path.join(root, dir)
  const dest = path.join(distDir, route)
  try {
    await fs.access(path.join(src, 'index.html'))
  } catch {
    console.warn(`landings: skip ${dir} (no index.html)`)
    continue
  }
  await fs.rm(dest, { recursive: true, force: true })
  await fs.cp(src, dest, {
    recursive: true,
    filter: (p) => !p.split(path.sep).includes('.git'),
  })
  console.log(`landings: ${dir} → dist/${route}/`)
}
