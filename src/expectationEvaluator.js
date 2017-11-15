'use strict';

var scheduler = require('./scheduler');
var buildMoreInformativeError = require('./buildMoreInformativeError');
var Promise = require('bluebird');

var expectationEvaluator = function(getComparator, chainCapturer, wrappedExpectImpl, timeoutMillis) {
  if (typeof wrappedExpectImpl === 'undefined') {
    throw new Error('No expect implementation set for Hereafter. You need to run hereafter.useChaiExpect or hereafter.useJestExpect before running tests');
  }


  var evaluator = {};
  var schedulerInstance = scheduler(timeoutMillis);

  evaluator.returnValue = chainCapturer;
  
  evaluator.getInfo = function() { return {type: 'expect', getComparator: getComparator, chain: chainCapturer.getChain()} };
  
  var evaluateOnce = function() {
    var partialExpectation = wrappedExpectImpl(getComparator());
    chainCapturer.getChain().forEach(function(link) {
      try {
        if (link.invokedWith) {
          partialExpectation = partialExpectation[link.term].apply(partialExpectation, link.invokedWith);
        } else {
          partialExpectation = partialExpectation[link.term];
        }  
      } catch (e) {
        throw buildMoreInformativeError(e, link.stack);
      }
    });
  };

  evaluator.evaluate = function() {
    
    return new Promise(function(resolve) {
      evaluateOnce();
      resolve();
    }).catch(function(e) {
      if (schedulerInstance.shouldTryAgain()) {
        return schedulerInstance.tryAgain().then(evaluator.evaluate);
      } else {
        console.error("*** Hereafter timeout of " + timeoutMillis + "ms exceeded! ***");
        throw e;
      }
    });
  };

  return evaluator;
}

module.exports = expectationEvaluator;