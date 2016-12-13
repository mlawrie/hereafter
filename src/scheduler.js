'use strict';

module.exports = (fn) => process.nextTick(fn);