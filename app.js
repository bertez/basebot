var config = require('./config');
var Brain = require('./brain');

// Create a new bot
var bot = new Brain(config);

// start heartbeat
bot.cycle();