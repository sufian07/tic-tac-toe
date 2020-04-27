const http = require('http')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const SocketIO = require('socket.io');
const db = require('../models');

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const getGame = async id => {
  if(!id) {
    throw "You should give an id";
  }
  return await db.Game.findOne({
    where: { id },
    attributes: [
      'id',
      'status',
      'name',
      'firstStepper',
      'currentStepper',
      'status',
      'field1',
      'field2',
      'field3',
      'field4',
      'field5',
      'field6',
      'field7',
      'field8',
      'field9',
    ]
  });
};

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

  io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join', async (user) => {
      console.log('New user :: ', user);
      if (user.challange) {
        const challange = await db.Game.findOne(
          { where: {name: user.challange}}
        );
        console.log('challange :: ', challange);
        if (challange && challange.id) {
          socket.join(challange.name);
          const game = await getGame(challange.id);
          console.log('gamer :: ', game);
          io.to(challange.name).emit('game', game.get({ plain: true }))
        }
      }
    })
    socket.on('make-challange', async (challange) => {
      const newGame = await db.Game.create({
        name: challange.name,
      })
      const game = await getGame(newGame.id);
      socket.join(challange.name);
      io.to(game.name).emit('game', game.get({ plain: true }));
    })
    socket.on('take-challange', async (challange) => {
      const oldGame = await db.Game.findOne({
        where: { name: challange.name },
        attributes: ['id', 'status']});
      if (oldGame && oldGame.id) {
        if (oldGame.status === 'pending') {
          const firstStepper = Math.random() < 0.5;
          await db.Game.update(
            { status: 'accepted', firstStepper, currentStepper: firstStepper},
            { where: { name: challange.name } }
          )
        }
        const game = await getGame(oldGame.id);
        socket.join(game.name);
        io.to(game.name).emit('game', game.get({ plain: true }));
      } else {
        socket.emit('game-not-exist');
      }
    })
    socket.on('resign-challange', async (challange) => {
      const oldGame = await db.Game.findOne({
        where: { name: challange.id }
      });
      if (oldGame && oldGame.id) {
        await db.Game.update(
          { status: 'resigned', },
          { where: { id: challange.id } }
        )
        const game = await getGame(challange.id);
        socket.emit('game', game.get({ plain: true }));
      }
    })
  })
}
start()
