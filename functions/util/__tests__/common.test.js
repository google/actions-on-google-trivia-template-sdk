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

const common = require('../common.js');

describe('util - common', function() {
  describe('identity', function() {
    it('returns the same data type of input', function() {
      const inputStr = 'abc';
      const outputStr = common.identity(inputStr);
      expect(outputStr).to.equal(inputStr);
      const inputNum = 123;
      const outputNum = common.identity(inputNum);
      expect(outputNum).to.equal(inputNum);
      const inputObj = {a: 1, b: 2};
      const outputObj = common.identity(inputObj);
      expect(outputObj).to.equal(inputObj);
    });
  });

  describe('randomInteger', function() {
    it('returns a number', function() {
      const output = common.randomInteger(5);
      expect(output).to.be.a('number');
    });

    it('returns an int between 0(inclusive) and input(exclusive)', function() {
      for (let i = 0; i < 20; i++) {
        const output = common.randomInteger(5);
        expect(output).to.be.within(0, 5);
      }
    });
  });
});
