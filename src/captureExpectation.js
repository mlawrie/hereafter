'use strict';
const makeLink = function(terms, chain, lastLinkRecord) {
  const instance = function(...invokedArgs) {
    lastLinkRecord.invokedWith = invokedArgs;
  };

  terms.forEach(function(term) {
    const get = function() {
      const thisLinkRecord = {term: term.name};

      if (!term.isChainable) {
        thisLinkRecord.stack = new Error().stack;
      }

      chain.push(thisLinkRecord);
      return makeLink(terms, chain, thisLinkRecord);
    };

    Object.defineProperty(instance, term.name, {get});
  });

  return instance;
};

module.exports = function(terms) {
  const chain = [];
  const instance = {};
  instance.getChain = function() { return chain };
  instance.returnValue = makeLink(terms, chain, {});
  return instance;
};