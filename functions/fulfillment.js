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

const {Suggestion} = require('@assistant/conversation');

const util = require('./util');
const config = require('./config.js');
const {Action, Answer, Alias, Prompt, Type} = require('./constant.js');

/**
 * Fulfillment class to handle supported ConversationV3 actions.
 */
class Fulfillment {
  /**
   * @return {Fulfillment}
   */
  static create() {
    return new Fulfillment();
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.SETUP_QUIZ](conv) {
    const defaultParams = conv.$helper.getDefaultSessionParams();
    conv.session.params = {...conv.session.params, ...defaultParams};
    const quizSettings = conv.$helper.getQuizSettings();
    conv.$helper.updateSessionParamsQuizSettings(quizSettings);
    const convSettings = conv.session.params.quizSettings;

    conv.session.params.title = convSettings[Alias.QUIZ_SETTINGS.TITLE];
    conv.session.params.hasCategory = !!(
      convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1] &&
      convSettings[Alias.QUIZ_SETTINGS.DEFAULT_CATEGORY_OR_TOPIC] &&
      convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_PROMPT]
    );

    conv.session.params.hasDifficulty = !!(
      convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1] &&
      convSettings[Alias.QUIZ_SETTINGS.DEFAULT_DIFFICULTY_OR_GRADE_LEVEL] &&
      convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_PROMPT]
    );

    if (conv.session.params.isReplay) {
      conv.session.params.category = null;
      conv.session.params.difficulty = null;
      conv.session.params.setCategory = false;
      conv.session.params.setDifficulty = false;
    }
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.WELCOME](conv) {
    if (!conv.session.params.isReplay) {
      const introAudioUrl = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO);
      let greetings = Prompt.GREETING_PROMPTS_1;
      if (conv.user.lastSeenTime) greetings = Prompt.GREETING_PROMPTS_2;
      conv.add(util.ssml.merge([introAudioUrl, greetings]));
    }
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PROMPT_CATEGORY](conv) {
    const convSettings = conv.session.params.quizSettings;
    const responses = [convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_PROMPT]];
    const chip1 = convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_1];
    const chip2 = convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_2];
    const chip3 = convSettings[Alias.QUIZ_SETTINGS.CATEGORY_OR_TOPIC_SUGGESTION_CHIP_3];

    const availableChips = [chip1, chip2, chip3].filter(Boolean);
    const suggestions = conv.$helper.getRichSuggestions(...availableChips);

    if (!conv.device.capabilities.includes('RICH_RESPONSE')) {
      const suggestionsTts = conv.$helper.getSuggestionTts(suggestions);
      responses.push(suggestionsTts);
    }

    conv.$helper.setupSessionTypeAndSpeechBiasing(...availableChips.map((chip) => [chip]));

    conv.add(util.ssml.merge(responses));
    conv.add(...suggestions);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PROMPT_DIFFICULTY](conv) {
    const convSettings = conv.session.params.quizSettings;
    const responses = [convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_PROMPT]];
    const chip1 = convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_1];
    const chip2 = convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_2];
    const chip3 = convSettings[Alias.QUIZ_SETTINGS.DIFFICULTY_OR_GRADE_LEVEL_SUGGESTION_CHIP_3];

    const availableChips = [chip1, chip2, chip3].filter(Boolean);
    const suggestions = conv.$helper.getRichSuggestions(...availableChips);

    if (!conv.device.capabilities.includes('RICH_RESPONSE')) {
      const suggestionsTts = conv.$helper.getSuggestionTts(suggestions);
      responses.push(suggestionsTts);
    }

    conv.$helper.setupSessionTypeAndSpeechBiasing(...availableChips.map((chip) => [chip]));

    conv.add(util.ssml.merge(responses));
    conv.add(...suggestions);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.SET_CATEGORY](conv) {
    conv.session.params.category = conv.intent.params.category.resolved;
    conv.session.params.selection = conv.session.params.category;
    conv.session.params.setCategory = true;

    conv.add(Prompt.SELECTION_CONFIRMATION_PROMPTS);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.SET_DIFFICULTY](conv) {
    conv.session.params.difficulty = conv.intent.params.difficulty.resolved;
    conv.session.params.selection = conv.session.params.difficulty;
    conv.session.params.setDifficulty = true;

    conv.add(Prompt.SELECTION_CONFIRMATION_PROMPTS);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.FINALIZE_SETUP](conv) {
    conv.session.params.difficulty = (
      conv.session.params.difficulty || config.DEFAULT_DIFFICULTY
    ).toLowerCase();
    conv.session.params.category = (
      conv.session.params.category || config.DEFAULT_CATEGORY
    ).toLowerCase();
    const initQuizState = conv.$helper.initSessionState(
      conv.session.params.quizSettings[Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME]
    );
    conv.session.params = {...conv.session.params, ...initQuizState};
  }

  /**
   * @param {ConversationV3} conv
   * @param {string} transition
   */
  [Action.ASK_QUESTION](conv, transition) {
    const isRepeat = conv.session.params.isRepeat;
    conv.session.params.isRepeat = false;
    let transitionPrompt = util.ssml.merge([Prompt.LETS_PLAY_PROMPTS, Prompt.FIRST_ROUND_PROMPTS]);
    if (!isRepeat && conv.session.params.count > 0) {
      transitionPrompt =
        conv.session.params.count < conv.session.params.limit - 1
          ? Prompt.NEXT_QUESTION_PROMPTS
          : Prompt.FINAL_ROUND_PROMPTS; // Last question
    } else if (isRepeat) {
      transitionPrompt = Prompt.REPEAT_PROMPTS;
    }

    const question = conv.$helper.getCurrentQuestion();
    const questionStr = question.question;

    const responses = [transitionPrompt, Prompt.ROUND_PROMPTS, questionStr];
    if (transition) responses.unshift(transition);

    conv.session.params.suggestions = isRepeat
      ? conv.session.params.suggestions
      : util.array.shuffle(conv.$helper.getQuestionSuggestions());

    if (!conv.device.capabilities.includes('RICH_RESPONSE')) {
      const suggestionsTts = conv.$helper.getSuggestionTts(conv.session.params.suggestions);
      responses.push(suggestionsTts);
    }
    responses.push(conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_DING));

    conv.session.params.currentQuestion = question;
    conv.session.params.correctAnswer = question[Alias.QUIZ_Q_A.CORRECT_ANSWER][0];

    const correctAns = question[Alias.QUIZ_Q_A.CORRECT_ANSWER];
    const incorrectAns1 = question[Alias.QUIZ_Q_A.INCORRECT_ANSWER_1];
    const incorrectAns2 = question[Alias.QUIZ_Q_A.INCORRECT_ANSWER_2];
    conv.$helper.setupSessionTypeAndSpeechBiasing(correctAns, incorrectAns1, incorrectAns2);

    const richSuggestions = conv.$helper.getRichSuggestions(...conv.session.params.suggestions);

    conv.add(util.ssml.merge(responses));
    conv.add(...richSuggestions);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUESTION_REPEAT](conv) {
    conv.session.params.isRepeat = true;
    this[Action.ASK_QUESTION](conv);
  }

  /**
   * @param {ConversationV3} conv
   * @param {string} [answer]
   */
  [Action.ANSWER](conv, answer) {
    if (conv.session.params.isSkip) {
      conv.session.params.isSkip = false;
      conv.add(Prompt.SKIP_PROMPTS);
      return;
    }

    answer = answer || conv.$helper.getAndClearUserAnswer();

    const question = conv.$helper.getCurrentQuestion();

    conv.session.params.count++;
    conv.session.params.questionNumber++;

    const correctAns = question[Alias.QUIZ_Q_A.CORRECT_ANSWER][0];
    let isCorrect = String(answer).toLowerCase() === String(correctAns).toLowerCase();

    const audioCalculating = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_CALCULATING);
    const responses = [audioCalculating];

    if (isCorrect) {
      conv.session.params.correctCount++;

      const audioCorrect = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_CORRECT);
      const rightAnswer1 = Prompt.RIGHT_ANSWER_PROMPTS_1;
      const rightAnswer2 = Prompt.RIGHT_ANSWER_PROMPTS_2;
      responses.push(audioCorrect, rightAnswer1, rightAnswer2);
    } else {
      const audioIncorrect = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_INCORRECT);
      const wrongAnswer1 = Prompt.WRONG_ANSWER_PROMPTS_1;
      const wrongAnswer2 = Prompt.WRONG_ANSWER_PROMPTS_2;
      responses.push(audioIncorrect, wrongAnswer1, wrongAnswer2);
    }
    const followUp = question[Alias.QUIZ_Q_A.FOLLOW_UP];
    if (followUp) responses.push(followUp);
    conv.add(util.ssml.merge(responses));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_ORDINAL](conv) {
    if (!conv.intent.params[Type.COUNT] || !conv.intent.params[Type.COUNT].resolved) {
      this[Action.ANSWER_NO_MATCH_1](conv);
      return;
    }
    const ordinals = {
      [Answer.FIRST]: conv.session.params.suggestions[0],
      [Answer.SECOND]: conv.session.params.suggestions[1],
      [Answer.THIRD]: conv.session.params.suggestions[2] || conv.session.params.suggestions[1],
    };
    this[Action.ANSWER](conv, ordinals[conv.intent.params[Type.COUNT].resolved]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ROUND_END](conv) {
    const gameOverPrompt1 = Prompt.GAME_OVER_PROMPTS_1;
    const gameOverPrompt2 = Prompt.GAME_OVER_PROMPTS_2;

    let prompt;
    const score = parseInt(conv.session.params.correctCount);
    if (score === 0) {
      prompt = Prompt.NONE_CORRECT_PROMPTS;
    } else if (score === conv.session.params.limit) {
      prompt = Prompt.ALL_CORRECT_PROMPTS;
    } else {
      prompt = Prompt.SOME_CORRECT_PROMPTS;
    }
    const audioRoundEnd = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_ROUND_END);
    const responses = [audioRoundEnd, gameOverPrompt1, gameOverPrompt2, prompt];
    conv.add(util.ssml.merge(responses));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GIVE_SCORE](conv) {
    conv.session.params.isRepeat = true;
    this[Action.ASK_QUESTION](conv, Prompt.YOUR_SCORE_PROMPTS);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_HELP](conv) {
    conv.add(Prompt.HELP_PROMPTS);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_SKIP](conv) {
    conv.session.params.count++;
    conv.session.params.questionNumber++;
    conv.session.params.isSkip = true;
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.RESTART_CONFIRMATION](conv) {
    conv.add(Prompt.RESTART_CONFIRMATION);
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_YES}));
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_NO}));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.RESTART_YES](conv) {
    conv.session.params.isReplay = true;
    conv.add(Prompt.RESTART_YES);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.RESTART_NO](conv) {
    conv.session.params.isRepeat = true;
    this[Action.QUIT_NO](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.RESTART_REPEAT](conv) {
    this[Action.RESTART_CONFIRMATION](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ASK_PLAY_AGAIN](conv) {
    conv.add(Prompt.PLAY_AGAIN_QUESTION_PROMPTS);
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_YES}));
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_NO}));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PLAY_AGAIN_YES](conv) {
    conv.session.params.isReplay = true;
    conv.session.params.count = 0;
    conv.session.params.questionNumber = 1;
    conv.session.params.correctCount = 0;

    conv.add(Prompt.RE_PROMPT);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PLAY_AGAIN_NO](conv) {
    this[Action.QUIT_YES](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PLAY_AGAIN_REPEAT](conv) {
    this[Action.ASK_PLAY_AGAIN](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUIT_CONFIRMATION](conv) {
    conv.add(Prompt.STOP_PROMPTS);
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_YES}));
    conv.add(new Suggestion({title: Prompt.MISC_PROMPTS_NO}));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUIT_YES](conv) {
    const audioGameOutro = conv.$helper.getAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO);
    const customQuitPrompt = conv.session.params.quizSettings[Alias.QUIZ_SETTINGS.QUIT_PROMPT];
    const quitPrompt = customQuitPrompt || Prompt.QUIT_PROMPTS;
    conv.add(util.ssml.merge([quitPrompt, audioGameOutro]));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUIT_NO](conv) {
    conv.add(Prompt.RE_PROMPT);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUIT_REPEAT](conv) {
    this[Action.QUIT_CONFIRMATION](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_MATCH_1](conv) {
    conv.add(Prompt.RAPID_REPROMPTS);
  }
  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_MATCH_2](conv) {
    conv.add(Prompt.RAPID_REPROMPTS);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_MATCH_MAX](conv) {
    conv.add(Prompt.FALLBACK_PROMPT_2);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_INPUT_1](conv) {
    conv.add(Prompt.NO_INPUT_PROMPTS_1);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_INPUT_2](conv) {
    conv.add(Prompt.NO_INPUT_PROMPTS_2);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.GENERIC_NO_INPUT_MAX](conv) {
    conv.add(Prompt.NO_INPUT_PROMPTS_3);
  }
}

module.exports = Fulfillment;
