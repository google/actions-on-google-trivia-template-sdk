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

const config = require('../config.js');

/**
 * @module debug
 * @desc Utility functions for debug logging.
 */

/**
 * HTTP response status codes.
 */
const STATUS_CODE = {
  OK: 200,
  ERROR: 500,
};

/**
 * Default response info for various states.
 */
const states = {
  success: {
    status: STATUS_CODE.OK,
    label: 'Webhook Fulfillment Successfully Executed',
  },
  failure: {
    status: STATUS_CODE.ERROR,
    label: 'Webhook Execution Error',
  },
};

/**
 * Sets debug info on conv.session.params.
 * @param {ConversationV3} conv
 * @param {Error} [error] - Captured error.
 * @static
 */
const setDebugInfo = (conv, error) => {
  if (config.ENABLE_DEBUG) {
    const debugInfo = Object.assign({}, states[error ? 'failure' : 'success'], {
      version: config.FUNCTION_VERSION,
      executionId: conv.headers['function-execution-id'],
    });
    if (error) {
      debugInfo.message = error.message;
      debugInfo.stack = error.stack;
    }
    conv.session.params[config.DEBUG_KEY] = debugInfo;
  }
};

module.exports = {
  states,
  setDebugInfo,
};
