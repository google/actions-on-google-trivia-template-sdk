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

const {Suggestion, List} = require('@assistant/conversation');

const config = require('./config');
const util = require('./util');
const {Collection, Schema, Tab} = require('./sheet.js');
const defaultAudios = require('./audio.js');
const {Prompt, Type, Alias, TypeOverrideMode} = require('./constant.js');
const sheetData = require('./sheet-data.js');

/**
 * Helper methods for AoG Conversation conv object.
 */
class ConvHelper {
  /**
   * @param {ConversationV3} conv - ConversationV3 instance.
   */
  constructor(conv) {
    this.conv = conv;
  }

  /**
   * Creates a ConvHelper instance.
   * @param {ConversationV3} conv - ConversationV3 instance.
   * @return {ConvHelper} - ConvHelperV3 instance.
   */
  static create(conv) {
    return new ConvHelper(conv);
  }

  /**
   * Get locale from request info
   * @return {string} - Conv locale
   */
  getLocale() {
    return this.conv.user.locale;
  }

  /**
   * Get default session params for the conversation.
   * @return {Object<string, any>} - Default session params.
   */
  getDefaultSessionParams() {
    return {
      quizSettings: {
        [Alias.QUIZ_SETTINGS.TITLE]: config.TITLE_DEFAULT,
        [Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME]: config.QUESTIONS_PER_GAME_DEFAULT,
        [Alias.QUIZ_SETTINGS.PERSONALITY]: null,
        [Alias.QUIZ_SETTINGS.AUDIO_DING]: [...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_DING]],
        [Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: [
          ...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO],
        ],
        [Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: [
          ...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO],
        ],
        [Alias.QUIZ_SETTINGS.AUDIO_CORRECT]: [...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_CORRECT]],
        [Alias.QUIZ_SETTINGS.AUDIO_INCORRECT]: [
          ...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_INCORRECT],
        ],
        [Alias.QUIZ_SETTINGS.AUDIO_ROUND_END]: [
          ...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_ROUND_END],
        ],
        [Alias.QUIZ_SETTINGS.AUDIO_CALCULATING]: [
          ...defaultAudios[Alias.QUIZ_SETTINGS.AUDIO_CALCULATING],
        ],
        [Alias.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS]: null,
        [Alias.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID]: null,
        [Alias.QUIZ_SETTINGS.QUIT_PROMPT]: null,
        [Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_PROMPT]: null,
        [Alias.QUIZ_SETTINGS.DEFAULT_DIFFICULTY_OR_GRADE_LEVEL]: null,
        [Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1]: null,
        [Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2]: null,
        [Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3]: null,
        [Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_PROMPT]: null,
        [Alias.QUIZ_SETTINGS.FIRST_CHOICE]: null,
        [Alias.QUIZ_SETTINGS.SECOND_CHOICE]: null,
        [Alias.QUIZ_SETTINGS.DEFAULT_CATEGORY_OR_TOPIC]: null,
        [Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1]: null,
        [Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2]: null,
        [Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3]: null,
      },
      count: 0,
      correctCount: 0,
      questionNumber: 1,
      limit: config.MAX_QUESTIONS_PER_QUIZ,
      questions: [],
      category: null,
      difficulty: null,
      setDifficulty: false,
      setCategory: false,
      hasDifficulty: false,
      hasCategory: false,
      isRepeat: false,
      isReplay: false,
      isSkip: false,
      selection: null,
      suggestions: [],
      currentQuestion: null,
      correctAnswer: null,
    };
  }

  /**
   * Loads quiz config settings and validates through FieldSchema.
   * @return {QuizSettings} - Validated quiz config settings.
   */
  getQuizSettings() {
    const collection = Collection.QUIZ_SETTINGS;
    const valueKey = Tab.QUIZ_SETTINGS.valueKey;
    const options = Object.values(Tab.QUIZ_SETTINGS.key);
    const settings = Object.assign(
      {},
      Tab.QUIZ_SETTINGS.default,
      this.loadCompatibleSettings(collection, valueKey, options)
    );
    return util.schema.validateObject(settings, Tab.QUIZ_SETTINGS.schema);
  }

  /**
   * Loads all validated quiz question docs.
   * @return {Array<Question>} - Validated quiz questions docs.
   */
  getAllQuizQuestions() {
    const docs = sheetData.byLocale(this.getLocale())[Collection.QUIZ_Q_A];
    return util.schema.validateCollection(docs, Schema.QUIZ_Q_A);
  }

  /**
   * Loads parameter settings, then filter by matching setting options.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @param {Array<string>} options - Compatible settings options.
   * @return {Object} - Compatible settings object.
   */
  loadCompatibleSettings(collection, valueKey, options) {
    const lowerCaseOptions = new Set(options.map((s) => s.toLowerCase()));
    const hasMatchKey = (_, key) => lowerCaseOptions.has(key.toLowerCase());
    const settings = this.loadSettings(collection, valueKey);
    return util.object.pickBy(settings, hasMatchKey);
  }

  /**
   * Loads parameter settings, then map values to valueKey property of value object.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @return {Object} - Settings object.
   */
  loadSettings(collection, valueKey) {
    const getValueCol = (target) => (util.object.isObject(target) ? target[valueKey] : target);
    const settings = sheetData.byLocale(this.getLocale())[collection];
    return util.object.mapValues(settings, getValueCol);
  }

  /**
   * Updates conv.session.params values with sheet settings for existing keys only.
   * @param {!Object} sheetSettings - Sheet settings to update conv.session.params fields.
   */
  updateSessionParamsQuizSettings(sheetSettings) {
    for (const [key, val] of Object.entries(sheetSettings)) {
      if (this.conv.session.params.quizSettings.hasOwnProperty(key)) {
        this.conv.session.params.quizSettings[key] = val;
      }
    }
  }

  /**
   * Initializes quiz game state for new session.
   * @param {number} questionsPerQuiz - Number of questions per quiz from Quiz Settings.
   * @return {QuizSessionState} - Initialized quiz session state.
   * @static
   */
  initSessionState(questionsPerQuiz) {
    const quizQuestions = this.getAllQuizQuestions();
    const mappedQuestions = this.mapCategoryDifficulty(quizQuestions);
    const category = this.conv.session.params.category;
    const difficulty = this.conv.session.params.difficulty;
    const questions = mappedQuestions[category][difficulty];
    const numberOfQuestions = Math.min(
      questionsPerQuiz,
      questions.length,
      config.MAX_QUESTIONS_PER_QUIZ
    );

    this.conv.session.params.isReplay = false;
    this.conv.session.params.isRepeat = false;

    return {
      count: 0,
      limit: numberOfQuestions,
      correctCount: 0,
      questions: util.array.shuffle(questions).slice(0, numberOfQuestions),
    };
  }

  /**
   * @param {Array<Object>} questions
   * @return {Object}
   */
  mapCategoryDifficulty(questions) {
    const questionMap = {};
    questions.forEach((question) => {
      const category = (this.conv.session.params.hasCategory
        ? question[Alias.QUIZ_Q_A.CATEGORY]
        : config.DEFAULT_CATEGORY
      ).toLowerCase();
      const difficulty = (this.conv.session.params.hasDifficulty
        ? question[Alias.QUIZ_Q_A.DIFFICULTY]
        : config.DEFAULT_DIFFICULTY
      ).toLowerCase();

      questionMap[category] = questionMap[category] || {};
      questionMap[category][difficulty] = questionMap[category][difficulty] || [];
      questionMap[category][difficulty].push(question);
    });
    return questionMap;
  }

  /**
   * get the audio ssml for the given audio type
   * @param {string} audioType - possible values see AUDIO_TYPES
   * @return {string}
   */
  getAudio(audioType) {
    let audioUrl = util.array.randomPick(this.conv.session.params.quizSettings[audioType]);
    if (!audioUrl) {
      audioUrl = util.array.randomPick(defaultAudios[audioType]);
    }
    return `<audio src="${audioUrl}"/>`;
  }

  /**
   * Builds session type and speech biasing for answer type.
   * @param {Array<Array<string>>} entries
   */
  setupSessionTypeAndSpeechBiasing(...entries) {
    const clean = (synonyms) => [...new Set(synonyms.map((s) => util.string.stripEmoji(s).trim()))];
    const cleanedEntries = entries.filter((val) => Array.isArray(val) && val.length).map(clean);

    this.conv.expected.speech = [].concat(...cleanedEntries);

    this.addSessionType(Type.ANSWER, ...cleanedEntries);
  }

  /**
   * Add entry to session type.
   * @param {string} typeName - Session type name.
   * @param {Array<Array<string>>} synonymsEntries - List of synonyms for session type.
   */
  addSessionType(typeName, ...synonymsEntries) {
    const entries = synonymsEntries.map((synonyms) => {
      synonyms = synonyms.map((tokens) => tokens.toLowerCase().trim()).filter(Boolean);
      return {name: synonyms[0], synonyms: [...new Set(synonyms)]};
    });
    const sessionType = {
      name: typeName,
      mode: TypeOverrideMode.TYPE_REPLACE,
      synonym: {entries},
    };
    const index = this.conv.session.typeOverrides.findIndex((ele) => ele.name === sessionType.name);

    if (index === -1) {
      this.conv.session.typeOverrides.push(sessionType);
    } else {
      this.conv.session.typeOverrides[index] = sessionType;
    }
  }

  /**
   * Returns rich response suggestion chip texts for current question.
   * @return {Array<string>} - Rich response suggestion chip texts for current question.
   */
  getQuestionSuggestions() {
    const question = this.getCurrentQuestion();

    return [
      question[Alias.QUIZ_Q_A.CORRECT_ANSWER],
      question[Alias.QUIZ_Q_A.INCORRECT_ANSWER_1],
      question[Alias.QUIZ_Q_A.INCORRECT_ANSWER_2],
    ]
      .filter((val) => Array.isArray(val) && val.length)
      .map((option) => option[0]);
  }

  /**
   * Returns rich response suggestion chip texts for current question.
   * @param {Array<string>} options - Array of options
   * @return {Array<Object>} - Rich response suggestion chip texts for current question.
   */
  getRichSuggestions(...options) {
    options = options.map((option) => util.string.stripEmoji(option).trim());
    if (options.some((answer) => !answer.includes('MISC_PROMPTS') && answer.length > 25)) {
      const items = options.map((option) => ({key: option}));
      this.conv.session.params.listItems = items;
      return [new List({items})];
    }
    // use suggestion chips
    return options.map((option) => new Suggestion({title: option}));
  }

  /**
   * @param {Array<string>} suggestions
   * @return {string}
   */
  getSuggestionTts(suggestions) {
    let ssml = '';
    suggestions.forEach((suggestion, index) => {
      if (index === suggestions.length - 2) {
        ssml += `${suggestion}, ${Prompt.MISC_PROMPTS_OR}`;
      } else if (index === suggestions.length - 1) {
        ssml += suggestion;
      } else {
        ssml += `${suggestion}, `;
      }
    });
    return ssml;
  }

  /**
   * Get UserAnswer and clear it in session params.
   * @return {string} - Captured value of 'answer' type.
   */
  getAndClearUserAnswer() {
    const userAnswer = this.conv.session.params.UserAnswer;
    this.conv.session.params.UserAnswer = null;
    return userAnswer;
  }

  /**
   * Returns the current quiz question.
   * @return {Question} - Current question.
   */
  getCurrentQuestion() {
    const count = this.conv.session.params.count;
    return this.conv.session.params.questions[count];
  }
}

module.exports = ConvHelper;
