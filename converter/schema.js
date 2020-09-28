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

/**
 * @fileoverview Schema constants for Trivia Quiz data sheet.
 */

/**
 * Spreadsheet tab Types
 * ARRAY: each row is an independent doc
 * DICTIONARY: rows are grouped together by a key column
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Converted output type
 */
const OutputType = {
  JSON: 'json',
  YAML: 'yaml',
};

/**
 * Spreadsheet tab definitions
 */
const Tab = {
  QUIZ_Q_A: {
    name: 'quiz_q_a',
    displayName: 'Questions & Answers',
    type: TabType.ARRAY,
    outputType: OutputType.JSON,
    excludeRows: [1, 2, 3, 4, 5, 6],
    columns: [
      {
        name: 'question',
        displayName: 'Question',
        isRequired: true,
      },
      {
        name: 'correct_answer',
        displayName: 'Correct Answer',
        isRequired: true,
        isRepeated: true,
      },
      {
        name: 'incorrect_answer_1',
        displayName: 'Incorrect Answer 1',
        isRequired: true,
        isRepeated: true,
      },
      {
        name: 'incorrect_answer_2',
        displayName: 'Incorrect Answer 2',
        isRepeated: true,
      },
      {
        name: 'follow_up',
        displayName: 'Follow Up',
      },
      {
        name: 'difficulty',
        displayName: 'Difficulty/Grade Level',
      },
      {
        name: 'category',
        displayName: 'Category/Topic',
      },
    ],
  },
  QUIZ_SETTINGS: {
    name: 'quiz_settings',
    displayName: 'Configuration',
    type: TabType.DICTIONARY,
    outputType: OutputType.JSON,
    excludeRows: [1, 2, 3, 4, 5, 6],
    columns: [
      {
        name: 'parameter_name',
        displayName: 'Key',
        isKey: true,
      },
      {
        name: 'value',
        displayName: 'Value',
        isRequired: ['title', 'questions_per_game'],
        isRepeated: [
          'audio_ding',
          'audio_game_intro',
          'audio_game_outro',
          'audio_correct',
          'audio_incorrect',
          'audio_round_end',
          'audio_calculating',
        ],
      },
    ],
    keys: [
      {
        name: 'title',
        displayName: 'Title',
      },
      {
        name: 'questions_per_game',
        displayName: 'QuestionsPerGame',
      },
      {
        name: 'personality',
        displayName: 'Personality',
      },
      {
        name: 'audio_ding',
        displayName: 'AudioDing',
      },
      {
        name: 'audio_game_intro',
        displayName: 'AudioGameIntro',
      },
      {
        name: 'audio_game_outro',
        displayName: 'AudioGameOutro',
      },
      {
        name: 'audio_correct',
        displayName: 'AudioCorrect',
      },
      {
        name: 'audio_incorrect',
        displayName: 'AudioIncorrect',
      },
      {
        name: 'audio_round_end',
        displayName: 'AudioRoundEnd',
      },
      {
        name: 'audio_calculating',
        displayName: 'AudioCalculating',
      },
      {
        name: 'randomize_questions',
        displayName: 'RandomizeQuestions',
      },
      {
        name: 'google_analytics_tracking_id',
        displayName: 'GoogleAnalyticsTrackingId',
      },
      {
        name: 'quit_prompt',
        displayName: 'QuitPrompt',
      },
      {
        name: 'difficulty_or_grade_level_prompt',
        displayName: 'DifficultyOrGradeLevelPrompt',
      },
      {
        name: 'default_difficulty_or_grade_level',
        displayName: 'DefaultDifficultyOrGradeLevel',
      },
      {
        name: 'difficulty_or_grade_level_suggestion_chip_1',
        displayName: 'DifficultyOrGradeLevelSuggestionChip1',
      },
      {
        name: 'difficulty_or_grade_level_suggestion_chip_2',
        displayName: 'DifficultyOrGradeLevelSuggestionChip2',
      },
      {
        name: 'difficulty_or_grade_level_suggestion_chip_3',
        displayName: 'DifficultyOrGradeLevelSuggestionChip3',
      },
      {
        name: 'category_or_topic_prompt',
        displayName: 'CategoryOrTopicPrompt',
      },
      {
        name: 'first_choice',
        displayName: 'FirstChoice',
      },
      {
        name: 'second_choice',
        displayName: 'SecondChoice',
      },
      {
        name: 'default_category_or_topic',
        displayName: 'DefaultCategoryOrTopic',
      },
      {
        name: 'category_or_topic_suggestion_chip_1',
        displayName: 'CategoryOrTopicSuggestionChip1',
      },
      {
        name: 'category_or_topic_suggestion_chip_2',
        displayName: 'CategoryOrTopicSuggestionChip2',
      },
      {
        name: 'category_or_topic_suggestion_chip_3',
        displayName: 'CategoryOrTopicSuggestionChip3',
      },
    ],
  },
};

module.exports = {
  TabType,
  OutputType,
  Tab,
};
