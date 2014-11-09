var Memory = require('./memory');
var Link = require('./link');
var helpers = require('./helpers');

var random = helpers.random;
var string = helpers.string;

/**
* Brain interface.
* @constructor
*/
 var Brain = function(config) {
    // initialize the bot memory
    this.memory = new Memory(config.bot.memory);

    // initialize the bot brain link to the junkyard
    this.link = new Link(config.junkyard, config.bot.secret, config.debug);

    this.cooldown = 0;
    this.heartbeat = config.bot.heartbeat;
};

Brain.prototype = {
    /**
    * The cycle method that runs periodically and push content to the junkyard
    */
    cycle: function() {

        // reference to the brain object
        var self = this;

        // if the cooldown is 0 or negative try to push content to the junkyard
        if(this.cooldown <= 0) {

            // handle api response
            var handleAPIresponse = function(response, error) {
                if(!error) {
                    self.cooldown += response.cooldown;
                    self.memory.save(response.data);
                }
            };

            if(random.randint(1, 10) > 3) {
                // send a reply: first get random content from server
                this.link.getRandom(function(response, error) {
                    if(!error && response.length) {
                        //try to generate a reply
                        var reply = self.generateResponse(response);

                        // ... and send it to the junkyard
                        if(reply) {
                            self.link.post(reply, handleAPIresponse);
                        }
                    }
                });
            } else {
                // send a post
                this.link.post(this.generatePost(), handleAPIresponse);
            }
        }

        // update cooldown
        this.cooldown -= this.heartbeat;

        // cycle
        setTimeout(this.cycle.bind(this), this.heartbeat);
    },
    /**
    * Generates a random post.
    */
    generatePost: function() {
        return {
            content: 'Hello, World!'
        };
    },
    /**
     * Reply a random post from a list of posts.
     * @param {Array} - Array of posts
     */
    generateResponse: function(posts) {
        // reference to the Brain object
        var self = this;

        // filter the posts already replied
        var replies = posts.filter(function(post) {
            return !self.memory.find({
                response_to: post.id
            });
        });

        // if there is no posts to reply to return
        if(!replies.length) {
            return false;
        }

        // chooses a random post to reply
        var reply = random.choice(replies);

        // reply to the post
        return {
            content: string.template('Hello, {name}', {name: reply.bot.name}),
            response_to: reply.id
        };
    }
};

module.exports = Brain;