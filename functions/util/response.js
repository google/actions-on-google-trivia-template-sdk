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

const {sprintf} = require('sprintf-js');

const ssml = require('./ssml.js');

/**
 * mergeSimple arguments.
 * @typedef {Array} MergeSimpleArgs
 * @property {Array<Simple>} 0 - Simple responses.
 * @property {number} 1 - Break time in milliseconds.
 */

/**
 * @module util/response
 * @desc Utility functions for simple response.
 */

/**
 * Converts a prompt document to Simple Response shape, which has text and speech properties.
 * Sets speech property to text value if speech field is not found in prompt document.
 * @param {Object} doc - Prompt document.
 * @param {string} textKey - Field name that maps to text value.
 * @param {string} speechKey - Field name that maps to speech value.
 * @return {Simple} - Simple response object.
 * @static
 */
const toSimple = (doc, textKey, speechKey) => ({
  text: doc[textKey] || '',
  speech: ssml.clean(doc[speechKey] || doc[textKey] || ''),
});

/**
 * Merges multiple simple responses into a single simple response.
 * Two function signatures:
 *  1. mergeSimpleResponses(respA, respB, respC)
 *  2. mergeSimpleResponses([respA, respB, respC], breakTime)
 * @param {Array<Simple>|MergeSimpleArgs} args - Simple responses or
 *    simple response and breakTime tuple.
 * @return {Simple} - Merged simple response object.
 * @static
 */
const mergeSimple = (...args) => {
  let responses = args;
  let breakTime;
  if (Array.isArray(args[0]) && typeof args[1] === 'number') {
    responses = args[0];
    breakTime = args[1];
  }
  const speeches = responses.map((res) => res.speech);
  const texts = responses.map((res) => res.text.trim());
  return {
    speech: ssml.merge(speeches, breakTime),
    text: texts.join(' ').trim(),
  };
};

/**
 * Constructs simple response object shape with formatting arguments.
 * @param {Simple} response - SimpleResponse with placeholders marked by %s.
 * @param {FormatArgs} args - Arguments options for speech and text placeholders.
 * @return {Simple} - Simple response with formatted speech and text props.
 * @static
 */
const formatSimple = (response, {speechArgs = [], textArgs = []} = {}) => ({
  speech: ssml.clean(sprintf(response.speech, ...speechArgs)),
  text: sprintf(response.text, ...textArgs),
});

module.exports = {
  toSimple,
  mergeSimple,
  formatSimple,
};
