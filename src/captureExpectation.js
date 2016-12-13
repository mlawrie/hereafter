const makeLink = (terms, chain, lastLinkRecord) => {
  const instance = (...invokedArgs) => {
    lastLinkRecord.invokedWith = invokedArgs;
  };

  terms.forEach((term) => {
    const get = () => {
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

module.exports = (terms) => {
  const chain = [];
  const instance = {};
  instance.getChain = () => chain;
  instance.returnValue = makeLink(terms, chain, {});
  return instance;
};