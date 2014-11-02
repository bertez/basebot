var parser = require('url');

var requests = {
    // 30 seconds timeout
    timeout: 30000,
    // main method
    request: function(url, callback, postData, extraHeaders) {
        var parsedURL;
        var options;

        // reference to the module
        var self = this;

        // stringity the postData if its format is JSON
        if(postData && typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }

        // try to parse the url using the nodejs url module
        try {
            parsedURL = parser.parse(url);
        } catch(err) {
            callback(null, 'Malformed URL');
        }

        // set available protocols and also define default ports and network module handlers
        var availableProtocols = {
            'https:': {
                port: 443,
                handler: 'https'
            },
            'http:': {
                port: 80,
                handler: 'http'
            }
        };

        // check if the request is http or https
        if(Object.keys(availableProtocols).indexOf(parsedURL.protocol) > 0) {

            // set up the request options
            options = {
                hostname: parsedURL.hostname,
                port: parsedURL.port ? parsedURL.port : availableProtocols[parsedURL.protocol].port,
                path: parsedURL.pathname,
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
            var currentRequest = require(availableProtocols[parsedURL.protocol].handler).request(options, function(response){
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
                        // the status code was OK, so execute the callback and return
                        return callback && callback(buffer, null, response.headers);
                    } else if (response.statusCode === 301 || response.statusCode === 302) {
                        // handle redirects
                        process.nextTick(function(){
                            self.request(response.headers.location, callback, postData, extraHeaders);
                        });
                    } else {
                        // status code not recognized
                        return callback && callback('Response: ' + response.statusCode + '. Buffer: ' + buffer);
                    }
                });
            });

            // called when the request is initialized
            currentRequest.on('socket', function (socket) {
                socket.setTimeout(self.timeout);

                // handle the connection timeout
                socket.on('timeout', function() {
                    currentRequest.abort();
                });
            });

            // called on request error
            currentRequest.on('error', function(error){
                return callback && callback(null, error);
            });

            // send the post data if needed
            if(postData) {
                currentRequest.write(postData);
            }

            //end the request
            currentRequest.end();

        } else {
            // protocol not http or https
            callback(null, 'Protocol not supported');
        }

    },
    //aliases
    get: function(url, callback, extraHeaders) {
        return this.request(url, callback, null, extraHeaders);
    },
    post: function(url, callback, postData, extraHeaders) {
        return this.request(url, callback, postData, extraHeaders);
    }
};

requests.post('http://localhost:4000/api/endpoint', function(response, error, responseHeaders) {
    !error && console.log(response);
}, {penes:'pardos'});

// module.exports = requests;