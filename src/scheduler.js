'use strict';

var Promise = require('bluebird');

var currentTime = function() {
  return (new Date()).getTime();
};

var nextMessageTime = function() {
  return currentTime() + 3000;
}

module.exports = function(timeoutMillis, waitForNetworkCalls) {
  var startTime = currentTime();
  var timeUntilWeGiveUp = currentTime() + timeoutMillis;
  var timeUntilNextMessageAboutOutstandingRequests = nextMessageTime();

  var shouldTryAgain = function() {
    var outstandingRequestCount = waitForNetworkCalls ? require('./nodeInterceptor').getOutstandingRequestCount() : 0;
    if (outstandingRequestCount > 0) {
      if (currentTime() >= timeUntilNextMessageAboutOutstandingRequests) {
        timeUntilNextMessageAboutOutstandingRequests = nextMessageTime();
        console.log("Hereafter is still waiting on " + outstandingRequestCount + " network calls...");
      }
      timeUntilWeGiveUp = currentTime() + timeoutMillis;
      return true;
    }
    return currentTime() <= timeUntilWeGiveUp;
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