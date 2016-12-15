'use strict';
var makeLink = function(terms, chain, lastLinkRecord, isFunction) {
  var instance = isFunction ? function() {
    lastLinkRecord.invokedWith = Array.prototype.slice.call(arguments);
  } : {};

  terms.forEach(function(term) {
    var get = function() {
      var thisLinkRecord = {term: term.name};

      if (!term.isChainable) {
        try {
          throw new Error();
        } catch (e) {
          thisLinkRecord.stack = e.stack;
        }
      }

      chain.push(thisLinkRecord);
      
      return makeLink(terms, chain, thisLinkRecord, term.isFunction);
    };
    
    Object.defineProperty(instance, term.name, {get: get});
  });

  return instance;
};

module.exports = function(terms) {
  var chain = [];
  var instance = {};
  instance.getChain = function() { return chain; };
  instance.returnValue = makeLink(terms, chain, {}, false);
  return instance;
};