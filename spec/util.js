const chai = require('chai');
const realExpect = chai.expect;
const hereafter = require('../src/hereafter');
hereafter.useChaiExpect(chai);

const captureError = (fn) => {
  try {
    fn();
  } catch (e) {
    return e;
  }
};

module.exports = {
  realExpect: chai.expect,
  hereafter,
  captureError
}