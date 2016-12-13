'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const sinon = require('sinon');

describe('chai wrapping behavior', () => {
  it('should throw a simple error', () => {
    return hereafter((expect, when) => {
      expect(() => true).to.be.false;
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected true to be false');  
    });
  });

  it('should throw an error when chain involves a method call', () => {
    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.have.lengthOf(3);
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected [ 1, 2 ] to have a length of 3 but got 2');  
    });
  });

  it('should not throw an error when expectation is true', () => {
    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.have.lengthOf(2);
    })();
  });
});

