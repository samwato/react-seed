#!/usr/bin/env node

import { serve } from 'esbuild'
import { buildOptions } from './build.js'
const { PORT = 8000 } = process.env

const serveOptions = {
  servedir: 'public',
  port: PORT,
}

try {
  await serve(serveOptions, {
    ...buildOptions,
    sourcemap: 'inline',
    minify: false,
  })
  console.log(`Running esbuild server on http://localhost:${PORT}`)

} catch (err) {
  console.error(err)
}
