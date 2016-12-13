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

const buildMoreInformativeError = (actualError, capturedStack) => {
  const actualMessage = actualError.stack.split('\n')[0] + '\n';
  const capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  const actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};


const expectCapturer = (invokedWith) => {
  const capturer = {};
  const chainCapturer = captureChaiChain(chaiChainableTerms);

  capturer.returnValue = chainCapturer;
  capturer.getInfo = () => ({type: 'expect', invokedWith, chain: chainCapturer.getChain()});
  capturer.invoke = () => {
    let thing = expectImpl(...invokedWith);
    chainCapturer.getChain().forEach((link) => {
      try {
        if (link.invokedWith) {
          thing = thing[link.term](...link.invokedWith);
        } else {
          thing = thing[link.term];
        }  
      } catch (e) {
        throw buildMoreInformativeError(e, capturer.stack);
      }
    });
  };
  return capturer;
}


const hereafter = (testBodyFn) => {
  const capturers = [];
  
  const expect = (...args) => {
    const capturer = expectationEvaluator(args, captureChaiChain(chaiChainableTerms), expectImpl);
    capturer.stack = new Error().stack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  return (done) => {
    testBodyFn(expect);
    capturers.forEach((c) => c.evaluate());
  };
};

hereafter.useChaiExpect = (chai, utils) => {
  expectImpl = chai.expect;
  chaiChainableTerms = extractChainableTermsFromChai(chai);
};


module.exports = hereafter;
