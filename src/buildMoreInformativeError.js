"use strict";

module.exports = function(actualError, capturedStack) {
  var actualMessage = actualError.stack.split('\n')[0] + '\n';
  var capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  var actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};