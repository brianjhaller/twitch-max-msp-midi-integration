const tmi = require('tmi.js');
const maxApi = require("max-api");
require('dotenv').config();

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME_1
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// console.log(process.env.BOT_USERNAME, process.env.OAUTH_TOKEN, process.env.CHANNEL_NAME_1)

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

let rotateState = 0;

// Called every time a message comes in
async function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const parsedMsg = msg.trim().split(" ");
  const commandName = parsedMsg[0];
  const restOfArgs = parsedMsg.filter((msg, i) => i !== 0);
  console.log("commandName:", msg, self);

  // If the command is known, let's execute it

  switch (commandName) {

    case '!dice':
      console.log(msg)
      const num = rollDice();
      maxApi.outlet("handler", `received number: ${num}`);
      client.say(target, `You rolled a ${num}`);
      console.log(`* Executed ${commandName} command with ${num}`);
      break;
    case '!motor':
      rotateState = rotateState ? 0 : 1;
      maxApi.outlet("handler", `bang`);
      client.say(target, `You turned the motor ${rotateState ? 'clockwise' : 'counter-clockwise'}`);
      console.log(`* Executed ${commandName} command`);
      break;
    case '!melody':
      maxApi.outlet("handler", ['melodyStart', ...restOfArgs.map(num => isNaN(Number(num)) ? null : Number(num)), 'melodyEnd']);
      client.say(target, `Your melody is ${restOfArgs.join(" ")}`);
      console.log(`* Executed ${commandName} command`);
      break;
    default:
      client.say(target, `Command not recognized.`);
      break;
  }
}
// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}