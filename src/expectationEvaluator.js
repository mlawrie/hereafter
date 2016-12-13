const scheduler = require('./scheduler');

const buildMoreInformativeError = (actualError, capturedStack) => {
  const actualMessage = actualError.stack.split('\n')[0] + '\n';
  const capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  const actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};

const expectationEvaluator = (getComparator, chainCapturer, wrappedExpectImpl) => {
  const capturer = {};
  let attemptsLeft = 5;

  capturer.returnValue = chainCapturer;
  
  capturer.getInfo = () => ({type: 'expect', getComparator, chain: chainCapturer.getChain()});
  
  const evaluateOnce = () => {
    let partialExpectation = wrappedExpectImpl(getComparator());
    chainCapturer.getChain().forEach((link) => {
      try {
        if (link.invokedWith) {
          partialExpectation = partialExpectation[link.term](...link.invokedWith);
        } else {
          partialExpectation = partialExpectation[link.term];
        }  
      } catch (e) {
        throw buildMoreInformativeError(e, capturer.stack);
      }
    });
  };

  capturer.evaluate = () => {
    return new Promise(resolve => {
      evaluateOnce();
      resolve();
    }).catch((e) => {
      if (attemptsLeft > 0) {
        attemptsLeft -= 1;
        return capturer.evaluate();
      } else {
        throw e;
      }
    });
  };

  return capturer;
}

module.exports = expectationEvaluator;