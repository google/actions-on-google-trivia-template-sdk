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

const moment = require('moment-timezone');

const datetime = require('../datetime.js');

describe('util - datetime', function() {
  describe('toMillisecondsFromDay', function() {
    it('converts day to milliseconds', function() {
      const output = datetime.toMillisecondsFromDay(1);
      expect(output).to.equal(86400000);
    });
  });

  describe('setDefaultTimezone', function() {
    afterEach(function() {
      moment.tz.setDefault('America/Los_Angeles');
    });

    it('returns true for valid timezone', function() {
      const output = datetime.setDefaultTimezone('Asia/Tokyo');
      expect(output).to.be.true;
    });

    it('returns false for invalid timezone', function() {
      const output = datetime.setDefaultTimezone('abc_xyz');
      expect(output).to.be.false;
    });

    it('updates default timezone', function() {
      const m1 = moment();
      expect(m1.tz()).to.equal('America/Los_Angeles');
      datetime.setDefaultTimezone('Asia/Tokyo');
      const m2 = moment();
      expect(m2.tz()).to.equal('Asia/Tokyo');
    });
  });

  describe('formatDate', function() {
    it('returns a string', function() {
      const output1 = datetime.formatDate('2019-03-07T19:26:53');
      expect(output1).to.be.a('string');
      const output2 = datetime.formatDate(Date.now());
      expect(output2).to.be.a('string');
    });

    it('returns formatted date string', function() {
      const output1 = datetime.formatDate('2019-03-07T19:26:53', 'YYYY-MM-DD');
      expect(output1).to.equal('2019-03-07');
      const output2 = datetime.formatDate('2019-03-07T19:26:53', 'MMMM Do, YYYY');
      expect(output2).to.equal('March 7th, 2019');
    });

    it('returns formatted date string in specific locale', function() {
      const output1 = datetime.formatDate('2019-03-07', 'L', 'ja');
      expect(output1).to.equal('2019/03/07');
      const output2 = datetime.formatDate('2019-03-07', 'L', 'en');
      expect(output2).to.equal('03/07/2019');
    });

    it('accepts timezone with extra spaces', function() {
      const output1 = datetime.formatDate('2019-03-07', 'L', 'en', 'America/Los_Angeles');
      const output2 = datetime.formatDate('2019-03-07', 'L', 'en', 'America/Los Angeles');
      expect(output1).to.equal(output2);
    });
  });

  describe('calculateDayDifference', function() {
    it('returns a number', function() {
      const output = datetime.calculateDayDifference('2018-08-08');
      expect(output).to.be.a('number');
    });

    it('returns day difference between two dates', function() {
      const output1 = datetime.calculateDayDifference('2018-08-08', '2018-08-10');
      expect(output1).to.equal(-2);
      const output2 = datetime.calculateDayDifference('2018-08-08', '2018-08-05');
      expect(output2).to.equal(3);
    });

    it('returns day difference from today if second argument is not provided', function() {
      const today = moment().format('YYYY-MM-DD');
      const output = datetime.calculateDayDifference(today);
      expect(output).to.equal(0);
    });
  });
});
