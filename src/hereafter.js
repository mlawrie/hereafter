const scheduler = require('./scheduler');
const captureChaiChain = require('./captureChaiChain');

let expectImpl;
let chaiChainableTerms = [];

const extractChainableTermsFromChai = (chai) => {
  const Assertion = chai.Assertion;
  var isChainableMethod = (name) => Assertion.prototype.__methods.hasOwnProperty(name);

  return Object.getOwnPropertyNames(Assertion.prototype)
    .map(name => ({name, isChainable: isChainableMethod(name)}));
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
        const moreInformativeStackTrace = e.stack.split('\n')[0] + '\n'
          + capturer.stack.split('\n').slice(2).join('\n') + '\n'
          + e.stack.split('\n').slice(1).join('\n');
        e.stack = moreInformativeStackTrace
        throw e;
      }
    });
  };
  return capturer;
}


const hereafter = (testBodyFn) => {
  const capturers = [];
  
  const expect = (...args) => {
    const capturer = expectCapturer(args);
    capturer.stack = new Error().stack;
    capturers.push(capturer);
    return capturer.returnValue.returnValue;
  };

  return (done) => {
    testBodyFn(expect);
    setTimeout(() => {
      capturers.forEach((c) => console.log(c.getInfo()));
      capturers.forEach((c) => c.invoke());
      done();
    }, 100);
    
  };
};

hereafter.useChaiExpect = (chai, utils) => {
  expectImpl = chai.expect;
  chaiChainableTerms = extractChainableTermsFromChai(chai);
};


module.exports = hereafter;
