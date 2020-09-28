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
 * @fileoverview Parse root level sdk folder and update json files for locales folder.
 */

const fs = require('fs');
const path = require('path');

const util = require('./util.js');

const SDK_PATH = path.join(__dirname, '../sdk');
const LOCALES_PATH = path.join(__dirname, './locales');

const SUPPORTED_LOCALES = [
  'de',
  'en', // en is the default locale, should be already included in starter code
  'en-GB',
  'es',
  'es-419',
  'es-ES',
  'fr',
  'fr-CA',
  'fr-FR',
  'hi',
  'id',
  'it',
  'ja',
  'ko',
  'pt-BR',
  'ru',
  'th',
];

const SUPPORTED_INTENTS = [
  'Help',
  'No',
  'OrdinalChoice',
  'Quit',
  'Repeat',
  'Restart',
  'Skip',
  'Start',
  'Yes',
];

const SUPPORTED_TYPES = ['answer', 'count'];

function parseLocaleData(locale) {
  return {
    actions: util.readYamlFile(`${SDK_PATH}/actions/${locale}/actions.yaml`),
    intents: Object.assign(
      {},
      ...SUPPORTED_INTENTS.map((intent) => {
        return {
          [intent]: util.readYamlFile(`${SDK_PATH}/custom/intents/${locale}/${intent}.yaml`),
        };
      })
    ),
    types: Object.assign(
      {},
      ...SUPPORTED_TYPES.map((type) => {
        return {
          [type]: util.readYamlFile(`${SDK_PATH}/custom/types/${locale}/${type}.yaml`),
        };
      })
    ),
    settings: util.readYamlFile(`${SDK_PATH}/settings/${locale}/settings.yaml`),
    strings: util.readYamlFile(`${SDK_PATH}/resources/strings/${locale}/main.yaml`),
  };
}

if (require.main === module) {
  for (const locale of SUPPORTED_LOCALES) {
    if (!fs.existsSync(`${SDK_PATH}/settings/${locale}/settings.yaml`)) continue;
    const data = parseLocaleData(locale);
    util.writeJsonFile(`${LOCALES_PATH}/${locale}.json`, data);
  }
}

module.exports = {
  parseLocaleData,
};
