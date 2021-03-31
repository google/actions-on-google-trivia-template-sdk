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

const {Alias} = require('./constant');

module.exports = {
  [Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: [],
  [Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: [],
  [Alias.QUIZ_SETTINGS.AUDIO_DING]: [
    'https://actions.google.com/sounds/v1/cartoon/instrument_strum.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_CORRECT]: [
    'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_INCORRECT]: [
    'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_ROUND_END]: [],
  [Alias.QUIZ_SETTINGS.AUDIO_CALCULATING]: [
    'https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg',
  ],
};
 