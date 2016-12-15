'use strict';

const scheduler = require('./scheduler');
const buildMoreInformativeError = require('./buildMoreInformativeError');

const expectationEvaluator = (getComparator, chainCapturer, wrappedExpectImpl) => {
  const evaluator = {};
  let attemptsLeft = 20;

  evaluator.returnValue = chainCapturer;
  
  evaluator.getInfo = () => ({type: 'expect', getComparator, chain: chainCapturer.getChain()});
  
  const evaluateOnce = () => {
    let partialExpectation = wrappedExpectImpl(getComparator());
    chainCapturer.getChain().forEach((link) => {
      try {
        if (link.invokedWith) {
          partialExpectation = partialExpectation[link.term](...link.invokedWith);
        } else {
          partialExpectation = partialExpectation[link.term];
        }  
      } catch (e) {
        throw buildMoreInformativeError(e, evaluator.stack);
      }
    });
  };

  evaluator.evaluate = () => {
    return new Promise(resolve => {
      evaluateOnce();
      resolve();
    }).catch((e) => {
      if (attemptsLeft > 0) {
        attemptsLeft -= 1;
        return scheduler().then(evaluator.evaluate);
      } else {
        throw e;
      }
    });
  };

  return evaluator;
}

module.exports = expectationEvaluator;