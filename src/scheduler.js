'use strict';

var Promise = require('bluebird');

module.exports = function() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 0);
  });
};