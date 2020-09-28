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

console.time('cold-start');

const functions = require('firebase-functions');

const app = require('./app.js');
const {
  FUNCTION_NAME,
  FUNCTION_VERSION,
  FUNCTION_MEMORY,
  FUNCTION_REGION,
  FUNCTION_TIMEOUT,
} = require('./config.js');

exports[`${FUNCTION_NAME}_${FUNCTION_VERSION}`] = functions
  .region(FUNCTION_REGION)
  .runWith({timeoutSeconds: FUNCTION_TIMEOUT, memory: FUNCTION_MEMORY})
  .https.onRequest(app);

console.timeEnd('cold-start');
