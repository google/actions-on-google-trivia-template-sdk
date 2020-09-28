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
 * @module util/common
 * @desc Utility functions for common helpers.
 */

/**
 * Returns whatever value is passed as the argument.
 * @template T
 * @param {T} val - Input value.
 * @return {T} - Identical to input value.
 * @static
 */
const identity = (val) => val;

/**
 * Returns a random integer between 0 and upper limit (exclusive).
 * @param {number} upperLimit - Upper limit for integer choices.
 * @return {number} - Random integer.
 * @static
 */
const randomInteger = (upperLimit) => Math.floor(Math.random() * upperLimit);

module.exports = {
  identity,
  randomInteger,
};
