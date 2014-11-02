var memory = require('./lib/memory');

var brain = {};

/* Generates a response to a piece of text */
brain.actions.generateResponse = function(text) {
  return "Hello, World is a great response to " + text;
};

/* Generates an original piece of content */
brain.actoins.generatePost = function() {
  return "Hello, World!";
};

module.exports = brain;