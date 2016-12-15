module.exports = function(actualError, capturedStack) {
  const actualMessage = actualError.stack.split('\n')[0] + '\n';
  const capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  const actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};