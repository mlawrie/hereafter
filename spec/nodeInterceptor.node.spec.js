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
});

