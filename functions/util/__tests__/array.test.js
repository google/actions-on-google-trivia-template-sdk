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
const {expect} = chai;

const array = require('../array.js');

describe('util - array', function() {
  describe('randomPick', function() {
    it('returns an element from an array ', function() {
      const testArr = [0, 1, 2, 3, 4, 5, 6, 7];
      const output = array.randomPick(testArr);
      expect(testArr).to.include(output);
    });
  });

  describe('randomPop', function() {
    it('returns null for an empty input array', function() {
      const output = array.randomPop([]);
      expect(output).to.be.null;
    });

    it('pops a random element from input array', function() {
      const testArr = [1, 2, 3, 4, 5];
      const originalArr = testArr.slice(0);
      const originalLength = testArr.length;
      const output = array.randomPop(testArr);
      expect(testArr.length).to.equal(originalLength - 1);
      expect(originalArr).to.include(output);
      expect(testArr).to.not.include(output);
    });
  });

  describe('swap', function() {
    it('returns undefined', function() {
      const output = array.swap([1, 2], 0, 1);
      expect(output).to.be.undefined;
    });

    it('swaps ith and jth elements of input array', function() {
      const testArr = [1, 2];
      array.swap(testArr, 0, 1);
      expect(testArr).to.eql([2, 1]);
    });

    it('not swaps ith and jth elements if i equals j', function() {
      const testArr = [1, 2];
      array.swap(testArr, 0, 0);
      expect(testArr).to.eql([1, 2]);
    });
  });

  describe('shuffle', function() {
    it('returns input array', function() {
      const testArr = [1, 2, 3];
      const output = array.shuffle(testArr);
      expect(output).to.equal(testArr);
    });

    it('shuffles input array in random order', function() {
      const testArr = Array.from(Array(1000).keys());
      for (let i = 0; i < 5; i++) {
        const currArr = [...testArr];
        array.shuffle(testArr);
        expect(currArr).to.not.eql(testArr);
      }
    });
  });
});
