#Hereafter

## Hereafter makes it easy to write tests for asynchronous code

#### Hereafter lets you write concise, high-level, functional tests that provide similar coverage to your Selenium/Webdriver/Nightwatch/etc tests but execute hundreds or even thousands of times faster.

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

## How does it work?

Hereafter defers evaluation of each line in your tests until the promises and callbacks triggered by previous lines have completed. In essence, it lets you ignore the fact that your code is asynchronous and write tests as though it were purely synchronous code.

Behind the scenes, Hereafter implements a similar polling scheme for expectations that you will find implemented in every functional testing tool. The key difference is that the polling happens much, much faster since there is far less overhead given that there is no web browser or DOM.



## Todo
- Improve Scheduler
- Figure out how many poll attempts
- Implement (much) longer polling for non-mocked endpoints
- Test on browsers
- Docs
- Jasmine support
- ES5 support?