#!/usr/bin/env node

import { build } from 'esbuild'

export const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  outfile: 'public/js/app.js',
}

try {
  await build(buildOptions)
} catch (err) {
  console.error(err)
}
