# API Documentation

**Table of Contents**
- [Methods provided by Hereafter](#methods-provided-by-hereafter)
  - [hereafter.useChaiExpect(*chai*)](#hereafterusechaiexpectchai)
  - [hereafter.useJestExpect(*expect*)](#hereafterusejestexpectexpect)
  - [hereafter(*function*)](#hereafterfunction)
  - [expect(*function*)](#expectfunction)
  - [when(*function*)](#whenfunction)
- [Working with Jest](#working-with-jest)
- [Working with Mocha and Chai](#working-with-mocha-and-chai)
- [Working with Jasmine](#working-with-jasmine)

## Methods provided by Hereafter

### hereafter.useChaiExpect(*chai*)
Configures hereafter to use chai expectations.
```javascript
const chai = require('chai');
const hereafter = require('hereafter');
hereafter.useChaiExpect(chai);
```

---

### hereafter.useJestExpect(*expect*)

Configures hereafter to use Jest expectations.
```javascript
const hereafter = require('hereafter');
hereafter.useJestExpect(expect);
```

---

### hereafter(*function*)

Creates a hereafter test. This method expects a function which takes two arguments: `expect()` and `when()`.
```javascript
it('some test', hereafter((expect, when) => {
  // your test here
}));
```

---

### expect(*function*)

Makes a potentially-asynchronous assertion. Depending on your testing framework of choice, the use of this method varies. Refer to your testing framework's docs for specifics. There is one key difference: every call to `expect()` expects a function rather than a value. This is so that the value can be re-evaluated later when previous steps in the test have completed.

```javascript

it('demonstrates expect method', hereafter((expect, when) => {
  // With Jest:
  expect(() => someValueOrFunctionCall).toBe('something');

  // With Chai:
  expect(() => someValueOrFunctionCall).to.eql('something');

  // This will throw an error:
  expect(someValueOrFunctionCall).to.eql('something');
}));

```

---

### when(*function*)

Perform some potentially asynchronous setup for one or more steps in your test. The function passed into when will only be invoked after previous `when()` calls in your test have completed and the assertions in previous `expect()` calls have become true. This allows you to chain together steps which depend on one another.

```javascript

it('demonstrates use of when()', hereafter((expect, when) => {

  when(() => { page.find('button').simulate('click') });
  
  expect(() => app.text()).to.contain('Welcome Back, SallySmith!');

  when(() => { app.find('.my-account').simulate('click') });  
  
  expect(() => app.text()).to.contain('My Account: You have 150 points!');
}));

```

## Working with Jest

Here's an example test using Hereafter with Jest:

```javascript

const hereafter = require('hereafter');
const {mount} = require('enzyme');
const fetchMock = require('fetch-mock');

hereafter.useJestExpect(expect); //We pass in the global 'expect' provided by jest

it('should be easy to write fast behavioral tests', hereafter((expect, when) => {
  fetchMock.get('/login', {username: 'SallySmith'});
  fetchMock.get('/myAccount', {points: 150});
  const app = mount(<MyCoolApp/>);

  when(() => { app.find('.login').simulate('click') });
  expect(() => app.text()).toContain('Welcome Back, SallySmith!');

  when(() => { app.find('.my-account').simulate('click') });  
  expect(() => app.text()).toContain('My Account: You have 150 points!');
}));

```

**Note:** You don't need to use jest's `expect` if you don't want to. You may also use chai. To do this, just tell Hereafter you'd like to use chai, as below. Hereafter doesn't need to know anything about your test runner, just your expectation library.

```javascript

const chai = require('chai');
const hereafter = require('hereafter');

hereafter.useChaiExpect(chai);

it('some test', hereafter((expect, when) => {
  // your test here
}));

```

## Working with Mocha and Chai

Here's an example of using Hereafter with Mocha and Chai:

```javascript

const chai = require('chai');
const hereafter = require('hereafter');
const {mount} = require('enzyme');
const fetchMock = require('fetch-mock');

hereafter.useChaiExpect(chai);

it('should be easy to write fast behavioral tests', hereafter((expect, when) => {
  fetchMock.get('/login', {username: 'SallySmith'});
  fetchMock.get('/myAccount', {points: 150});
  const app = mount(<MyCoolApp/>);

  when(() => { app.find('.login').simulate('click') });
  expect(() => app.text()).to.contain('Welcome Back, SallySmith!');

  when(() => { app.find('.my-account').simulate('click') });  
  expect(() => app.text()).to.contain('My Account: You have 150 points!');
}));

```

At this time, Chai is the only expectation library supported for Mocha.

## Working with Jasmine

Hereafter doesn't support Jasmine yet!
