'use strict';

var Promise = require('bluebird');

var currentTime = function() {
  return (new Date()).getTime();
};

var nextMessageTime = function() {
  return currentTime() + 3000;
}

var getOutstandingRequestCount = function(networkCallMonitoringStrategy) {
  if (networkCallMonitoringStrategy === 'nodejs') {
    return require('./nodeInterceptor').getOutstandingRequestCount();
  }
  return 0;
};

module.exports = function(timeoutMillis, networkCallMonitoringStrategy) {
  var startTime = currentTime();
  var timeUntilWeGiveUp = currentTime() + timeoutMillis;
  var timeUntilNextMessageAboutOutstandingRequests = nextMessageTime();

  var shouldTryAgain = function() {
    var outstandingRequestCount = getOutstandingRequestCount(networkCallMonitoringStrategy);
    if (outstandingRequestCount > 0) {
      if (currentTime() >= timeUntilNextMessageAboutOutstandingRequests) {
        timeUntilNextMessageAboutOutstandingRequests = nextMessageTime();
        console.log('Hereafter is still waiting on ' + outstandingRequestCount + ' network calls...');
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