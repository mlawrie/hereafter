'use strict';

const {realExpect, hereafter, captureError} = require('./util');

describe('chai wrapping behavior', () => {
  it('should throw a simple error', () => {
    const test = hereafter((expect, when) => {
      expect(true).to.be.false;
    });

    realExpect(captureError(test).message).to.eql('expected true to be false');
  });

  it('should throw an error when chain involves a method call', () => {
    const test = hereafter((expect, when) => {
      expect([1, 2]).to.have.lengthOf(3);
    });

    realExpect(captureError(test).message).to.eql('expected [ 1, 2 ] to have a length of 3 but got 2');
  });

  it('should not throw an erorr when expectation is true', () => {
    const test = hereafter((expect, when) => {
      expect([1, 2]).to.have.lengthOf(2);
    });

    realExpect(captureError(test)).to.be.undefined;
  });

  xit('should evaluate all expectations', () => {

  });
  
});

