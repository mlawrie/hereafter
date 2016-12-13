'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const sinon = require('sinon');

describe('async expectations', (realDone) => {
  it('should not fail when something which is initially false will become true asynchronously', () => {
    return hereafter((expect, when) => {
      
      let array = [1, 2];
      
      expect(() => array).to.have.lengthOf(3);

      process.nextTick(() => {
        array.push(3);
      });
      
    })();
  });

  it('should not evaluate second expectation until first succeeds', () => {
    const stub1 = sinon.stub().returns(false);
    const stub2 = sinon.stub().returns(false);
    let stub2WasCalledBeforeNextTick;

    return hereafter((expect, when) => {
        
      expect(() => 'cats').to.satisfy(stub1);
      expect(() => 'hats').to.satisfy(stub2);

      process.nextTick(() => {
        stub1.returns(true);
        stub2.returns(true);
        stub2WasCalledBeforeNextTick = stub2.called;
      });
      
    })().then(() => {
      realExpect(stub2WasCalledBeforeNextTick).to.be.false;
    });
  });

  it('should evaluate all expectations', () => {
    const stub1 = sinon.stub().returns(true);
    const stub2 = sinon.stub().returns(true);
    const stub3 = sinon.stub().returns(true);

    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.satisfy(stub1);
      expect(() => [1, 2]).to.satisfy(stub2);
      expect(() => [1, 2]).to.satisfy(stub3);
    })().then(() => {
      realExpect(stub1.called).to.be.true;
      realExpect(stub2.called).to.be.true;
      realExpect(stub3.called).to.be.true;
    });
  });

  it('should evaluate all expectations in sequence', () => {
    const stub1 = sinon.stub().returns(true);
    const stub2 = sinon.stub().returns(true);
    const stub3 = sinon.stub().returns(true);

    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.satisfy(stub1);
      expect(() => [1, 2]).to.satisfy(stub2);
      expect(() => [1, 2]).to.satisfy(stub3);
    })().then(() => {
      realExpect(stub1.calledBefore(stub2)).to.be.true;
      realExpect(stub1.calledBefore(stub3)).to.be.true;
      realExpect(stub2.calledBefore(stub3)).to.be.true;
    });
  });

  it('should fail even if only last expectation fails', () => {
    return hereafter((expect, when) => {
      expect(() => true).to.be.true;
      expect(() => true).to.be.true;
      expect(() => true).to.be.false;
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected true to be false');  
    });
  });

  it('should not call second expectation if first fails', () => {
    const stub1 = sinon.stub().returns(false);
    const stub2 = sinon.stub().returns(false);
    let stub2WasCalledBeforeNextTick;

    return hereafter((expect, when) => {
        
      expect(() => 'cats').to.satisfy(stub1);
      expect(() => 'hats').to.satisfy(stub2);

    })().catch(() => {})
    .then(() => {
      realExpect(stub1.called).to.be.true;
      realExpect(stub2.called).to.be.false;
    });
  });
  
});

