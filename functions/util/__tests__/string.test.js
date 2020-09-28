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

const string = require('../string.js');

describe('util - string', function() {
  describe('hash', function() {
    it('returns a number', function() {
      const output = string.hash('abc');
      expect(output).to.be.a('number');
    });

    it('returns the same hash value for same input string', function() {
      const output = string.hash('abc');
      for (let i = 0; i < 20; i++) {
        expect(string.hash('abc')).to.equal(output);
      }
    });
  });

  describe('convertType', function() {
    it('returns boolean value if type is boolean', function() {
      const truthyA = string.convertType('True', 'boolean');
      expect(truthyA).to.be.true;
      const truthyB = string.convertType('Yes', 'boolean');
      expect(truthyB).to.be.true;
      const falsy = string.convertType('False', 'boolean');
      expect(falsy).to.be.false;
    });

    it('returns number value if type is number', function() {
      const output = string.convertType('1', 'number');
      expect(output).to.equal(1);
    });

    it('returns string value if type is string', function() {
      const output = string.convertType('1', 'string');
      expect(output).to.equal('1');
    });
  });

  describe('concat', function() {
    it('returns a string', function() {
      const output = string.concat();
      expect(output).to.be.a('string');
    });

    it('trims surrounding white spaces for input strings', function() {
      const output = string.concat(' test ');
      expect(output).to.equal('test');
    });

    it('merges input strings & separates by a single whitespace', function() {
      const output = string.concat('a', 'b');
      expect(output).to.equal('a b');
    });
  });

  describe('snakeToCamelCase', function() {
    it('returns a string', function() {
      const output = string.snakeToCamelCase('abc');
      expect(output).to.be.a('string');
    });

    it('replaces snake_case with camelCase', function() {
      const output = string.snakeToCamelCase('SNAKE_CASE_TEST');
      expect(output).to.equal('snakeCaseTest');
    });
  });

  describe('replaceAll', function() {
    it('returns a string', function() {
      const output = string.replaceAll('today', 'today', 'tomorrow');
      expect(output).to.be.a('string');
    });

    it('replaces pattern strings with replacement with same capitalization', function() {
      const sentence = 'Today with today as today.';
      const output = string.replaceAll(sentence, 'today', 'tomorrow');
      expect(output).to.equal('Tomorrow with tomorrow as tomorrow.');
    });
  });

  describe('escapeRegExp', function() {
    it('returns a string', function() {
      const output = string.escapeRegExp('.*+?^${}()|[]\\');
      expect(output).to.be.a('string');
    });

    it('escapes special regex symbols', function() {
      const output = string.escapeRegExp('.*+?^${}()|[]\\');
      expect(output).to.equal('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });
  });

  describe('stripEmoji', function() {
    it('returns a string', function() {
      const output = string.stripEmoji('hello \u{1f300}\u{1f64f}\u{1f9ff}🏎🕯🏝✔world');
      expect(output).to.be.a('string');
    });

    it('removes emoji symbols', function() {
      const output = string.stripEmoji('hello \u{1f300}\u{1f64f}\u{1f9ff}🏎🕯🏝✔world');
      expect(output).to.equal('hello world');
    });
  });

  describe('emojiRegex', function() {
    it('is a RegExp type', function() {
      expect(string.emojiRegex).to.be.instanceOf(RegExp);
    });
  });
});
