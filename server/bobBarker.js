'use strict';

require('dotenv');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3006
const server = new Server();
const gameShow = server.of('/gameShow');


gameShow.on('connection', (socket) => {
  console.log('Welcome to the Price is Right contestant No.', socket);

  socket.on('join', room => {
    socket.join(room);
    console.log('successful join to the room', room);
    gameShow.to(room).emit('successful-join');
  })
})

const listen = () => {
  server.listen(PORT);
  console.log('listening on port:', PORT)
}

listen();