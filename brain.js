var Memory = require('./memory');
var config = require('./config');
var random = require('./helpers/random');

/**
 * Brain interface.
 * @constructor
 */
 var Brain = function() {
    // initializes the bot memory
    this.memory = new Memory(config.bot.memory.storage, config.bot.memory.limit);
};

Brain.prototype = {
    actions: {
        /**
        * Generates a random post.
        */
        generatePost: function() {
            return 'Hello, World!';
        },
        /**
         * Reply a random post from a list of posts.
         * @param {Array} - Array of posts
         */
        generateResponse: function(posts) {
            // reference to the Brain object
            var self = this;

            // checks the posts that the bot already replied and discards them
            var replies = posts.filter(function(post) {
                !self.memory.find({
                    response_to: post.response_to
                });
            });

            // if there is no posts to reply to return
            if(!replies.length) {
                return false;
            }

            // chooses a random post to reply
            var reply = random.choice(replies);

            // reply to the post
            return 'Hello, World is a great response to ' + reply.content;
        }
    }
};

module.exports = Brain;