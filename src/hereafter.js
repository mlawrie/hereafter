'use strict';
const scheduler = require('./scheduler');
const captureChaiChain = require('./captureChaiChain');
const expectationEvaluator = require('./expectationEvaluator');

let expectImpl;
let chaiChainableTerms = [];

const extractChainableTermsFromChai = (chai) => {
  const Assertion = chai.Assertion;
  var isChainableMethod = (name) => Assertion.prototype.__methods.hasOwnProperty(name);

  return Object.getOwnPropertyNames(Assertion.prototype)
    .map(name => ({name, isChainable: isChainableMethod(name)}));
};

const hereafter = (testBodyFn) => {
  const capturers = [];
  
  const expect = (func) => {
    const capturer = expectationEvaluator(func, captureChaiChain(chaiChainableTerms), expectImpl);
    capturer.stack = new Error().stack;
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
    let capturer = capturers.shift()
    
    if (!capturer) {
      return;
    }
    return capturer.evaluate().then(evaluateUntilFinished);
  };

  return () => {
    testBodyFn(expect, when);
    return evaluateUntilFinished();
  };
};

hereafter.useChaiExpect = (chai, utils) => {
  expectImpl = chai.expect;
  chaiChainableTerms = extractChainableTermsFromChai(chai);
};


module.exports = hereafter;
