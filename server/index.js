const http = require('http')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const SocketIO = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  const messages = []
  io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('last-messages', function (fn) {
      fn(messages.slice(-50))
    })
    // socket.on('send-message', function (message) {
    //   console.log('New message :: ', message);
    //   messages.push(message)
    //   socket.broadcast.emit('new-message', message)
    // })
    socket.on('join', function (user) {
      console.log('New user :: ', user);
      socket.broadcast.emit('user-joined', user)
      //io.emit('user-joined', user)
    })
  })
}
start()
