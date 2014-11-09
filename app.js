var config = require('./config');
var Brain = require('./brain');

var bot = new Brain(config);

bot.cycle();