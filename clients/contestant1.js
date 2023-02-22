'use strict';

require('dotenv');
const { io } = require('socket.io-client');
const socket = io(`http://localhost:${process.env.PORT}/gameShow`);
const { prompt } = require('enquirer');
const Chance = require('chance');
const chance = new Chance();


socket.emit('join', chance.name());
socket.on('successful-join', console.log('So excited to be here Bob'));





async function getUsername() {
  let response =  await prompt({type: 'input', name: 'username', message: 'what is your username'});
  console.log(response.username);
  return response
}

getUsername();




