'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3006
const server = new Server();
const gameShow = server.of('/gameShow');
let brandNewCar = null;
let readyCount = 0;
let guessCount = 0;
let guess1 = 0;
let guess2 = 0;
let response1 = null;
let response2 = null;


server.on('connection', (socket) => {
  console.log('Socket connect to Event Server!', socket.id);
});

gameShow.on('connection', (socket) => {
  console.log('\nWelcome to the Price is Right contestant No.', socket.id);

  socket.on('join', room => {
    socket.join(room.contestantNum);
    console.log('successful join to the room', room.name);
    gameShow.to(room.contestantNum).emit('successful-join');
  });

  socket.on('ready', () => {
    const makes = ['Ford', 'Chevy', 'Toyota', 'Honda', 'Volkswagen', 'Hyundai', 'Kia']
    readyCount++;
    if (readyCount === 2) {
      readyCount = 0;
      brandNewCar = { make: makes[Math.floor(Math.random() * makes.length)], price: Math.floor(Math.random() * 10000) + 20000 }
      gameShow.emit('brand-new-car', brandNewCar)
    }
  })



  socket.on('guess', (response) => {
    guessCount++;
    if (response.contestantNum === 'contestant1') {
    guess1 = response['Price of Car']
    response1 = response
    } else { 
      guess2 = response['Price of Car'];
      response2 = response;
     }

     if (guessCount === 2) {
      let winner = closestButNotOver(guess1, guess2, brandNewCar.price)
      console.log('\n',guess1, guess2, winner, brandNewCar);
      if (winner === 'contestant1') {
        console.log(`\nCOME ON DOWN ${response1.name}`)
        gameShow.to(winner).emit('COME-ON-DOWN', 'you win');
      } else {
        console.log(`\nCOME ON DOWN ${response2.name}`)
        gameShow.to(winner).emit('COME-ON-DOWN', 'you win');
      } 
      guess1 = 0;
      guess2 = 0;
      guessCount = 0;
      response1 = null;
      response2 = null;
    
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

