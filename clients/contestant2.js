'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io(`http://localhost:${process.env.PORT}/gameShow`);
const { prompt } = require('enquirer');
const Chance = require('chance');
const chance = new Chance();

console.log(process.env.PORT)

let contestantNum = 'contestant2';
let name = chance.name();

socket.emit('join', { name, contestantNum });
socket.on('successful-join', (payload) => console.log('So excited to be here Bob'));
socket.on('COME-ON-DOWN', () => {
  console.log('LET\S WIN SOME MONEY')
})

socket.on('brand-new-car', async (payload) => {
  let response = await prompt({
    type: 'input',
    name: 'Price of Car',
    message: `How much would you pay for a brand new ${payload.make}.`
  })

  response.contestantNum = contestantNum;
  response.name = name
  socket.emit('guess', response);

})

