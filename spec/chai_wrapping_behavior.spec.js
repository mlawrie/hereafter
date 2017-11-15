'use strict';

const {realExpect, hereafter, captureError} = require('./util');
const sinon = require('sinon');

describe('chai wrapping behavior', () => {
  it('should throw a simple error', () => {
    return hereafter((expect, when) => {
      expect(() => true).to.be.false;
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected true to be false');  
    });
  });

  it('should throw an error when chain involves a method call', () => {
    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.have.lengthOf(3);
    })().then(() => {
      throw new Error('this should not be called');
    }).catch(e => {
      realExpect(e.message).to.eql('expected [ 1, 2 ] to have a length of 3 but got 2');  
    });
  });

  it('should not throw an error when expectation is true', () => {
    return hereafter((expect, when) => {
      expect(() => [1, 2]).to.have.lengthOf(2);
    })();
  });

  it('should accept to contain expectation', hereafter((expect, when) => {
      
    expect(() => [1,2]).to.contain(1);
    expect(() => ({ foo: 1, bar: 2 })).to.contain.any.keys('bar', 'baz');
  }));

  xit('should asynchronously handle chai increase/decrease/change', hereafter((expect, when) => {
    //TODO: Tests need to be written; this probably works

    //change

    var obj = { val: 10 };
    var fn = function() { obj.val += 3 };
    var noChangeFn = function() { return 'foo' + 'bar'; }
    expect(fn).to.change(obj, 'val');
    expect(noChangeFn).to.not.change(obj, 'val')

    //increase

    var obj = { val: 10 };
    var fn = function() { obj.val = 15 };
    expect(fn).to.increase(obj, 'val');

    //decrease

    var obj = { val: 10 };
    var fn = function() { obj.val = 5 };
    expect(fn).to.decrease(obj, 'val');
  }));

  xit('should support chai chainable functions', hereafter((expect, when) => {

    // TODO: Add support
    
    expect(() => ({ foo: 'baz' })).to.have.property('foo').and.not.equal('bar');
    expect(() => obj).to.have.property('foo').that.is.a('string');
    expect(() => deepObj).to.have.property('green').that.is.an('object').that.deep.equals({ tea: 'matcha' });
    expect(() => deepObj).to.have.property('teas').that.is.an('array').with.deep.property('[2]').that.deep.equals({ tea: 'konacha' });

    expect(() => 'test').ownPropertyDescriptor('length').to.have.property('enumerable', false);
    expect(() => 'test').ownPropertyDescriptor('length').to.have.keys('value');

    expect(() => fn).to.throw(ReferenceError).and.not.throw(/good function/);


  }));

  it('should support to.have.deep.property', hereafter((expect, when) => {
    
  }));

  it("should accept all of the chai assertions from chai's own docs excluding change/increase/decrease and chainable functions", hereafter((expect, when) => {
    //not
    expect(() => 'foo').to.not.equal('bar');
    expect(() => () => {}).to.not.throw(Error);
    
    //deep
    expect(() => ({x: {a: 1}})).to.have.deep.property('x', {a: 1});
    expect(() => ({x: {a: 1}})).to.not.have.property('x', {a: 1});

    expect(() => ({ bar: 'baz' })).to.deep.equal({ bar: 'baz' });
    

    //any
    expect(() => ({bar: 'bar'})).to.have.any.keys('bar', 'baz');

    //all
    expect(() => ({bar: 1, baz: 1})).to.have.all.keys('bar', 'baz');

    // typeof
    expect(() => 'test').to.be.a('string');
    expect(() => ({ foo: 'bar' })).to.be.an('object');
    expect(() => null).to.be.a('null');
    expect(() => undefined).to.be.an('undefined');
    expect(() => new Error).to.be.an('error');
    expect(() => new Float32Array()).to.be.a('float32array');
    expect(() => Symbol()).to.be.a('symbol');

    // language chain
    expect(() => new String).to.be.an.instanceof(String);

    // include
    expect(() => [1,2,3]).to.include(2);
    expect(() => 'foobar').to.contain('foo');
    expect(() => ({ foo: 'bar', hello: 'universe' })).to.include.keys('foo');


    //ok
    expect(() => 'everything').to.be.ok;

    // true    
    expect(() => true).to.be.true;
    
    // false
    expect(() => false).to.be.false;

    // null
    expect(() => null).to.be.null;
    expect(() => undefined).to.not.be.null;

    // undefined
    expect(() => undefined).to.be.undefined;

    // finite
    expect(() => 1).to.be.finite;

    //exist
    expect(() => 'foo').to.exist;

    //empty
    expect(() => ({})).to.be.empty;

    // arguments
    expect(() => 'foo').to.not.be.arguments;

    //equal
    expect(() => 'hello').to.equal('hello');
    expect(() => 42).to.equal(42);
    expect(() => 1).to.not.equal(true);
    expect(() => ({ foo: 'bar' })).to.not.equal({ foo: 'bar' });
    expect(() => ({ foo: 'bar' })).to.deep.equal({ foo: 'bar' });

    //eql
    expect(() => ({ foo: 'bar' })).to.eql({ foo: 'bar' });
    expect(() => [ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);

    //above 
    expect(() => 10).to.be.above(5);
    expect(() => 'foo').to.have.length.above(2);
    expect(() => [ 1, 2, 3 ]).to.have.length.above(2);

    //least
    expect(() => 10).to.be.at.least(10);
    expect(() => 'foo').to.have.length.of.at.least(2);
    expect(() => [ 1, 2, 3 ]).to.have.length.of.at.least(3);

    //below
    expect(() => 5).to.be.below(10);
    expect(() => 'foo').to.have.length.below(4);
    expect(() => [ 1, 2, 3 ]).to.have.length.below(4);

    //most
    expect(() => 5).to.be.at.most(5);
    expect(() => 'foo').to.have.length.of.at.most(4);
    expect(() => [ 1, 2, 3 ]).to.have.length.of.at.most(3);

    //within
    expect(() => 7).to.be.within(5,10);
    expect(() => 'foo').to.have.length.within(2,4);
    expect(() => [ 1, 2, 3 ]).to.have.length.within(2,4);

    //instanceof
    var Tea = function (name) { this.name = name; }
      , Chai = new Tea('chai');

    expect(() => Chai).to.be.an.instanceof(Tea);
    expect(() => [ 1, 2, 3 ]).to.be.instanceof(Array);

    //property
    var obj = { foo: 'bar' };
    expect(() => obj).to.have.property('foo');
    expect(() => obj).to.have.property('foo', 'bar');

    var css = { '.link[target]': 42 };
    expect(() => css).to.have.property('.link[target]', 42);
    
    //ownProperty

    expect(() => 'test').to.have.ownProperty('length');

    //ownPropertyDescriptor
    expect(() => 'test').to.have.ownPropertyDescriptor('length');
    expect(() => 'test').to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 4 });
    expect(() => 'test').not.to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 3 });

    //length (deprecated in version 2.4.0 and removed in 3.0.0)

    expect(() => 'foo').to.have.length.above(2);
    expect(() => [ 1, 2, 3 ]).to.have.length.above(2);
    expect(() => 'foo').to.have.length.below(4);
    expect(() => [ 1, 2, 3 ]).to.have.length.below(4);
    expect(() => 'foo').to.have.length.within(2,4);
    expect(() => [ 1, 2, 3 ]).to.have.length.within(2,4);

    //lengthOf

    expect(() => [ 1, 2, 3]).to.have.lengthOf(3);
    expect(() => 'foobar').to.have.lengthOf(6);

    //match

    expect(() => 'foobar').to.match(/^foo/);

    //string

    expect(() => 'foobar').to.have.string('bar');

    //keys

    expect(() => ({ foo: 1, bar: 2 })).to.have.any.keys('foo', 'baz');
    expect(() => ({ foo: 1, bar: 2 })).to.have.any.keys('foo');
    expect(() => ({ foo: 1, bar: 2 })).to.contain.any.keys('bar', 'baz');
    expect(() => ({ foo: 1, bar: 2 })).to.contain.any.keys(['foo']);
    expect(() => ({ foo: 1, bar: 2 })).to.contain.any.keys({'foo': 6});
    expect(() => ({ foo: 1, bar: 2 })).to.have.all.keys(['bar', 'foo']);
    expect(() => ({ foo: 1, bar: 2 })).to.have.all.keys({'bar': 6, 'foo': 7});
    expect(() => ({ foo: 1, bar: 2, baz: 3 })).to.contain.all.keys(['bar', 'foo']);
    expect(() => ({ foo: 1, bar: 2, baz: 3 })).to.contain.all.keys({'bar': 6});

    //throw

    var err = new ReferenceError('This is a bad function.');
    var fn = function () { throw err; }
    expect(() => fn).to.throw(ReferenceError);
    expect(() => fn).to.throw(Error);
    expect(() => fn).to.throw(/bad function/);
    expect(() => fn).to.not.throw('good function');
    expect(() => fn).to.throw(ReferenceError, /bad function/);
    expect(() => fn).to.throw(err);
    
    //respondTo

    expect(() => 'foo').itself.to.not.respondTo('baz');

    //itself

    expect(() => 'foo').itself.not.to.respondTo('baz');

    //satisfy

    expect(() => 1).to.satisfy(function(num) { return num > 0; });

    //closeTo

    expect(() => 1.5).to.be.closeTo(1, 0.5);

    //members

    expect(() => [1, 2, 3]).to.include.members([3, 2]);
    expect(() => [1, 2, 3]).to.not.include.members([3, 2, 8]);

    expect(() => [4, 2]).to.have.members([2, 4]);
    expect(() => [5, 2]).to.not.have.members([5, 2, 1]);

    expect(() => [{ id: 1 }]).to.deep.include.members([{ id: 1 }]);

    //oneOf

    expect(() => 'a').to.be.oneOf(['a', 'b', 'c']);
    expect(() => 9).to.not.be.oneOf(['z']);
    expect(() => [3]).to.not.be.oneOf([1, 2, [3]]);

    var three = [3];
    expect(() => three).to.not.be.oneOf([1, 2, [3]]);
    expect(() => three).to.be.oneOf([1, 2, three]);


    //extensible

    var nonExtensibleObject = Object.preventExtensions({});
    var sealedObject = Object.seal({});
    var frozenObject = Object.freeze({});

    expect(() => ({})).to.be.extensible;
    expect(() => nonExtensibleObject).to.not.be.extensible;
    expect(() => sealedObject).to.not.be.extensible;
    expect(() => frozenObject).to.not.be.extensible;

    //sealed

    var sealedObject = Object.seal({});
    var frozenObject = Object.freeze({});

    expect(() => sealedObject).to.be.sealed;
    expect(() => frozenObject).to.be.sealed;
    expect(() => ({})).to.not.be.sealed;

    //frozen

    var frozenObject = Object.freeze({});
    expect(() => frozenObject).to.be.frozen;
    expect(() => ({})).to.not.be.frozen;
  }));
});

