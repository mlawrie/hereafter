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
  
  const expect = (...args) => {
    const capturer = expectationEvaluator(args, captureChaiChain(chaiChainableTerms), expectImpl);
    capturer.stack = new Error().stack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  const evaluateUntilFinished = () => {
    let capturer = capturers.shift()
    
    if (!capturer) {
      return;
    }
    return capturer.evaluate().then(evaluateUntilFinished);
  };

  return () => {
    testBodyFn(expect);
    return evaluateUntilFinished();
  };
};

hereafter.useChaiExpect = (chai, utils) => {
  expectImpl = chai.expect;
  chaiChainableTerms = extractChainableTermsFromChai(chai);
};


module.exports = hereafter;
