'use strict';

module.exports = () => new Promise(resolve => process.nextTick(resolve));