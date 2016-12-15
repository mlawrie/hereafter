'use strict';

var scheduler = require('./scheduler');
var buildMoreInformativeError = require('./buildMoreInformativeError');

var expectationEvaluator = function(getComparator, chainCapturer, wrappedExpectImpl) {
  var evaluator = {};
  var attemptsLeft = 20;

  evaluator.returnValue = chainCapturer;
  
  evaluator.getInfo = function() { return {type: 'expect', getComparator, chain: chainCapturer.getChain()} };
  
  var evaluateOnce = function() {
    var partialExpectation = wrappedExpectImpl(getComparator());
    chainCapturer.getChain().forEach(function(link) {
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

  evaluator.evaluate = function() {
    return new Promise(function(resolve) {
      evaluateOnce();
      resolve();
    }).catch(function(e) {
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