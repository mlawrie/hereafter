'use strict';

var Promise = require('bluebird');

module.exports = function(timeoutMillis) {
  var startTime = (new Date()).getTime();
  
  var hasAttemptsLeft = function() {
      return (new Date()).getTime() <= startTime + timeoutMillis;
  };

  var tryAgain = function() {
    return new Promise(function(resolve) {
      setTimeout(resolve, 0);
    });
  };

  return {hasAttemptsLeft: hasAttemptsLeft, tryAgain: tryAgain};
};
