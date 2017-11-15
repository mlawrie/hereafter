'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const http = require('http');

describe('async expectations', () => {
  it('should not fail if timeout exceeded but network calls are pending', () => {
    hereafter.setWaitForNetworkCalls(true);
    hereafter.setTimeoutMillis(0);

    let val = false;

    http.get('http://nodejs.org/dist/index.json', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        val = true;
      });
    }).on('error', () => {
      throw new Error('this should not be called');
    });


    return hereafter((expect, when) => {
      expect(() => val).to.be.true;
    })();
  });

  it('should reset timer after network call completes', () => {
    hereafter.setWaitForNetworkCalls(true);
    hereafter.setTimeoutMillis(50);

    let val = false;

    http.get('http://nodejs.org/dist/index.json', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        setTimeout(() => {val = true}, 40);
      });
    }).on('error', () => {
      throw new Error('this should not be called');
    });


    return hereafter((expect, when) => {
      expect(() => val).to.be.true;
    })();
  });
  
});