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

const logger = require('../logger.js');

describe('logger', function() {
  const testMetric = 'testMetric';
  const testTime = 100;
  const testBytes = 1024;
  const testRate = 95;

  beforeEach(function() {
    sinon.stub(logger, 'info');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('logger instance', function() {
    it('is an object', function() {
      expect(logger).to.be.a('object');
    });

    it('has custom time method', function() {
      expect(logger.time).to.be.a('function');
    });

    it('invokes logger.info through custom time method', function() {
      logger.time(testMetric, testTime);
      expect(logger.info).to.have.been.calledOnce;
    });

    it('has custom bytes method', function() {
      expect(logger.bytes).to.be.a('function');
    });

    it('invokes logger.info through custom bytes method', function() {
      logger.bytes(testMetric, testBytes);
      expect(logger.info).to.have.been.calledOnce;
    });

    it('has custom ratio method', function() {
      expect(logger.ratio).to.be.a('function');
    });

    it('invokes logger.info through custom ratio method', function() {
      logger.ratio(testMetric, testRate);
      expect(logger.info).to.have.been.calledOnce;
    });
  });
});
