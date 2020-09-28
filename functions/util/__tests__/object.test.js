// Copyright 2020, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {expect} = chai;
chai.use(sinonChai);

const object = require('../object.js');

describe('util - object', function() {
  describe('forOwn', function() {
    const baseObj = {a: 1};
    const testObj = Object.create(baseObj);
    testObj.b = 2;
    let testIteratee;

    beforeEach(function() {
      testIteratee = sinon.spy();
    });

    afterEach(function() {
      sinon.restore();
    });

    it('returns undefined', function() {
      const output = object.forOwn(testObj, testIteratee);
      expect(output).to.be.undefined;
    });

    it('enumerate over obj own property', function() {
      object.forOwn(testObj, testIteratee);
      expect(testIteratee).to.have.been.calledOnce;
    });

    it('invoke iteratee function with val, prop, obj params', function() {
      object.forOwn(testObj, testIteratee);
      expect(testIteratee).to.have.been.calledWith(2, 'b', testObj);
    });
  });

  describe('values', function() {
    it('returns an array', function() {
      const output = object.values({});
      expect(output).to.be.a('array');
    });

    it('returns transformed values if given transform function', function() {
      const output = object.values({a: 1, b: 2, c: 3}, (v) => v * 10);
      expect(output).to.have.lengthOf(3);
      expect(output).to.contains(10);
      expect(output).to.contains(20);
      expect(output).to.contains(30);
    });

    it('returns values of an object if no transform function', function() {
      const output = object.values({a: 1, b: 2, c: 3});
      expect(output).to.have.lengthOf(3);
      expect(output).to.contains(1);
      expect(output).to.contains(2);
      expect(output).to.contains(3);
    });
  });

  describe('entries', function() {
    it('returns an array', function() {
      const output = object.entries({});
      expect(output).to.be.a('array');
    });

    it('returns enumerable key value pairs in tuples', function() {
      const output = object.entries({a: 1, b: 2, c: 3});
      expect(output).to.have.lengthOf(3);
      expect(output).to.eql([['a', 1], ['b', 2], ['c', 3]]);
    });
  });

  describe('mapKeys', function() {
    it('returns an new object', function() {
      const originalObject = {};
      const output = object.mapKeys(originalObject);
      expect(output).to.be.a('object');
      expect(output).to.not.equal(originalObject);
    });

    it('returns an object with keys transformed by iteratee', function() {
      const output = object.mapKeys({a: 1, b: 2, c: 3}, (v, k) => k + v);
      expect(output).to.eql({a1: 1, b2: 2, c3: 3});
    });

    it('returns an object with keys applied with default identity function', function() {
      const output = object.mapKeys({a: 1, b: 2, c: 3});
      expect(output).to.eql({'1': 1, '2': 2, '3': 3});
    });
  });

  describe('mapValues', function() {
    it('returns an new object', function() {
      const originalObject = {};
      const output = object.mapKeys(originalObject);
      expect(output).to.be.a('object');
      expect(output).to.not.equal(originalObject);
    });

    it('returns an object with values transformed by iteratee', function() {
      const output = object.mapValues({a: 1, b: 2, c: 3}, (v) => v * 10);
      expect(output).to.eql({a: 10, b: 20, c: 30});
    });

    it('returns an object with values applied with default identity function', function() {
      const output = object.mapValues({a: 1, b: 2, c: 3});
      expect(output).to.eql({a: 1, b: 2, c: 3});
    });
  });

  describe('pickBy', function() {
    it('returns an new object', function() {
      const originalObject = {};
      const output = object.mapKeys(originalObject);
      expect(output).to.be.a('object');
      expect(output).to.not.equal(originalObject);
    });

    it('returns an object with key/val passed the predicate test', function() {
      const output = object.pickBy({a: 1, b: 2, c: 3}, (v) => v < 2);
      expect(output).to.eql({a: 1});
    });

    it('returns an object predicated with default identity function', function() {
      const output = object.pickBy({a: 1, b: 2, c: 3});
      expect(output).to.eql({a: 1, b: 2, c: 3});
    });
  });

  describe('isObject', function() {
    it('returns a boolean', function() {
      const output = object.isObject({});
      expect(output).to.be.a('boolean');
    });

    it('returns true for object, array and function', function() {
      expect(object.isObject({})).to.be.true;
      expect(object.isObject([])).to.be.true;
      expect(object.isObject(() => {})).to.be.true;
    });

    it('returns false for null and undefined', function() {
      expect(object.isObject(null)).to.be.false;
      expect(object.isObject(undefined)).to.be.false;
    });

    it('returns false for primitive values', function() {
      expect(object.isObject(1)).to.be.false;
      expect(object.isObject('a')).to.be.false;
    });
  });

  describe('isEmptyObj', function() {
    it('returns a boolean', function() {
      const output = object.isObject({});
      expect(output).to.be.a('boolean');
    });

    it('returns true for empty object', function() {
      const output = object.isEmptyObj({});
      expect(output).to.be.true;
    });

    it('returns false for non-empty object', function() {
      const output = object.isEmptyObj({a: 1});
      expect(output).to.be.false;
    });

    it('returns false for null object', function() {
      const output = object.isEmptyObj(null);
      expect(output).to.be.false;
    });

    it('returns false for primitive input', function() {
      expect(object.isEmptyObj(1)).to.be.false;
      expect(object.isEmptyObj('a')).to.be.false;
    });
  });

  describe('isEmpty', function() {
    it('returns a boolean', function() {
      const output = object.isEmpty({});
      expect(output).to.be.a('boolean');
    });

    it('returns true for empty object', function() {
      const output = object.isEmpty({});
      expect(output).to.be.true;
    });

    it('returns true for empty array', function() {
      const output = object.isEmpty([]);
      expect(output).to.be.true;
    });

    it('returns true for empty string', function() {
      const output = object.isEmpty('');
      expect(output).to.be.true;
    });

    it('returns true for null', function() {
      const output = object.isEmpty(null);
      expect(output).to.be.true;
    });

    it('returns true for undefined', function() {
      const output = object.isEmpty(undefined);
      expect(output).to.be.true;
    });

    it('returns false for truthy value', function() {
      expect(object.isEmpty(0)).to.be.false;
      expect(object.isEmpty(1)).to.be.false;
      expect(object.isEmpty('1')).to.be.false;
      expect(object.isEmpty(true)).to.be.false;
      expect(object.isEmpty(false)).to.be.false;
      expect(object.isEmpty([0])).to.be.false;
      expect(object.isEmpty({a: 1})).to.be.false;
    });
  });

  describe('arrayClean', function() {
    it('returns an array', function() {
      const output = object.arrayClean([]);
      expect(output).to.be.a('array');
    });

    it('removes empty values', function() {
      const testArr = [null, undefined, {}, [], ''];
      const output = object.arrayClean(testArr);
      expect(output).to.have.lengthOf(0);
    });

    it('not remove non-empty values', function() {
      const testArr = [0, 1, 'a', {a: 1}, [1], true, false];
      const output = object.arrayClean(testArr);
      expect(output).to.have.lengthOf(testArr.length);
    });

    it('removes nested empty values', function() {
      const testArr = [[{c: undefined}, {}, null], {a: [], b: null}];
      const output = object.arrayClean(testArr);
      expect(output).to.have.lengthOf(0);
    });
  });

  describe('objClean', function() {
    it('returns an object', function() {
      const output = object.objClean({});
      expect(output).to.be.a('object');
    });

    it('removes empty values', function() {
      const testObj = {a: null, b: undefined, c: {}, d: [], e: ''};
      const output = object.objClean(testObj);
      expect(output).to.eql({});
    });

    it('not remove non-empty values', function() {
      const testObj = {a: 0, b: 1, c: 'a', e: [1], f: true, g: false};
      const output = object.objClean(testObj);
      expect(output).to.eql(testObj);
    });

    it('not remove nested empty values', function() {
      const testObj = {a: [{c: undefined}, {}, null], b: {a: [], b: null}};
      const output = object.objClean(testObj);
      expect(output).to.eql({});
    });
  });

  describe('deepClean', function() {
    it('returns an object if input is an object', function() {
      const output = object.deepClean({});
      expect(output).to.be.a('object');
    });

    it('returns an array if input is an array', function() {
      const output = object.deepClean([]);
      expect(output).to.be.a('array');
    });

    it('removes empty values', function() {
      const testObj = {a: null, b: undefined, c: {}, d: [], e: ''};
      const output1 = object.deepClean(testObj);
      const testArr = [null, undefined, {}, [], ''];
      const output2 = object.deepClean(testArr);
      expect(output1).to.eql({});
      expect(output2).to.have.lengthOf(0);
    });

    it('not remove non-empty values', function() {
      const testObj = {a: 0, b: 1, c: 'a', e: [1], f: true, g: false};
      const output1 = object.deepClean(testObj);
      const testArr = [0, 1, 'a', {a: 1}, [1], true, false];
      const output2 = object.deepClean(testArr);
      expect(output1).to.eql(testObj);
      expect(output2).to.have.lengthOf(testArr.length);
    });

    it('not remove nested empty values', function() {
      const testObj = {a: [{c: undefined}, {}, null], b: {a: [], b: null}};
      const output1 = object.deepClean(testObj);
      const testArr = [[{c: undefined}, {}, null], {a: [], b: null}];
      const output2 = object.deepClean(testArr);
      expect(output1).to.eql({});
      expect(output2).to.have.lengthOf(0);
    });
  });

  describe('stringify', function() {
    it('returns a string', function() {
      const output = object.stringify({});
      expect(output).to.be.a('string');
    });

    it('filters excluded keys', function() {
      const obj = {a: 1, b: 2, c: 3};
      const output = object.stringify(obj, 'a', 'b');
      const parsed = JSON.parse(output);
      expect(parsed).to.eql({a: '[Excluded]', b: '[Excluded]', c: 3});
    });

    it('assigns circular property to [Circular]', function() {
      const a = {};
      const b = {a};
      a.b = b;
      const obj = {a: a};
      const output = object.stringify(obj);
      const parsed = JSON.parse(output);
      expect(parsed).to.eql({a: '[Circular]'});
    });

    it('assigns failed stringified property to [Stringify Error]', function() {
      const obj = {
        a: {
          get f() {
            throw new Error('Failure Message');
          },
        },
      };
      const output = object.stringify(obj);
      const parsed = JSON.parse(output);
      expect(parsed).to.eql({a: '[Stringify Error] Error: Failure Message'});
    });
  });
});
