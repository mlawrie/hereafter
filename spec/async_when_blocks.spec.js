'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const sinon = require('sinon');

describe('async when blocks', () => {

  it('should evaluate all when blocks', () => {
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    const stub3 = sinon.stub();

    return hereafter((expect, when) => {
      when(stub1);
      when(stub2);
      when(stub3);
    })().then(() => {
      realExpect(stub1.called).to.be.true;
      realExpect(stub2.called).to.be.true;
      realExpect(stub3.called).to.be.true;
    });
  });

  it('should evaluate all when blocks in sequence', () => {
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    const stub3 = sinon.stub();

    return hereafter((expect, when) => {
      when(stub1);
      when(stub2);
      when(stub3);
    })().then(() => {
      realExpect(stub1.calledBefore(stub2)).to.be.true;
      realExpect(stub1.calledBefore(stub3)).to.be.true;
      realExpect(stub2.calledBefore(stub3)).to.be.true;
    });
  });

  it('should succeed when when blocks set up subsequent expectations', () => {
    let someVar = false;
    const stub = sinon.stub().returns(false);
    
    return hereafter((expect, when) => {
      expect(() => someVar).to.be.false;
    
      when(() => someVar = true);
    
      expect(() => someVar).to.be.true;
    
      when(() => someVar = 3);
    
      expect(() => someVar).to.eql(3);
    })();
  });

  it('should accept a function which returns a promise from a when block and wait for evaluation to complete', () => {
    let someVar = false;
    const stub = sinon.stub().returns(false);
    
    return hereafter((expect, when) => {
      expect(() => someVar).to.be.false;
    
      when(() => new Promise(resolve => {
        setTimeout(() => {
          someVar = true;
          resolve();
        }, 10);
      }));
    
      expect(() => someVar).to.be.true;
    })();
  });
});