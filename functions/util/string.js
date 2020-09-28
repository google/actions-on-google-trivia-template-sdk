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

const emojiRegex = require('./emoji-regex.js');

/**
 * @module util/string
 * @desc Utility functions for string.
 */

/**
 * Fast string hashing function.
 * @param {string} str - String input.
 * @return {number} - Hash value.
 * @static
 */
const hash = (str) => {
  let value = 5381;
  let i = str.length;
  while (i) {
    value = (value * 33) ^ str.charCodeAt(--i);
  }
  return value >>> 0;
};

/**
 * Converts string value to one of types (string, boolean, number).
 * Truthy boolean type raw value has to 'TRUE' (case-insensitive).
 * @param {string} val - String value.
 * @param {string} type - One of (string, boolean, number).
 * @return {string|number|boolean} - Value in converted type.
 * @static
 */
const convertType = (val, type) => {
  if (type === 'boolean') {
    return ['TRUE', 'YES'].includes(String(val).toUpperCase());
  }
  return type === 'number' ? Number(val) : String(val);
};

/**
 * Concatenates a list of messages into a single string.
 * @param {Array<string>} messages - The messages to concat.
 * @return {string} - The concatenated messages.
 * @static
 */
const concat = (...messages) => messages.map((message) => message.trim()).join(' ');

/**
 * Converts a snake_case string to camelCase.
 * @param {string} str - snake_case string.
 * @return {string} - camelCase string.
 * @static
 */
const snakeToCamelCase = (str) => str.toLowerCase().replace(/(_\w)/g, (m) => m[1].toUpperCase());

/**
 * Returns a new string with all matches of a pattern replaced by a replacement,
 * following the same capitalization scheme.
 * @param {string} sentence - Original sentence.
 * @param {string} pattern - String to be replaced.
 * @param {string} replacement - New string to replace matched pattern.
 * @return {string} - New sentence.
 * @static
 */
const replaceAll = (sentence, pattern, replacement) =>
  sentence.replace(new RegExp(escapeRegExp(pattern), 'gi'), (match) =>
    match[0] === pattern[0].toUpperCase()
      ? replacement[0].toUpperCase() + replacement.slice(1)
      : replacement
  );

/**
 * Escapes strings for RegExp constructor.
 * @param {string} str - String to escape.
 * @return {string} - Escaped string.
 * @static
 */
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Strips emoji characters from a string.
 * @param {string} str - String to strip emoji.
 * @return {string} - String with emoji characters removed.
 * @static
 */
const stripEmoji = (str) => str.replace(emojiRegex, '');

module.exports = {
  hash,
  convertType,
  concat,
  snakeToCamelCase,
  replaceAll,
  escapeRegExp,
  stripEmoji,
  emojiRegex,
};
