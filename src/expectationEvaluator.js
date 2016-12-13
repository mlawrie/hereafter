const scheduler = require('./scheduler');

const buildMoreInformativeError = (actualError, capturedStack) => {
  const actualMessage = actualError.stack.split('\n')[0] + '\n';
  const capturedTrace = capturedStack.split('\n').slice(2).join('\n') + '\n';
  const actualTrace = actualError.stack.split('\n').slice(1).join('\n');

  actualError.stack = actualMessage + capturedTrace + actualTrace;
  return actualError;
};

const expectationEvaluator = (getComparator, expectationCapturer, wrappedExpectImpl) => {
  const evaluator = {};
  let attemptsLeft = 5;

  evaluator.returnValue = expectationCapturer;
  
  evaluator.getInfo = () => ({type: 'expect', getComparator, chain: expectationCapturer.getChain()});
  
  const evaluateOnce = () => {
    let partialExpectation = wrappedExpectImpl(getComparator());
    expectationCapturer.getChain().forEach((link) => {
      try {
        if (link.invokedWith) {
          partialExpectation = partialExpectation[link.term](...link.invokedWith);
        } else {
          partialExpectation = partialExpectation[link.term];
        }  
      } catch (e) {
        throw buildMoreInformativeError(e, evaluator.stack);
      }
    });
  };

  evaluator.evaluate = () => {
    return new Promise(resolve => {
      evaluateOnce();
      resolve();
    }).catch((e) => {
      if (attemptsLeft > 0) {
        attemptsLeft -= 1;
        return evaluator.evaluate();
      } else {
        throw e;
      }
    });
  };

  return evaluator;
}

module.exports = expectationEvaluator;