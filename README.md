#Hereafter

Hereafter is a testing library which makes it easy to write tests for async code. It's specifically designed to make it simple to write high-level functional tests that can provide similar coverage to your Selenium/Webdriver/Nightwatch/etc tests but execute several orders of magnitude faster.

```javascript

const chai = require('chai');
const hereafter = require('../src/hereafter');
const {mount} = require('enzyme');

hereafter.useChaiExpect(chai);

it('should be easy to write fast behavioral tests', hereafter(expect, when) => {
  const app = mount(<MyCoolApp/>);

  when(() => { app.find('.login').simulate('click') });

  expect(() => app.text()).to.contain('Welcome Back, Sally Smith!');

  when(() => { app.find('.my-account').simulate('click') });  

  expect(() => app.text()).to.contain('Account Summary');
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