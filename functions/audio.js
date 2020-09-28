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
  [Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/RobotIntro_Shortened1.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/RobotIntro_Shortened2.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/RobotOutro_Shortened_v1.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/RobotOutro_Shortened_v2.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_DING]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Trivia-Bot_Sounds_TriviaDing.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Trivia-Bot_Sounds_TriviaDing2.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_CORRECT]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Correct%20Ding%201.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Correct%20Ding%202.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_INCORRECT]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Incorrect%20Buzz%201.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_ROUND_END]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Trivia-Bot_Sounds_EndOfRound.ogg',
  ],
  [Alias.QUIZ_SETTINGS.AUDIO_CALCULATING]: [
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Sounds%20Calc%201.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Sounds%20Calc%202.ogg',
    'https://storage.googleapis.com/actionsprod.appspot.com/sounds/Robot%20Template%20Sounds%20Calc%203.ogg',
  ],
};
