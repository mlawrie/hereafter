'use strict';

const scheduler = require('./scheduler');
const captureExpectation = require('./captureExpectation');
const expectationEvaluator = require('./expectationEvaluator');
const buildMoreInformativeError = require('./buildMoreInformativeError');

let expectImpl;
let expectationChainTerms = [];

const extractChainableTermsFromChai = (chai) => {
  const Assertion = chai.Assertion;
  var isChainableMethod = (name) => Assertion.prototype.__methods.hasOwnProperty(name);

  return Object.getOwnPropertyNames(Assertion.prototype)
    .map(name => ({name, isChainable: isChainableMethod(name)}));
};

const extractChainableTermsFromJest = (expect) => {
  return Object.getOwnPropertyNames(expect(1))
    .map(name => ({name, isChainable: name === 'not'}));
}

const hereafter = (testBodyFn) => {
  const capturers = [];
  const originalStack = new Error().stack;
  
  const expect = (func) => {
    if (typeof func !== 'function') {
      throw buildMoreInformativeError(new Error(`Something other than a function passed into expect(): ${func}`), originalStack);
    }

    const capturer = expectationEvaluator(func, captureExpectation(expectationChainTerms), expectImpl);
    capturer.stack = originalStack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  const when = (block) => {
    capturers.push({
      type: 'when',
      evaluate: () => {
        const retVal = block();
          
        if (typeof retVal !== 'undefined' && typeof retVal.then === 'function') {
          return retVal;
        } else {
          return Promise.resolve();
        }
      }

    });
  }

  const evaluateUntilFinished = () => {
    const capturer = capturers.shift();
    
    if (capturer) {
      return capturer.evaluate().then(evaluateUntilFinished);
    }
  };

  return () => {
    testBodyFn(expect, when);
    return evaluateUntilFinished();
  };
};

hereafter.useChaiExpect = (chai) => {
  expectImpl = chai.expect;
  expectationChainTerms = extractChainableTermsFromChai(chai);
};

hereafter.useJestExpect = (expect) => {
  expectImpl = expect;
  expectationChainTerms = extractChainableTermsFromJest(expect);
};


module.exports = hereafter;
