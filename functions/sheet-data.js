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

const fs = require('fs');
const path = require('path');

const {Collection} = require('./sheet.js');

const DATA_PATH = path.join(__dirname, '/data');
const VALID_COLLECTIONS = Object.values(Collection);
const SUPPORTED_LOCALES = [
  'de',
  'en',
  'en-GB',
  'en-US',
  'es',
  'es-419',
  'es-ES',
  'fr',
  'fr-CA',
  'hi',
  'id',
  'it',
  'ja',
  'ko',
  'pt-BR',
  'ru',
  'th',
];

/**
 * Sheet data helper class
 */
class SheetData {
  /**
   * Construct a new instance.
   */
  constructor() {
    this.data = this._loadData();
  }

  /**
   * Load data files by locale into memory.
   * @return {Object}
   */
  _loadData() {
    const localeToData = {};
    const locales = fs.readdirSync(DATA_PATH);
    for (const locale of locales) {
      if (!SUPPORTED_LOCALES.includes(locale)) continue;
      if (!localeToData[locale]) {
        localeToData[locale] = {};
      }
      const fileNames = fs.readdirSync(`${DATA_PATH}/${locale}`);
      for (const fileName of fileNames) {
        const [collection] = fileName.split('.');
        if (!VALID_COLLECTIONS.includes(collection)) continue;
        localeToData[locale][collection] = require(`${DATA_PATH}/${locale}/${fileName}`);
      }
    }
    return localeToData;
  }

  /**
   * Get data by input locale. If data for input locale does not exist, try using the prefix
   * language code instead.
   * @param {string} locale - Input locale to retrieve the data.
   * @return {Object} - Data for input locale.
   */
  byLocale(locale) {
    if (this.data[locale]) return this.data[locale];
    // Try using the prefix language code
    if (locale.includes('-')) {
      const [lang] = locale.split('-');
      if (this.data[lang]) return this.data[lang];
    }
    throw new Error(`No data found for locale: ${locale}`);
  }
}

module.exports = new SheetData();
