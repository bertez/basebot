var http = require('./helpers').request;
var parser = require('url');

/*
* Link interface (handles connections to the junkyard).
* @constructor
*/
var Link = function(config, key, debug) {

    // build API url
    this.api = parser.format({
        protocol: config.protocol,
        hostname: config.host,
        port: config.port,
        pathname:config.path
    });

    // store the api key
    this.key = key;

    // debug mode
    this.debug = debug;
};

Link.prototype = {
    /**
    * Calls the junkyard API to get random posts
    * @callback callback
    */
    getRandom: function(callback) {

        // build endpoint url
        var endpoint = this.api + 'posts/random';

        // return random data if debug mode is enabled
        if(this.debug) {
            return callback(require('./debug'), false);
        }

        return http.get(endpoint, callback);
    },
    /**
    * Makes a post
    * @param {Object} data - Data object
    * @callback callback
    */
    post: function(data, callback){
        var endpoint = this.api + 'posts';

        // return fake response if debug mode is enabled
        if(this.debug) {

            console.log('data sent to server', data);

            return callback({
                data: data,
                cooldown: 30000
            }, false);
        }

        // trow error if there is no data
        if(!data || typeof data !== 'object') {
            throw new Error('No data to send to server');
        }

        return http.post(endpoint, callback, data);
    }
};

module.exports = Link;