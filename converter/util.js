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
 * @fileoverview Common utility functions.
 */

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');

const console = require('./console.js');

/**
 * Read json file into memory.
 * @param {string} filePath - File path.
 * @return {Object} - Parsed data.
 */
const readJsonFile = (filePath) => {
  return jsonfile.readFileSync(filePath);
};

/**
 * Write data to local file in json format.
 * @param {string} filePath - File path.
 * @param {Object} data - Data to write.
 */
const writeJsonFile = (filePath, data) => {
  ensureDirectoryExist(filePath);
  jsonfile.writeFileSync(filePath, data, {
    flag: 'w',
    spaces: 2,
  });
  console.log(`Successfully wrote ${filePath}.`.green);
};

/**
 * Read yaml file into memory.
 * @param {string} filePath - File path.
 * @return {Object} - Parsed data.
 */
const readYamlFile = (filePath) => {
  return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
};

/**
 * Writes data to local file in yaml format.
 * @param {string} filePath - File path.
 * @param {Object} data - Data to write.
 */
const writeYamlFile = (filePath, data) => {
  ensureDirectoryExist(filePath);
  fs.writeFileSync(filePath, yaml.safeDump(data));
  console.log(`Successfully wrote ${filePath}.`.green);
};

/**
 * Recursively creates a directory if the file's directory is missing.
 * @param {string} filePath - File path.
 */
const ensureDirectoryExist = (filePath) => {
  const dirPath = path.dirname(filePath);
  if (fs.existsSync(dirPath)) return;
  ensureDirectoryExist(dirPath);
  fs.mkdirSync(dirPath);
};

module.exports = {
  readJsonFile,
  writeJsonFile,
  readYamlFile,
  writeYamlFile,
  ensureDirectoryExist,
};
