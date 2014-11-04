var fs = require('fs');
var random = require('./helpers/random');

/**
 * Memory interface.
 * @constructor
 * @param {String} [storage] - Path to the Memory disk storage, should be a JSON file.
 * @param {Number} [maxSize=4000] - The Memory max items.
 */
var Memory = function(storage, maxSize) {
    var dumpedStorage;

    this.storage = storage;

    try{
        dumpedStorage = require(this.storage);
    } catch(error) {
        dumpedStorage = [];
    }

    this.maxSize = maxSize || 4000;
    this.items = Array.isArray(dumpedStorage) ? dumpedStorage : [];
};


Memory.prototype = {
    /**
     * Returns all the items in Memory
     */
     findAll: function() {
        return this.items;
    },
    /**
     * Find an item in the Memory and returns it
     * @param {Object} - Condition object, the object must have only one key. (For now).
     */
    find: function(condition) {
        if(typeof condition !== 'object') {
            throw new Error('Argument must be an object');
        }

        var field = Object.keys(condition)[0];

        var result = this.items.filter(function(item) {
            return item[field] === condition[field];
        });

        if(!result) {
            throw new Error('No results');
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