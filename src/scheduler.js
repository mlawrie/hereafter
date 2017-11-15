'use strict';

var Promise = require('bluebird');

module.exports = function(timeoutMillis) {
  var startTime = (new Date()).getTime();
  
  var shouldTryAgain = function() {
      return (new Date()).getTime() <= startTime + timeoutMillis;
  };

  var tryAgain = function() {
    return new Promise(function(resolve) {
      var waitTime = (1 + (new Date()).getTime() - startTime) / 25;
      waitTime = waitTime > 50 ? 50 : waitTime;
      
      setTimeout(resolve, Math.ceil(waitTime));
    });
  };

  return {shouldTryAgain: shouldTryAgain, tryAgain: tryAgain};
};