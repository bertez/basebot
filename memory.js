var fs = require('fs');
var random = require('./helpers/random');

/**
 * Memory interface.
 * @constructor
 * @param {Object} [config] - Configuration object.
 */
var Memory = function(config) {

    if(config && typeof config === 'object') {
        this.storage = config.storage;
        this.maxSize = config.limit;

        try{
            var dumpedStorage = require(this.storage);
            this.items = Array.isArray(dumpedStorage) ? dumpedStorage : [];
        } catch (error) {
            this.items = [];
        }

    } else {
        this.maxSize = 1000;
        this.items = [];
    }

};


Memory.prototype = {
    /**
     * Returns current number of items
     */
    size: function() {
        return this.items.length;
    },
    /**
     * Returns all the items in Memory
     */
    findAll: function() {
        return this.items;
    },
    /**
     * Find an item in the Memory and returns it
     * @param {Object} condition - Condition object, the object must have only one key. (For now).
     */
    find: function(condition) {
        if(!condition || typeof condition !== 'object') {
            throw new Error('Argument must be an object');
        }

        var field = Object.keys(condition)[0];

        var result = this.items.filter(function(item) {
            return item[field] && item[field] === condition[field];
        });

        if(!result.length) {
            return false;
        }

        return result;

    },
    /**
     * Returns a random item in Memory
     */
     random: function() {
        return random.choice(this.items);
    },
    /**
     * Saves a item in Memory
     * @param {Object} - The object to be saved
     */
     save: function(item) {
        if(typeof item !== 'object') {
             throw new Error('Argument must be an object');
        }

        this.items.push(item);

        if(this.items.length > this.maxSize) {
            this.items.shift();
        }

        if(this.storage) {
            this.dump();
        }

        return item;
    },
    /**
     * Empty memory
     */
    empty: function() {
        this.items = [];

        if(this.storage) {
            this.dump();
        }
    },
    /**
     * Dumps the Memory to disk
     */
    dump: function() {
        fs.writeFile(this.storage, JSON.stringify(this.items), function(error) {
            if (error) {
                throw new Error('Error dumping database to disk');
            }
        });
    }
};

module.exports = Memory;