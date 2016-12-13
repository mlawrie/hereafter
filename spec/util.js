const chai = require('chai');
const realExpect = chai.expect;
const hereafter = require('../src/hereafter');
hereafter.useChaiExpect(chai);

const captureError = (hereafterTest, done) => {
  try {
    hereafterTest(done);
  } catch (e) {
    done(e);
  }
};

module.exports = {
  realExpect: chai.expect,
  hereafter,
  captureError
}