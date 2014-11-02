var parser = require('url');

var requests = {
    // 30 seconds timeout
    timeout: 30000,
    // set available protocols and also define default ports and network module handlers
    availableProtocols : {
            'https:': {
                port: 443,
                handler: 'https'
            },
            'http:': {
                port: 80,
                handler: 'http'
            }
    },
    /**
     * Makes a generic http request
     * @param {String} url
     * @callback callback
     * @param {Object|String} postData
     * @param {Object} extraHeaders
     */
    request: function(url, callback, postData, extraHeaders) {
        var parsedURL;
        var options;

        // reference to the module
        var self = this;

        // try to parse the url using the nodejs url module
        try {
            parsedURL = parser.parse(url);
        } catch(err) {
            callback(null, 'Error: Malformed URL');
        }

        // check if the request is http or https
        if(Object.keys(self.availableProtocols).indexOf(parsedURL.protocol) > -1) {

            // set up the request options
            options = {
                hostname: parsedURL.hostname,
                port: parsedURL.port ? parsedURL.port : self.availableProtocols[parsedURL.protocol].port,
                path: parsedURL.path,
                method: postData ? 'POST' : 'GET',
                headers: {
                    Host: parsedURL.hostname,
                    Connection: "keep-alive",
                }
            };

            // if the is post data add the content length header
            if(postData) {
                options.headers["Content-Type"] = 'application/json';
                options.headers["Content-Length"] = Buffer.byteLength(postData);
            }

            // add extra headers to the request options object if needed
            if(extraHeaders) {
                for(var key in extraHeaders) {
                    if (extraHeaders.hasOwnProperty(key)) {
                        options.headers[key] = extraHeaders[key];
                    }
                }
            }

            // make the request
            var currentRequest = require(self.availableProtocols[parsedURL.protocol].handler).request(options, function(response){
                var buffer = '';
                response.setEncoding('utf-8');

                // called when the request receives data
                response.on('data', function(part){
                    if (part && part.length > 0){
                        // add data to the buffer
                        buffer += part;
                    }
                });

                // called when the request ends
                response.on('end', function() {
                    if(response.statusCode === 200) {
                        // the status code was OK, so execute the callback
                        callback && callback(buffer, null, response.headers);
                    } else if (response.statusCode === 301 || response.statusCode === 302) {
                        // handle redirects
                        process.nextTick(function(){
                            self.request(response.headers.location, callback, postData, extraHeaders);
                        });
                    } else {
                        // status code not recognized
                        callback && callback('Response: ' + response.statusCode + '. Buffer: ' + (buffer.trim() ? buffer : '(empty)'));
                    }
                });
            });

            // called when the request is initialized
            currentRequest.on('socket', function (socket) {
                socket.setTimeout(self.timeout);

                // handle the connection timeout
                socket.on('timeout', function() {
                    currentRequest.abort();
                    callback && callback(null, 'Request timeout');
                });
            });

            // called on request error
            currentRequest.on('error', function(error){
                callback && callback(null, String(error));
            });

            // send the post data if needed
            if(postData) {
                currentRequest.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
            }

            //end the request
            currentRequest.end();

        } else {
            // protocol not http or https
           callback(null, 'Error: Protocol not supported');
        }

    },
    /**
     * Makes a GET http request
     * @param {String} url
     * @callback callback
     * @param {Object} extraHeaders
     */
    get: function(url, callback, extraHeaders) {
        return this.request(url, callback, null, extraHeaders);
    },
    /**
     * Makes a POST http request
     * @param {String} url
     * @callback callback
     * @param {Object|String} postData
     * @param {Object} extraHeaders
     */
    post: function(url, callback, postData, extraHeaders) {
        return this.request(url, callback, postData, extraHeaders);
    }
};

//DEBUG
requests.get('http://api.lyricsnmusic.com/songs?api_key=317121f1558b9cd1e6ef820da39f9e&artist=coulton', function(response, error, responseHeaders) {
    error && console.log(error);
    !error && console.log(response);
});

module.exports = requests;