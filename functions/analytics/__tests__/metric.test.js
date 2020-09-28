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

const metric = require('../metric.js');
const logger = require('../logger.js');

describe('metric', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('measureTime', function() {
    it('returns null of invalid value', function() {
      const output = metric.measureTime();
      expect(output).to.be.null;
    });

    it('returns an integer', function() {
      const output = metric.measureTime([0, 0]);
      expect(output).to.be.a('number');
    });

    it('returns delta time difference in millisecond', function() {
      const start = process.hrtime();
      let delta = metric.measureTime(start);
      for (let i = 0; i < 10; i++) {
        const newDelta = metric.measureTime(start);
        expect(delta).to.be.lessThan(newDelta);
        delta = newDelta;
      }
    });
  });

  describe('asyncTimer', function() {
    const testMetric = 'testMetric';
    const testValue = 'testValue';
    const testError = 'testError';
    const resolvedTarget = () => Promise.resolve(testValue);
    const rejectedTarget = () => Promise.reject(testError);

    beforeEach(function() {
      sinon.stub(logger, 'time');
      sinon.stub(logger, 'error');
    });

    it('returns a function', function() {
      const output = metric.asyncTimer(testMetric, resolvedTarget);
      expect(output).to.be.a('function');
    });

    it('returns a function the resolved value of target', function() {
      return metric
        .asyncTimer(testMetric, resolvedTarget)()
        .then((value) => {
          expect(value).to.equal(testValue);
        });
    });

    it('passes arguments to target when invoke return function', function() {
      const args = [1, 2, 3];
      const target = sinon.stub().resolves({});
      return metric
        .asyncTimer(testMetric, target)(...args)
        .then(() => {
          expect(target).to.have.been.calledWith(...args);
        });
    });

    it('invokes logger.time on resolved target', function() {
      return metric
        .asyncTimer(testMetric, resolvedTarget)()
        .then(() => {
          expect(logger.time).to.have.been.calledOnce;
        });
    });

    it('throws the rejected error of target', function() {
      return metric
        .asyncTimer(testMetric, rejectedTarget)()
        .catch((error) => {
          expect(error).to.eql(testError);
        });
    });

    it('invokes logger.time on rejected target', function() {
      return metric
        .asyncTimer(testMetric, rejectedTarget)()
        .catch(() => {
          expect(logger.time).to.have.been.calledOnce;
        });
    });
  });

  describe('bytes', function() {
    it('returns an integer', function() {
      const output = metric.bytes('test');
      expect(output).to.be.a('number');
    });

    it('returns number of unicode bytes of input string', function() {
      const output1 = metric.bytes('test');
      expect(output1).to.equal(4);
      const output2 = metric.bytes('¡dooq dǝǝq');
      expect(output2).to.equal(13);
    });
  });

  describe('jsonSize', function() {
    const testMetric = 'testMetric';
    const testJSON = {a: 1};

    beforeEach(function() {
      sinon.stub(logger, 'bytes');
    });

    it('returns undefined', function() {
      const output = metric.jsonSize(testMetric, testJSON);
      expect(output).to.be.undefined;
    });

    it('invokes logger.bytes on metric data', function() {
      metric.jsonSize(testMetric, testJSON);
      expect(logger.bytes).to.have.been.calledOnce;
    });
  });

  describe('hitRatio', function() {
    const testMetric = 'testMetric';
    const testHits = 100;
    const testMisses = 100;

    beforeEach(function() {
      sinon.stub(logger, 'ratio');
    });

    it('returns undefined', function() {
      const output = metric.hitRatio(testMetric, testHits, testMisses);
      expect(output).to.be.undefined;
    });

    it('invokes logger.ratio on metric data', function() {
      metric.hitRatio(testMetric, testHits, testMisses);
      expect(logger.ratio).to.have.been.calledOnce;
    });
  });
});
