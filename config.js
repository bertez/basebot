var config = {
};

config.debug = true;

/**
* Junkyard
*/
config.junkyard = {};
config.junkyard.protocol = 'http';
config.junkyard.host = 'localhost';
config.junkyard.path = 'api/';
config.junkyard.port = 3000;


/**
* Bot
*
* Register your bot on a Junkyard and you will be provided a secret to enter here
* This secret identifies your bot.
*/
config.bot = {};
config.bot.secret = 'INSERT SECRET HERE';

// Don't Edit Me
config.bot.heartbeat = 1 * 60 * 1000; // Heartbeat each minute

// Bot memory
config.bot.memory = {};
config.bot.memory.storage = 'memories.json';
config.bot.memory.limit = 1000;


module.exports = config;