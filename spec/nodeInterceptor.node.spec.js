'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const nodeInterceptor = require('../src/nodeInterceptor');
const http = require('http');
const https = require('https');

describe('nodeInterceptor', () => {
  describe('http', () => {
    it('should track get', (done) => {

      http.get('http://nodejs.org/dist/index.json', (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(0);
          done();
        });
      }).on('error', () => {
        throw new Error('should not get here');
        done();
      });
      
      realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(1);
      
    });

    it('should track request', (done) => {
      const options = {
        hostname: 'nodejs.org',
        port: 80,
        path: '/dist/index.json',
        method: 'GET'
      };

      http.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(0);
          done();
        });
      }).on('error', () => {
        throw new Error('should not get here');
        done();
      }).end();
      
      realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(1);
      
    });
  });

  describe('https', () => {
    it('should track get', (done) => {

      https.get('https://nodejs.org/', (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(0);
          done();
        });
      }).on('error', (e) => {
        console.error(e);
        throw new Error('should not get here');
        done();
      });
      
      realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(1);
      
    }); 
  });

  xit('works with node-fetch', () => {
    const fetch = require('node-fetch');
    const promise = fetch('http://nodejs.org/dist/index.json');

    realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(1);

    return promise.then(() => {
      realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(0);
    });
  });

  describe('axios', () => {
    it('restores count after axios request completes', (done) => {
      const axios = require('axios');
      const requestPromise = axios.get('http://nodejs.org/dist/index.json').then((b) => {
        realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(0);
        done();
      });
    });

    it('increments count when axios request starts', () => {
      const axios = require('axios');
      axios.get('http://nodejs.org/dist/index.json')
      return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        realExpect(nodeInterceptor.getOutstandingRequestCount()).to.eql(1);
      });
    });
  });

});

