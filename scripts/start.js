#!/usr/bin/env node

import fs from 'fs'
import { build, transform } from 'esbuild'
import { buildOptions } from './build.js'
import server from './lib/server.js'

const { PORT = 8000 } = process.env
let clients = []

try {
  // minify the client side code
  const { code: jsBannerCode } = await transform(fs.readFileSync('./scripts/lib/client.js'), {
    minify: true,
  })

  // run the build
  await build({
    ...buildOptions,
    sourcemap: 'inline',
    minify: false,
    banner: {
      js: jsBannerCode,
    },
    watch: {
      onRebuild(err) {
        if (err) console.error(err.message)

        console.log(`esbuild rebuild, refreshing clients...`)

        // Loop over each connection to trigger refresh
        if (clients.length > 0) {
          clients.forEach((stream) => {
            stream.end('data: refresh\n\n')
            stream.destroy()
          })

          // clear list of clients
          clients = []
        }
      }
    },
  })

  // Handle server error
  server.on('error', (err) => {
    throw err
  })

  // Listen for server side event and push stream to client list
  server.on('stream', (stream, headers) => {
    if (headers[':path'] === '/sse') {
      clients.push(stream)
    }
  })

  // Run Server
  server.listen(PORT, () => {
    console.log(`Running esbuild server on https://localhost:${PORT}`)
  })


} catch (err) {
  console.error(err)
}
