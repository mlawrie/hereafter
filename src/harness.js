'use strict';

const chai = require('chai');
const hereafter = require('./hereafter');
hereafter.useChaiExpect(chai);



it('should be good', hereafter((expect, when) => {
  expect(true).to.be.true;
  expect('fosdfo').to.be.ok;
  expect('fosdfo').to.have.lengthOf(1);
}));