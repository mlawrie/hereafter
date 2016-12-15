'use strict';

const scheduler = require('./scheduler');
const captureExpectation = require('./captureExpectation');
const expectationEvaluator = require('./expectationEvaluator');
const buildMoreInformativeError = require('./buildMoreInformativeError');

let expectImpl;
let expectationChainTerms = [];

const extractChainableTermsFromChai = function(chai) {
  const Assertion = chai.Assertion;
  var isChainableMethod = function(name) { return Assertion.prototype.__methods.hasOwnProperty(name) };

  return Object.getOwnPropertyNames(Assertion.prototype)
    .map(function(name) { return {name, isChainable: isChainableMethod(name)} });
};

const extractChainableTermsFromJest = function(expect) {
  return Object.getOwnPropertyNames(expect(1))
    .map(function(name) { return {name, isChainable: name === 'not'}});
}

const hereafter = function(testBodyFn) {
  const capturers = [];
  const originalStack = new Error().stack;
  
  const expect = function(func) {
    if (typeof func !== 'function') {
      throw buildMoreInformativeError(new Error(`Something other than a function passed into expect(): ${func}`), originalStack);
    }

    const capturer = expectationEvaluator(func, captureExpectation(expectationChainTerms), expectImpl);
    capturer.stack = originalStack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  const when = function(block) {
    capturers.push({
      type: 'when',
      evaluate: function() {
        const retVal = block();
          
        if (typeof retVal !== 'undefined' && typeof retVal.then === 'function') {
          return retVal;
        } else {
          return Promise.resolve();
        }
      }

    });
  }

  const evaluateUntilFinished = function() {
    const capturer = capturers.shift();
    
    if (capturer) {
      return capturer.evaluate().then(evaluateUntilFinished);
    }
  };

  return function() {
    testBodyFn(expect, when);
    return evaluateUntilFinished();
  };
};

hereafter.useChaiExpect = function(chai) {
  expectImpl = chai.expect;
  expectationChainTerms = extractChainableTermsFromChai(chai);
};

hereafter.useJestExpect = function(expect) {
  expectImpl = expect;
  expectationChainTerms = extractChainableTermsFromJest(expect);
};


module.exports = hereafter;
