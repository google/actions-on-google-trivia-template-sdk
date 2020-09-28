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

const config = require('../config');
const {TtsMark} = require('../constant.js');
const stringUtil = require('./string.js');

/**
 * @module util/ssml
 * @desc Utility functions for SSML.
 */

/**
 * Sanitize template literal inputs by escaping characters into XML entities
 * to use in SSML.
 * Also normalize the extra spacing for better text rendering in SSML.
 * A tag function used by ES6 tagged template literals.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 *    /Template_literals#Tagged_template_literals
 *
 * @example
 * const equation = '"1 + 1 > 1"';
 * const response = sanitize`
 *   <speak>
 *     ${equation}
 *   </speak>
 * `;
 * // Equivalent to sanitize`\n  <speak>\n    ${equation}\n  </speak>\n`
 * console.log(response);
 *
 * Prints:
 * `<speak>
 *   &quot;1 + 1 &gt; 1&quot;
 * </speak>`
 * Equivalent to
 * '<speak>\n  &quot;1 + 1 &gt; 1&quot;\n</speak>'
 *
 * @param {TemplateStringsArray} template - Non sanitized constant strings in the template literal.
 * @param {Array<string>} inputs - Computed expressions to be sanitized surrounded by dollar{ }.
 * @return {string} - Sanitized ssml string.
 * @static
 */
const sanitize = (template, ...inputs) => {
  // Generate the raw escaped string
  const raw = template.reduce((out, str, i) => (i ? out + escape(inputs[i - 1]) + str : str), '');
  // Trim out new lines at the start and end but keep indentation
  const trimmed = raw
    .replace(/^\s*\n(\s*)<speak>/, '$1<speak>')
    .replace(/<\/speak>\s+$/, '</speak>');
  // Remove extra indentation
  const lines = trimmed.split('\n');
  const indent = /^\s*/.exec(lines[0])[0];
  const match = new RegExp(`^${indent}`);
  return lines.map((line) => line.replace(match, '')).join('\n');
};

/**
 * Merges ssml strings, encapsulated by <speak>-tags, together.
 * @param {Array<string>} parts - Array of ssml parts.
 * @param {number} breakTime - Break time in milliseconds to insert between parts.
 * @return {string} - Merged ssml string.
 * @static
 */
const merge = (parts, breakTime = config.SSML_BREAK_TIME) => {
  const merged = parts
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join(breakTime > 0 ? ` <break time="${breakTime}ms"/>` : ' ')
    .replace(/<speak>|<\/speak>/gi, '');
  return `<speak>${merged}</speak>`;
};

/**
 * Cleans ssml text by stripping emoji characters and trims extra spaces.
 * If cleaned text is already surrounded by <speak> tag, remove any extra spaces around angle
 * brackets, else escape cleaned text as raw string and add <speak> tag around escaped text.
 * @param {string} text - Input ssml text.
 * @return {string} - Cleaned ssml text.
 * @static
 */
const clean = (text) => {
  const baseCleaned = stringUtil
    .stripEmoji(text)
    .trim()
    .replace(/\s\s+/g, ' ');
  if (baseCleaned === '') {
    return '';
  }
  const bracketsCleaned = baseCleaned.replace(/\s*<\s*/g, '<').replace(/\s*>\s*/g, '>');
  if (bracketsCleaned === '<speak></speak>') {
    return '';
  }
  const hasSpeakTag = bracketsCleaned.startsWith('<speak>') && bracketsCleaned.endsWith('</speak>');
  return hasSpeakTag ? bracketsCleaned : `<speak>${escape(baseCleaned)}</speak>`;
};

/**
 * Escapes any special characters that will cause SSML to be invalid.
 * @param {string} rawText - Raw text to escape.
 * @return {string} - Escaped text.
 * @static
 */
const escape = (rawText) => {
  return String(rawText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

module.exports = {
  sanitize,
  merge,
  clean,
  escape,
};
