'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3006
const server = new Server();
const gameShow = server.of('/gameShow');
let brandNewCar = null;

console.log('welcome home');



server.on('connection', (socket) => {
  console.log('Socket connect to Event Server!', socket.id);
});

gameShow.on('connection', (socket) => {
  console.log('Welcome to the Price is Right contestant No.', socket.id);

  socket.on('join', room => {
    socket.join(room.contestantNum);
    console.log('successful join to the room', room.name);
    gameShow.to(room.contestantNum).emit('successful-join');
  });

  setInterval(() => {
    brandNewCar = { make: 'Ford', price: Math.floor(Math.random() * 10000) + 20000 }
    gameShow.emit('brand-new-car', brandNewCar)
  }, 10000);


  socket.on('guess', (response) => {
    let guess1 = 0;
    let guess2 = 0;
    let response1 = null;
    let response2 = null;
    if (response.contestantNum === 'contestant1') {
    guess1 = response['Price of Car']
    response1 = response
    } else { 
      guess2 = response['Price of Car'];
      response2 = response;
     }
    let winner = closestButNotOver(guess1, guess2, brandNewCar.price)
    console.log(guess1, guess2, winner, brandNewCar);
    if (winner === 'contestant1') {
    } else {
      console.log(`COME ON DOWN ${response2.name}`)
      gameShow.to(winner).emit('COME-ON-DOWN', 'you win');
    }

  })
})


const listen = () => {
  server.listen(PORT);
  console.log('listening on port:', PORT)
}

listen();





function closestButNotOver(guess1, guess2, priceOfCar) {
  if (guess1 > priceOfCar && guess2 > priceOfCar) {
    let difference1 = guess1 - priceOfCar;
    let difference2 = guess2 - priceOfCar;
    let winner = Math.min(difference1, difference2);
    return winner === difference1 ? 'contestant1' : 'contestant2';
  } else if ( guess1 > priceOfCar) {
    return 'contestant2'
  } else if(guess2 > priceOfCar) {
    return 'contestant1'
  } else {
    let difference1 = priceOfCar - guess1;
    let difference2 = priceOfCar - guess2;
    let winner = Math.min(difference1, difference2);
    return winner === difference1 ? 'contestant1' : 'contestant2';
  }
}

