'use strict';

var Promise = require('bluebird');

module.exports = function() {
  var attemptsLeft = 20;

  var hasAttemptsLeft = function() {
      return attemptsLeft > 0;
  };

  var tryAgain = function() {
    attemptsLeft =- 1;
    return new Promise(function(resolve) {
      setTimeout(resolve, 0);
    });
  };

  return {hasAttemptsLeft: hasAttemptsLeft, tryAgain: tryAgain};
};
