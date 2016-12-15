'use strict';
var makeLink = function(terms, chain, lastLinkRecord) {
  var instance = function() {
    lastLinkRecord.invokedWith = Array.prototype.slice.call(arguments);
  };

  terms.forEach(function(term) {
    var get = function() {
      var thisLinkRecord = {term: term.name};

      if (!term.isChainable) {
        thisLinkRecord.stack = new Error().stack;
      }

      chain.push(thisLinkRecord);
      return makeLink(terms, chain, thisLinkRecord);
    };

    Object.defineProperty(instance, term.name, {get: get});
  });

  return instance;
};

module.exports = function(terms) {
  var chain = [];
  var instance = {};
  instance.getChain = function() { return chain; };
  instance.returnValue = makeLink(terms, chain, {});
  return instance;
};