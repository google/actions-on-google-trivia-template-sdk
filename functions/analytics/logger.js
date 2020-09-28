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

const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const packageJson = require('../package.json');

// Creates a Winston logger that streams to Stackdriver Logging.
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log".
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.errors({stack: true}), winston.format.json()),
  transports: [
    // new winston.transports.Console(),
    new LoggingWinston({
      prefix: packageJson.name,
      labels: {
        module: packageJson.name,
        version: packageJson.version,
      },
    }),
  ],
});

/**
 * Custom latency logging method.
 * @param {string} metric - The name of the metric/method/process.
 * @param {number} time - The elapsed time in milliseconds.
 */
logger.time = (metric, time) => {
  logger.info(`${metric}/latency: ${time}ms`, {
    metric,
    type: 'latency',
    value: time,
    unit: 'ms',
  });
};

/**
 * Custom json bytes logging method.
 * @param {string} metric - The name of the metric/method/process.
 * @param {number} bytes - The size of the json in bytes.
 */
logger.bytes = (metric, bytes) => {
  logger.info(`${metric}/size: ${bytes}B`, {
    metric,
    type: 'size',
    value: bytes,
    unit: 'bytes',
  });
};

/**
 * Custom ratio logging method.
 * @param {string} metric - The name of the metric/method/process.
 * @param {string|number} rate - The measured rate.
 */
logger.ratio = (metric, rate) => {
  logger.info(`${metric}/ratio: ${rate}%`, {
    metric,
    type: 'ratio',
    value: rate,
    unit: '%',
  });
};

module.exports = logger;
