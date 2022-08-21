import fs from 'fs'
import path from 'path'
import { createSecureServer } from 'http2'

// Server options
const serverOptions = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost-cert.pem'),
}

// Request handler
const requestHandler = (req, res) => {
  const reqMethod = req.headers[':method']
  const reqPath = req.headers[':path']

  // Only allow GET method
  if (reqMethod !== 'GET') {
    res.writeHead(405, {
      'Content-Type': 'text/plain'
    })
    res.end('Method Not Allowed')
  }

  if (reqPath === '/sse') {
    // Server side events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    })
   } else {
    // Use request path to match filepath
    let filePath = path.join('public' + reqPath)

    // fix root path to index.html
    if (reqPath === '/') {
      filePath = path.join(filePath, 'index.html')
    }

    // Resolve content type from file path
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
    }

    const extname = path.extname(filePath).toLowerCase()

    const contentType = mimeTypes[extname] || 'application/octet-stream'

    // Serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // respond with not found
        if (err.code === 'ENOENT') {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          })
          res.end('Not Found')
        } else {
          // respond with internal error
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          })
          res.end('Internal Server Error')
        }
      } else {
        // respond with file
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': data.length,
        })
        res.end(data, 'utf-8')
      }
    })
  }
}

const server = createSecureServer(serverOptions, requestHandler)

export default server
