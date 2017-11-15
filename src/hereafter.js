'use strict';

var captureExpectation = require('./captureExpectation');
var expectationEvaluator = require('./expectationEvaluator');
var buildMoreInformativeError = require('./buildMoreInformativeError');
var Promise = require('bluebird');

var expectImpl;
var expectationChainTerms = [];
var timeoutMillis = 500;

var extractChainableTermsFromChai = function(chai) {
  var Assertion = chai.Assertion;
  var isChainableMethod = function(name) { return Assertion.prototype.__methods.hasOwnProperty(name) };
  var isFunction = function(name) {
    return (typeof Object.getOwnPropertyDescriptor(Assertion.prototype, name).value) === 'function' || isChainableMethod(name);
  };

  return Object.getOwnPropertyNames(Assertion.prototype)
    .filter(function(name) { return name !== 'arguments' })
    .map(function(name) { return {name: name, isChainable: isChainableMethod(name), isFunction: isFunction(name) } });
};

var extractChainableTermsFromJest = function(expect) {
  return Object.getOwnPropertyNames(expect(1))
    .map(function(name) { return {name: name, isChainable: name === 'not', isFunction: name !== 'not'}; });
}

var hereafter = function(testBodyFn) {
  var capturers = [];
  var originalStack;
  
  try {
    throw new Error();
  } catch(e) {
    originalStack = e.stack;
  }
  
  var expect = function(func) {
    if (typeof func !== 'function') {
      var errorToThrow;
      
      try {
        throw new Error("Something other than a function passed into expect(): " + func)
      } catch (e) {
        errorToThrow = e;
      }

      throw buildMoreInformativeError(errorToThrow, originalStack);
    }

    var capturer = expectationEvaluator(func, captureExpectation(expectationChainTerms), expectImpl, timeoutMillis);
    capturer.stack = originalStack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  var when = function(block) {
    capturers.push({
      type: 'when',
      evaluate: function() {
        var retVal = block();
          
        if (typeof retVal !== 'undefined' && typeof retVal.then === 'function') {
          return retVal;
        } else {
          return Promise.resolve();
        }
      }

    });
  }

  var evaluateUntilFinished = function() {
    var capturer = capturers.shift();
    
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

hereafter.setTimeoutMillis = function(millis) {
  timeoutMillis = millis;
};

module.exports = hereafter;
