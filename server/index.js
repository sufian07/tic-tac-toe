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

const gameHash = [
  '123', '456', '789',
  '147', '258', '369',
  '159', '357'
];

const updateOdds = async (id, odd1, odd2) => {
  const oldGame = await db.Game.findOne({
    where: { id },
  });
  if (oldGame && oldGame.id) {
    await db.Game.update(
      { odd1, odd2 },
      { where: { id } }
    )
  }
}

const calculateOdds = async game => {
  const firstUserHash = {};
  const secondUserHash = {};
  let score1 = 0;
  let score2 = 0;
  let totalStep = 0;

  for (let i = 1; i < 10; i++) {
    if(game[`field${i}`]) {
      totalStep++;
    }
    const hashKeys = gameHash.filter( key => key.includes(i))
    hashKeys.forEach(hashKey => {
      if(game[`field${i}`] == 'o') {
        firstUserHash[hashKey] = firstUserHash[hashKey] ? firstUserHash[hashKey]+1 : 1;
      }
      if(game[`field${i}`] == 'x') {
        secondUserHash[hashKey] = secondUserHash[hashKey] ? secondUserHash[hashKey]+1 : 1;
      }
    })
  }

  if(totalStep < 3) {
    return {
      odd1: 50,
      odd2: 50
    };
  }
  for (key in firstUserHash){
    if(firstUserHash[key] == 3) {
      return{
        odd1: 100,
        odd2: 0
      }
    }
    score1 += (firstUserHash[key] * firstUserHash[key]);
  }
  for (key in secondUserHash){
    if(secondUserHash[key] == 3) {
      return{
        odd1: 0,
        odd2: 100
      }
    }
    score2 += (secondUserHash[key] * secondUserHash[key]);
  }
  return{
    odd1: (100 * score1)/(score1 + score2),
    odd2: (100 * score2)/(score1 + score2)
  }
};

const getGame = async id => {
  if(!id) {
    throw "You should give an id";
  }
  const attributes = [
    'id',
    'status',
    'name',
    'firstStepper',
    'currentStepper',
    'odd1',
    'odd2',
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
  ];
  const game = await db.Game.findOne({
    where: { id },
    attributes,
  });
  return game;
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
    socket.on('join', async (user) => {
      if (user.challange) {
        const challange = await db.Game.findOne(
          { where: {name: user.challange}}
        );

        if (challange && challange.id) {
          socket.join(challange.name);
          const game = await getGame(challange.id);
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

    socket.on('step', async (data) => {
      const oldGame = await db.Game.findOne({
        where: { id: data.id },
        attributes: ['id', 'name', `field${data.cell}`, 'currentStepper'],
      });

      if(
        data.firstUser != oldGame.currentStepper
        || oldGame.odd1 == 100 || oldGame.odd2 == 100
      ) {
        return;
      }

      if (oldGame && oldGame.id && !oldGame[`field${data.cell}`]) {
        const update = {
          currentStepper: !oldGame.currentStepper,
        };
        update[`field${data.cell}`] = data.firstUser ? 'o' : 'x'
        await db.Game.update(
          update,
          { where: { id: oldGame.id } }
        )
        const {odd1, odd2} = await calculateOdds(await getGame(oldGame.id))

        await updateOdds(oldGame.id, odd1, odd2);
        const game = await getGame(oldGame.id);
        io.to(oldGame.name).emit('game', game.get({ plain: true }));
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
