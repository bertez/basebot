var string = {
    // Refactored from http://stackoverflow.com/a/378001
    template: function(template, data) {
        if(data && typeof data === 'object') {
            return template.replace(/\{(\w*)\}/g, function(match, key) {
                if(match){
                    return data.hasOwnProperty(key) ? data[key] : match;
                }
            });
        } else {
            return template;
        }
    }
};

module.exports = string;