#Hereafter      [![Build Status](https://travis-ci.org/mlawrie/hereafter.svg?branch=master)](https://travis-ci.org/mlawrie/hereafter)

## Hereafter makes it easy to write tests for asynchronous code

Hereafter lets you write concise, high-level, functional tests that provide similar coverage to your Selenium/Webdriver/Nightwatch/etc tests but execute hundreds or even thousands of times faster.

At the momement, Hereafter works with **Mocha**, **Chai** and **Jest**. I'll add Jasmine support if someone sends an email asking nicely :)

## Getting Started

Install hereafter with `npm install --save-dev hereafter` and check out the **[API Documentation](https://github.com/mlawrie/hereafter/blob/master/doc/api_documentation.md)** to see how get started with your testing framework of choice.

## An example

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

## How does it work?

Hereafter defers evaluation of each line in your tests until the promises and callbacks triggered by previous lines have completed. In essence, it lets you ignore the fact that your code is asynchronous and write tests as though it were purely synchronous code.

Behind the scenes, Hereafter implements a similar polling scheme for expectations that you will find implemented in every functional testing tool. The key difference is that the polling happens much, much faster since there is far less overhead given that there is no web browser or DOM.

## Why use this tool?

A suite of high-level behavioral tests that execute quickly is extremely valuable. It makes it easy and safe to refactor your code and help you safely deliver changes to production. The problem is that these tests aren't very easy to write or maintain. Relatively deep understanding of asynchronous javascript can be necessary to write useful tests at this level and that discourages many teams.

Hereafter sidesteps this problem entirely by making these tests look and work like regular low-level tests.
