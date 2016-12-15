const chai = require('chai');
const hereafter = require('../hereafter');

hereafter.useChaiExpect(chai);

test('should not fail when something which is initially false will become true asynchronously', hereafter((expect, when) => {
  let array = [1, 2];
  
  expect(() => array).to.have.lengthOf(3);

  setTimeout(() => {
    array.push(3);
  }, 0);
}));

test('THIS TEST SHOULD FAIL', hereafter((expect, when) => {
  expect(() => true).to.be.false;
}));
