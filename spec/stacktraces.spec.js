'use strict';

const {realExpect, hereafter, captureError} = require('./util');

describe('stacktraces', () => {

  it('should point to exact invocation of expectation', () => {
    if (typeof window !== 'undefined') {
      return; //This test does not work in karma right now due to karma setup.
    }
    return hereafter((expect, when) => {
      // this should be line 12 of test file
      // this should be line 13 of test file
      expect(() => 1).to.eql(2);
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.stack.split('\n')[1]).to.contain('/stacktraces.spec.js:14');  
    });
  });

  xit('should point to when', () => {
  });

  xit('should include real trace below', () => {
  });

  it('should complain when something other than function provided to expect', () => {
    realExpect(hereafter((expect) => {
     expect('foo').to.be.true;
    })).to.throw(/Something other than a function passed into expect/);
  });
});

