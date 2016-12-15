const chai = require('chai');
const hereafter = require('../hereafter');

hereafter.useJestExpect(expect);

test('should not fail when something which is initially false will become true asynchronously', hereafter((expect, when) => {

  let array = [1, 2];
  
  expect(() => array.length).toBe(3);
  expect(() => array.length).not.toBe(4);

  setTimeout(() => {
    array.push(3);
  }, 0);
}));

test('THIS TEST SHOULD FAIL', hereafter((expect, when) => {
  expect(() => true).toBe(false);
}));
