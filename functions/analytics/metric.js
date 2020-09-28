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

const logger = require('./logger.js');

/**
 * @module metric
 * @desc Utility functions for Stackdriver metric logging.
 */

/**
 * Calculates total elapsed time from start in milliseconds.
 * @param {Array<number>} start - Previous timer in [seconds, nanoseconds].
 * @return {number} - Delta milliseconds difference.
 * @static
 */
const measureTime = (start) => {
  if (!start) {
    return null;
  }
  const [s, ns] = process.hrtime(start);
  const ms = s * 1e3 + ns / 1e6;
  return ms;
};

/**
 * Wrapper for asynchronous latency measurement.
 * @param {string} metric - Name of the metric. Ex. 'firestore.get'.
 * @param {Function} target - Function that starts async target.
 * @return {Function} - Function to kick off async target timer.
 * @static
 */
const asyncTimer = (metric, target) => {
  return (...args) => {
    const start = process.hrtime();
    return target(...args)
      .then((value) => {
        logger.time(`${metric}.success`, measureTime(start));
        return value;
      })
      .catch((error) => {
        logger.time(`${metric}.failure`, measureTime(start));
        throw error;
      });
  };
};

/**
 * Calculates the number of bytes in a unicode string.
 * @param {string} str - Unicode string.
 * @return {number} - Byte size.
 * @static
 */
const bytes = (str) => ~-encodeURI(str).split(/%..|./).length;

/**
 * JSON bytes logging tool.
 * @param {string} metric - Name of the metric/method/process.
 * @param {Object} json - JSON object to stringify.
 * @static
 */
const jsonSize = (metric, json) => {
  logger.bytes(metric, bytes(JSON.stringify(json)));
};

/**
 * Cache Hit Ratio logger.
 * @param {string} metric - Name of the metric/method/process.
 * @param {number} hits - Cache hit count.
 * @param {number} misses - Cache miss count.
 * @static
 */
const hitRatio = (metric, hits, misses) => {
  logger.ratio(metric, ((100 * hits) / (hits + misses)).toFixed(2));
};

module.exports = {
  measureTime,
  asyncTimer,
  bytes,
  jsonSize,
  hitRatio,
};
