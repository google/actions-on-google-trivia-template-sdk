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

const common = require('./common.js');

/**
 * @module util/array
 * @desc Utility functions for array.
 */

/**
 * Gets a random element from an array.
 * @template T
 * @param {Array<T>} array - The array to retrieve an element from.
 * @return {T} - The random element retrieved from the array.
 * @static
 */
const randomPick = (array) => array[common.randomInteger(array.length)];

/**
 * Pops a random element from an array.
 * @template T
 * @param {Array<T>} array - The array to pop a random element from.
 * @return {T} - The random element popped from the array.
 * @static
 */
const randomPop = (array) => {
  if (!array.length) {
    return null;
  }
  swap(array, common.randomInteger(array.length), array.length - 1);
  return array.pop();
};

/**
 * Swaps two elements in an array.
 * @param {Array} array - Array to perform swap.
 * @param {number} i - First index position.
 * @param {number} j - Second index position.
 * @static
 */
const swap = (array, i, j) => {
  if (i !== j) {
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Shuffles array in place.
 * @template T
 * @param {Array<T>} array - Array to perform shuffle.
 * @return {Array<T>} - Shuffled input array.
 * @static
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = common.randomInteger(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = {
  randomPick,
  randomPop,
  swap,
  shuffle,
};
