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

const {conversation} = require('@assistant/conversation');

const {Action, Prompt} = require('./constant.js');
const util = require('./util');
const debug = require('./analytics/debug.js');
const logger = require('./analytics/logger.js');
const ConvHelper = require('./conv-helper.js');
const Fulfillment = require('./fulfillment.js');

/**
 * @module app
 * @desc ConversationV3 App Setup and Routing
 */

const app = conversation({debug: false});

// Map fulfillment handlers with actions
const fulfillment = Fulfillment.create();
for (const action of Object.values(Action)) {
  if (typeof fulfillment[action] !== 'function') continue;
  app.handle(action, (conv, ...args) => {
    conv.$helper = ConvHelper.create(conv);
    fulfillment[action](conv, ...args);
    debug.setDebugInfo(conv);
  });
}

// Handles uncaught errors.
app.catch((conv, error) => {
  debug.setDebugInfo(conv, error);
  logger.error(`An error has occurred handling [${conv.handler.name}]: `, {
    labels: {execution_id: conv.headers['function-execution-id']},
    stack: error.stack,
    conv: util.object.stringify(conv),
  });
  conv.scene.next = {name: 'actions.scene.END_CONVERSATION'};
  conv.add(Prompt.FALLBACK_PROMPT_2);
});

module.exports = app;
