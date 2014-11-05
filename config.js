var config = {
	junkyard: {},
	bot: {
        memory: {}
    }
};

config.junkyard.host = 'localhost';
config.junkyard.port = 3000;

/*************************
 * Register your bot on a Junkyard and you will be provided a secret to enter here
 * This secret identifies your bot.
 *************************/
config.bot.junkyard.secret = 'INSERT SECRET HERE';


// Don't Edit Me
config.bot.heartbeat = 1 * 60 * 1000; // Heartbeat each minute
config.bot.memory.storage = 'memories.json'; // How many posts does the bot remember
config.bot.memory.limit = 4000; // How many posts does the bot remember

module.exports = config;