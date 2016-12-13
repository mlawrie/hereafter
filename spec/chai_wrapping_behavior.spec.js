'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const sinon = require('sinon');

describe('chai wrapping behavior', () => {
  it('should throw a simple error', () => {
    return hereafter((expect, when) => {
      expect(true).to.be.false;
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected true to be false');  
    });
  });

  it('should throw an error when chain involves a method call', () => {
    return hereafter((expect, when) => {
      expect([1, 2]).to.have.lengthOf(3);
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected [ 1, 2 ] to have a length of 3 but got 2');  
    });
  });

  it('should not throw an error when expectation is true', () => {
    return hereafter((expect, when) => {
      expect([1, 2]).to.have.lengthOf(2);
    })();
  });

  it('should evaluate all expectations', () => {
    const stub1 = sinon.stub().returns(true);
    const stub2 = sinon.stub().returns(true);
    const stub3 = sinon.stub().returns(true);

    return hereafter((expect, when) => {
      expect([1, 2]).to.satisfy(stub1);
      expect([1, 2]).to.satisfy(stub2);
      expect([1, 2]).to.satisfy(stub3);
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
      expect([1, 2]).to.satisfy(stub1);
      expect([1, 2]).to.satisfy(stub2);
      expect([1, 2]).to.satisfy(stub3);
    })().then(() => {
      realExpect(stub1.calledBefore(stub2)).to.be.true;
      realExpect(stub1.calledBefore(stub3)).to.be.true;
      realExpect(stub2.calledBefore(stub3)).to.be.true;
    });
  });
  
});

