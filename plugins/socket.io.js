const io = require('socket.io-client');
const socket = io(process.env.WS_URL)

export default socket
