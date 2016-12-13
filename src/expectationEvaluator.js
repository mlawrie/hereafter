const buildMoreInformativeError = (actualError, capturedStack) => {
  const actualMessage = actualError.stack.split('\n')[0] + '\n';
  const capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  const actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};

const expectationEvaluator = (invokedWith, chainCapturer, wrappedExpectImpl) => {
  const capturer = {};
  
  capturer.returnValue = chainCapturer;
  
  capturer.getInfo = () => ({type: 'expect', invokedWith, chain: chainCapturer.getChain()});
  
  capturer.evaluate = () => {
    let partialExpectation = wrappedExpectImpl(...invokedWith);
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

  return capturer;
}

module.exports = expectationEvaluator;