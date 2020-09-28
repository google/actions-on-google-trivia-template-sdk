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
 * @module constant
 * @desc Common enumeration constants.
 */

/**
 * Action names from ConversationV3 handlers.
 * @readonly
 */
const Action = {
  ANSWER: 'ANSWER',
  ANSWER_HELP: 'ANSWER_HELP',
  ANSWER_ORDINAL: 'ANSWER_ORDINAL',
  ANSWER_SKIP: 'ANSWER_SKIP',
  ASK_QUESTION: 'ASK_QUESTION',
  CHANGE_CATEGORY_DIFFICULTY: 'CHANGE_CATEGORY_DIFFICULTY',
  FINALIZE_SETUP: 'FINALIZE_SETUP',
  GENERIC_NO_MATCH_1: 'GENERIC_NO_MATCH_1',
  GENERIC_NO_MATCH_2: 'GENERIC_NO_MATCH_2',
  GENERIC_NO_MATCH_MAX: 'GENERIC_NO_MATCH_MAX',
  GENERIC_NO_INPUT_1: 'GENERIC_NO_INPUT_1',
  GENERIC_NO_INPUT_2: 'GENERIC_NO_INPUT_2',
  GENERIC_NO_INPUT_MAX: 'GENERIC_NO_INPUT_MAX',
  GIVE_SCORE: 'GIVE_SCORE',
  ASK_PLAY_AGAIN: 'ASK_PLAY_AGAIN',
  PLAY_AGAIN_REPEAT: 'PLAY_AGAIN_REPEAT',
  PLAY_AGAIN_YES: 'PLAY_AGAIN_YES',
  PLAY_AGAIN_NO: 'PLAY_AGAIN_NO',
  PROMPT_CATEGORY: 'PROMPT_CATEGORY',
  PROMPT_DIFFICULTY: 'PROMPT_DIFFICULTY',
  QUESTION_REPEAT: 'QUESTION_REPEAT',
  QUIT_CONFIRMATION: 'QUIT_CONFIRMATION',
  QUIT_NO: 'QUIT_NO',
  QUIT_REPEAT: 'QUIT_REPEAT',
  QUIT_YES: 'QUIT_YES',
  RESTART_CONFIRMATION: 'RESTART_CONFIRMATION',
  RESTART_NO: 'RESTART_NO',
  RESTART_REPEAT: 'RESTART_REPEAT',
  RESTART_YES: 'RESTART_YES',
  ROUND_END: 'ROUND_END',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SETUP_QUIZ: 'SETUP_QUIZ',
  WELCOME: 'WELCOME',
};

/**
 * ConversationV3 types.
 * @readonly
 */
const Type = {
  ANSWER: 'answer',
  COUNT: 'count',
};

/**
 * Enumerators used for answer type.
 * @readonly
 */
const Answer = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
};

/**
 * Spreadsheet tab Types
 * Array: each row is an independent doc
 * Dictionary: rows are grouped together by a key column
 * @readonly
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Type override mode
 * @readonly
 */
const TypeOverrideMode = {
  TYPE_MERGE: 'TYPE_MERGE',
  TYPE_REPLACE: 'TYPE_REPLACE',
  TYPE_UNSPECIFIED: 'TYPE_UNSPECIFIED',
};

/**
 * Validation schema types
 * @readonly
 */
const SchemaType = {
  CUSTOM: 'CUSTOM',
  BOOLEAN: 'BOOLEAN',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  SSML: 'SSML',
  STRING: 'STRING',
  STRING_LIST: 'STRING_LIST',
  IMAGE: 'IMAGE',
  URL: 'URL',
  URL_LIST: 'URL_LIST',
  GOOGLE_FONT: 'GOOGLE_FONT',
  COLOR_HEX: 'COLOR_HEX',
  DATE: 'DATE',
};

/**
 * Alias keys for Firestore documents. Fulfillment will refer fetched doc by alias keys.
 * @readonly
 */
const Alias = {
  QUIZ_Q_A: {
    QUESTION: 'question',
    CORRECT_ANSWER: 'correctAnswer',
    INCORRECT_ANSWER_1: 'incorrectAnswer1',
    INCORRECT_ANSWER_2: 'incorrectAnswer2',
    FOLLOW_UP: 'followUp',
    DIFFICULTY: 'difficulty',
    CATEGORY: 'category',
  },
  QUIZ_SETTINGS: {
    TITLE: 'title',
    QUESTIONS_PER_GAME: 'questionsPerGame',
    PERSONALITY: 'personality',
    AUDIO_DING: 'audioDing',
    AUDIO_GAME_INTRO: 'audioGameIntro',
    AUDIO_GAME_OUTRO: 'audioGameOutro',
    AUDIO_CORRECT: 'audioCorrect',
    AUDIO_INCORRECT: 'audioIncorrect',
    AUDIO_ROUND_END: 'audioRoundEnd',
    AUDIO_CALCULATING: 'audioCalculating',
    RANDOMIZE_QUESTIONS: 'randomizeQuestions',
    GOOGLE_ANALYTICS_TRACKING_ID: 'googleAnalyticsTrackingId',
    QUIT_PROMPT: 'quitPrompt',
    DIFFICULTY_OR_GRADE_LEVEL_PROMPT: 'difficultyOrGradeLevelPrompt',
    DEFAULT_DIFFICULTY_OR_GRADE_LEVEL: 'defaultDifficultyOrGradeLevel',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1: 'difficultyOrGradeLevelSuggestionChip1',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2: 'difficultyOrGradeLevelSuggestionChip2',
    DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3: 'difficultyOrGradeLevelSuggestionChip3',
    CATEGORY_OR_TOPIC_PROMPT: 'categoryOrTopicPrompt',
    FIRST_CHOICE: 'firstChoice',
    SECOND_CHOICE: 'secondChoice',
    DEFAULT_CATEGORY_OR_TOPIC: 'defaultCategoryOrTopic',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1: 'categoryOrTopicSuggestionChip1',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2: 'categoryOrTopicSuggestionChip2',
    CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3: 'categoryOrTopicSuggestionChip3',
  },
};

/**
 * General prompts choices.
 * @readonly
 */
const Prompt = {
  GREETING_PROMPTS_1: '$resources.strings.main.GREETING_PROMPTS_1',
  GREETING_PROMPTS_2: '$resources.strings.main.GREETING_PROMPTS_2',
  TRUE_FALSE_PROMPTS: '$resources.strings.main.TRUE_FALSE_PROMPTS',
  STOP_PROMPTS: '$resources.strings.main.STOP_PROMPTS',
  RE_PROMPT: '$resources.strings.main.RE_PROMPT',
  WRONG_ANSWER_FOR_QUESTION_PROMP: '$resources.strings.main.WRONG_ANSWER_FOR_QUESTION_PROMP',
  QUIT_PROMPTS: '$resources.strings.main.QUIT_PROMPTS',
  PLAY_AGAIN_QUESTION_PROMPTS: '$resources.strings.main.PLAY_AGAIN_QUESTION_PROMPTS',
  FALLBACK_PROMPT_1: '$resources.strings.main.FALLBACK_PROMPT_1',
  DEEPLINK_PROMPT: '$resources.strings.main.DEEPLINK_PROMPT',
  FALLBACK_PROMPT_2: '$resources.strings.main.FALLBACK_PROMPT_2',
  RAPID_REPROMPTS: '$resources.strings.main.RAPID_REPROMPTS',
  REPEAT_PROMPTS: '$resources.strings.main.REPEAT_PROMPTS',
  RESTART_CONFIRMATION: '$resources.strings.main.RESTART_CONFIRMATION',
  RESTART_YES: '$resources.strings.main.RESTART_YES',
  SKIP_PROMPTS: '$resources.strings.main.SKIP_PROMPTS',
  FEELING_LUCKY_PROMPTS: '$resources.strings.main.FEELING_LUCKY_PROMPTS',
  CORRECT_ANSWER_PROMPTS: '$resources.strings.main.CORRECT_ANSWER_PROMPTS',
  CORRECT_ANSWER_ONLY_PROMPTS: '$resources.strings.main.CORRECT_ANSWER_ONLY_PROMPTS',
  RIGHT_ANSWER_PROMPTS_1: '$resources.strings.main.RIGHT_ANSWER_PROMPTS_1',
  RIGHT_ANSWER_PROMPTS_2: '$resources.strings.main.RIGHT_ANSWER_PROMPTS_2',
  WRONG_ANSWER_PROMPTS_1: '$resources.strings.main.WRONG_ANSWER_PROMPTS_1',
  HINT_PROMPTS: '$resources.strings.main.HINT_PROMPTS',
  DISAGREE_PROMPTS: '$resources.strings.main.DISAGREE_PROMPTS',
  WRONG_ANSWER_PROMPTS_2: '$resources.strings.main.WRONG_ANSWER_PROMPTS_2',
  GAME_OVER_PROMPTS_1: '$resources.strings.main.GAME_OVER_PROMPTS_1',
  GAME_OVER_PROMPTS_2: '$resources.strings.main.GAME_OVER_PROMPTS_2',
  NONE_CORRECT_PROMPTS: '$resources.strings.main.NONE_CORRECT_PROMPTS',
  SOME_CORRECT_PROMPTS: '$resources.strings.main.SOME_CORRECT_PROMPTS',
  ALL_CORRECT_PROMPTS: '$resources.strings.main.ALL_CORRECT_PROMPTS',
  SAY_NUMBER_PROMPTS: '$resources.strings.main.SAY_NUMBER_PROMPTS',
  YOUR_SCORE_PROMPTS: '$resources.strings.main.YOUR_SCORE_PROMPTS',
  END_PROMPTS: '$resources.strings.main.END_PROMPTS',
  HELP_PROMPTS: '$resources.strings.main.HELP_PROMPTS',
  INTRODUCTION_PROMPTS: '$resources.strings.main.INTRODUCTION_PROMPTS',
  QUESTIONS_COUNT_PROMPTS: '$resources.strings.main.QUESTIONS_COUNT_PROMPTS',
  LETS_PLAY_PROMPTS: '$resources.strings.main.LETS_PLAY_PROMPTS',
  ROUND_PROMPTS: '$resources.strings.main.ROUND_PROMPTS',
  QUESTION_PROMPTS: '$resources.strings.main.QUESTION_PROMPTS',
  FIRST_ROUND_PROMPTS: '$resources.strings.main.FIRST_ROUND_PROMPTS',
  FINAL_ROUND_PROMPTS: '$resources.strings.main.FINAL_ROUND_PROMPTS',
  NO_INPUT_PROMPTS: '$resources.strings.main.NO_INPUT_PROMPTS',
  NO_INPUT_PROMPTS_1: '$resources.strings.main.NO_INPUT_PROMPTS_1',
  NO_INPUT_PROMPTS_2: '$resources.strings.main.NO_INPUT_PROMPTS_2',
  NO_INPUT_PROMPTS_3: '$resources.strings.main.NO_INPUT_PROMPTS_3',
  NEXT_QUESTION_PROMPTS: '$resources.strings.main.NEXT_QUESTION_PROMPTS',
  FORCED_SELECTION_PROMPTS: '$resources.strings.main.FORCED_SELECTION_PROMPTS',
  SELECTION_CONFIRMATION_PROMPTS: '$resources.strings.main.SELECTION_CONFIRMATION_PROMPTS',
  MISC_PROMPTS_YES: '$resources.strings.main.MISC_PROMPTS_YES',
  MISC_PROMPTS_NO: '$resources.strings.main.MISC_PROMPTS_NO',
  MISC_PROMPTS_TRUE: '$resources.strings.main.MISC_PROMPTS_TRUE',
  MISC_PROMPTS_FALSE: '$resources.strings.main.MISC_PROMPTS_FALSE',
  MISC_PROMPTS_MORE: '$resources.strings.main.MISC_PROMPTS_MORE',
  MISC_PROMPTS_STOP_PLAYING: '$resources.strings.main.MISC_PROMPTS_STOP_PLAYING',
  MISC_PROMPTS_PLAY_AGAIN: '$resources.strings.main.MISC_PROMPTS_PLAY_AGAIN',
  MISC_PROMPTS_OR: '$resources.strings.main.MISC_PROMPTS_OR',
  PLAY_AGAIN_CATEGORY_DIFFICULTY: '$resources.strings.main.PLAY_AGAIN_CATEGORY_DIFFICULTY',
  SWITCH_PROMPTS: '$resources.strings.main.SWITCH_PROMPTS',
  LAST_CATEGORY_DIFFICULTY_PROMPT: '$resources.strings.main.LAST_CATEGORY_DIFFICULTY_PROMPT',
};

module.exports = {
  Action,
  Type,
  Answer,
  TabType,
  TypeOverrideMode,
  SchemaType,
  Alias,
  Prompt,
};
