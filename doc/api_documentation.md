# API Documentation

Table of contents:
- [Working with Jest](#working-with-jest)
- [Working with Mocha and Chai](#working-with-mocha-and-chai)
- [Working with Jasmine](#working-with-jasmine)

## Working with Jest

Here's an example test using Hereafter with Jest:

```javascript

const hereafter = require('hereafter');
const {mount} = require('enzyme');
const fetchMock = require('fetch-mock');

hereafter.useJestExpect(expect); //We pass in the global 'expect' provided by jest

it('should be easy to write fast behavioral tests', hereafter(expect, when) => {
  fetchMock.get('/login', {username: 'SallySmith'});
  fetchMock.get('/myAccount', {points: 150});
  const app = mount(<MyCoolApp/>);

  when(() => { app.find('.login').simulate('click') });
  expect(() => app.text()).to.contain('Welcome Back, SallySmith!');

  when(() => { app.find('.my-account').simulate('click') });  
  expect(() => app.text()).to.contain('My Account: You have 150 points!');
});

```

**Note:** You don't need to use jest's `expect` if you don't want to. You may also use chai. To do this, just tell Hereafter you'd like to use chai, as below. Hereafter doesn't need to know anything about your test runner, just your expectation library.

```javascript

const chai = require('chai');
const hereafter = require('hereafter');

hereafter.useChaiExpect(chai);

it('some test', hereafter(expect, when) => {
  // ...
});

```

## Working with Mocha and Chai
## Working with Jasmine