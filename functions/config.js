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

/**
 * Project configuration settings
 */
const config = {
  // Webhook config
  FUNCTION_NAME: 'triviaQuiz',
  FUNCTION_VERSION: 'v1',
  FUNCTION_MEMORY: '2GB',
  FUNCTION_REGION: 'us-central1',
  FUNCTION_TIMEOUT: 60, // seconds
  ENABLE_DEBUG: true,
  DEBUG_KEY: 'DedicatedDebugInfo',
  SSML_BREAK_TIME: 750, // milliseconds

  // Default values for Quiz settings in the data sheet
  QUESTIONS_PER_GAME_DEFAULT: 5,
  TITLE_DEFAULT: 'Trivia Quiz',
  MAX_QUESTIONS_PER_QUIZ: 10,
  DEFAULT_CATEGORY: 'defaultCategory',
  DEFAULT_DIFFICULTY: 'defaultDifficulty',
};

module.exports = config;
