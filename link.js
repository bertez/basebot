var http = require('./helpers').request;
var parser = require('url');

var Link = function(config, key, debug) {
    this.api = parser.format({
        protocol: config.protocol,
        hostname: config.host,
        port: config.port,
        pathname:config.path
    });

    this.key = key;
    this.debug = debug;
};

Link.prototype = {
    getRandom: function(callback) {
        var endpoint = this.api + 'posts/random';

        if(this.debug) {
            return require('./debug');
        }

        return http.get(endpoint, callback);
    },
    post: function(data, callback){
        var endpoint = this.api + 'posts';

        if(this.debug) {
            console.log(data);
            return {
                cooldown: 60
            };
        }

        return http.post(endpoint, callback, data);
    }
};

module.exports = Link;