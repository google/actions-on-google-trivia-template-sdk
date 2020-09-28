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

const util = require('./util');
const {Alias, TabType, SchemaType} = require('./constant.js');
const config = require('./config.js');
const audio = require('./audio.js');

/**
 * Collection names.
 * @readonly
 */
const Collection = {
  QUIZ_Q_A: 'quiz_q_a',
  QUIZ_SETTINGS: 'quiz_settings',
};

/**
 * Document keys.
 * @readonly
 */
const Key = {
  QUIZ_Q_A: {
    QUESTION: 'question',
    CORRECT_ANSWER: 'correct_answer',
    INCORRECT_ANSWER_1: 'incorrect_answer_1',
    INCORRECT_ANSWER_2: 'incorrect_answer_2',
    FOLLOW_UP: 'follow_up',
    DIFFICULTY: 'difficulty',
    CATEGORY: 'category',
  },
  QUIZ_SETTINGS: {
    TITLE: 'title',
    QUESTIONS_PER_GAME: 'questions_per_game',
    PERSONALITY: 'personality',
    AUDIO_DING: 'audio_ding',
    AUDIO_GAME_INTRO: 'audio_game_intro',
    AUDIO_GAME_OUTRO: 'audio_game_outro',
    AUDIO_CORRECT: 'audio_correct',
    AUDIO_INCORRECT: 'audio_incorrect',
    AUDIO_ROUND_END: 'audio_round_end',
    AUDIO_CALCULATING: 'audio_calculating',
    RANDOMIZE_QUESTIONS: 'randomize_questions',
    GOOGLE_ANALYTICS_TRACKING_ID: 'google_analytics_tracking_id',
    QUIT_PROMPT: 'quit_prompt',
    DIFFICULTY_OR_GRADE_LEVEL_PROMPT: 'difficulty_or_grade_level_prompt',
    DEFAULT_DIFFICULTY_OR_GRADE_LEVEL: 'default_difficulty_or_grade_level',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1: 'difficulty_or_grade_level_suggestion_chip_1',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2: 'difficulty_or_grade_level_suggestion_chip_2',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3: 'difficulty_or_grade_level_suggestion_chip_3',
    CATEGORY_OR_TOPIC_PROMPT: 'category_or_topic_prompt',
    FIRST_CHOICE: 'first_choice',
    SECOND_CHOICE: 'second_choice',
    DEFAULT_CATEGORY_OR_TOPIC: 'default_category_or_topic',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1: 'category_or_topic_suggestion_chip_1',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2: 'category_or_topic_suggestion_chip_2',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3: 'category_or_topic_suggestion_chip_3',
  },
};

const limitTo25 = (vals) => {
  if (Array.isArray(vals) && vals.length) {
    const ans = vals[0];
    if (ans.length > 25) vals.unshift(ans.slice(0, 25));
    return vals;
  } else if (typeof vals === 'string') {
    return vals.slice(0, 25);
  } else {
    return vals;
  }
};

/**
 * Field schema for transformation and validation of raw docs.
 * @readonly
 */
const Schema = {
  QUIZ_Q_A: {
    [Key.QUIZ_Q_A.QUESTION]: {
      alias: Alias.QUIZ_Q_A.QUESTION,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_Q_A.CORRECT_ANSWER]: {
      alias: Alias.QUIZ_Q_A.CORRECT_ANSWER,
      type: SchemaType.STRING_LIST,
      process: limitTo25,
    },
    [Key.QUIZ_Q_A.INCORRECT_ANSWER_1]: {
      alias: Alias.QUIZ_Q_A.INCORRECT_ANSWER_1,
      type: SchemaType.STRING_LIST,
      process: limitTo25,
    },
    [Key.QUIZ_Q_A.INCORRECT_ANSWER_2]: {
      alias: Alias.QUIZ_Q_A.INCORRECT_ANSWER_2,
      type: SchemaType.STRING_LIST,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_Q_A.FOLLOW_UP]: {
      alias: Alias.QUIZ_Q_A.FOLLOW_UP,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_Q_A.DIFFICULTY]: {
      alias: Alias.QUIZ_Q_A.DIFFICULTY,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_Q_A.CATEGORY]: {
      alias: Alias.QUIZ_Q_A.CATEGORY,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
  },

  QUIZ_SETTINGS: {
    [Key.QUIZ_SETTINGS.TITLE]: {
      alias: Alias.QUIZ_SETTINGS.TITLE,
      type: SchemaType.STRING,
      default: config.TITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.QUESTIONS_PER_GAME]: {
      alias: Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME,
      type: SchemaType.INTEGER,
      default: config.QUESTIONS_PER_GAME_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.PERSONALITY]: {
      alias: Alias.QUIZ_SETTINGS.PERSONALITY,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.AUDIO_DING]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_DING,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_DING]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_CORRECT]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_CORRECT,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_CORRECT]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_INCORRECT]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_INCORRECT,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_INCORRECT]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_ROUND_END]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_ROUND_END,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_ROUND_END]],
    },
    [Key.QUIZ_SETTINGS.AUDIO_CALCULATING]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_CALCULATING,
      type: SchemaType.URL_LIST,
      default: [...audio[Alias.QUIZ_SETTINGS.AUDIO_CALCULATING]],
    },
    [Key.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS]: {
      alias: Alias.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS,
      type: SchemaType.BOOLEAN,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID]: {
      alias: Alias.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.QUIT_PROMPT]: {
      alias: Alias.QUIZ_SETTINGS.QUIT_PROMPT,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_PROMPT]: {
      alias: Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_PROMPT,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.DEFAULT_DIFFICULTY_OR_GRADE_LEVEL]: {
      alias: Alias.QUIZ_SETTINGS.DEFAULT_DIFFICULTY_OR_GRADE_LEVEL,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1]: {
      alias: Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2]: {
      alias: Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3]: {
      alias: Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_PROMPT]: {
      alias: Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_PROMPT,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_SETTINGS.FIRST_CHOICE]: {
      alias: Alias.QUIZ_SETTINGS.FIRST_CHOICE,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.SECOND_CHOICE]: {
      alias: Alias.QUIZ_SETTINGS.SECOND_CHOICE,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.DEFAULT_CATEGORY_OR_TOPIC]: {
      alias: Alias.QUIZ_SETTINGS.DEFAULT_CATEGORY_OR_TOPIC,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1]: {
      alias: Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2]: {
      alias: Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
    [Key.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3]: {
      alias: Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3,
      type: SchemaType.STRING,
      optional: true,
      process: limitTo25,
    },
  },
};

/**
 * Configuration and aliases for each sheet tab.
 * @readonly
 */
const Tab = {
  QUIZ_Q_A: {
    type: TabType.ARRAY,
    key: Key.QUIZ_Q_A,
    schema: Schema.QUIZ_Q_A,
  },
  QUIZ_SETTINGS: {
    type: TabType.DICTIONARY,
    key: Key.QUIZ_SETTINGS,
    valueKey: 'value',
    schema: Schema.QUIZ_SETTINGS,
    default: util.object.mapValues(Schema.QUIZ_SETTINGS, (val) => val.default),
  },
};

module.exports = {
  Collection,
  Key,
  Schema,
  Tab,
};
