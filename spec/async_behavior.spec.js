'use strict';

const {realExpect, hereafter, captureError} = require('./util');

describe('async behavior', (realDone) => {
  it('should not fail when something which is initially false will become true asynchronously', () => {
    const test = hereafter((expect, when) => {
      
      let array = [1, 2];
      
      expect(array).to.have.lengthOf(3);

      process.nextTick(() => {
        array.push(3);
      });
      
    });

    const done = () => {
      realExpect(captureError(test)).to.be.undefined;
      realDone();
    };

    test(done);
  });
  
});

