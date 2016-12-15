'use strict';

module.exports = function() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 0);
  });
};