#Hereafter

Hereafter is a testing library which makes it easy to write tests for async code. It's specifically designed to make it simple to write high-level functional tests that can provide similar coverage to your Selenium/Webdriver/Nightwatch/etc tests but execute several orders of magnitude faster.

```javascript

const chai = require('chai');
const hereafter = require('../src/hereafter');
const {mount} = require('enzyme');
const fetchMock = require('fetch-mock');

hereafter.useChaiExpect(chai);

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

#Todo
- Improve Scheduler
- Figure out how many poll attempts
- Implement (much) longer polling for non-mocked endpoints
- Test on browsers
- Docs
- Jasmine support
- ES5 support?