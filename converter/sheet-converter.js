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
 * @fileoverview Data sheet to local data converter class.
 */

const path = require('path');

const {Tab, TabType, OutputType} = require('./schema.js');
const util = require('./util.js');

class SheetConverter {
  /**
   * @param {!Object} options - Constructor options.
   * @param {sheets_v4.Sheets} options.sheets - Google sheet client.
   * @param {string} options.sheetId - Sheet id.
   * @param {string} options.locale - Sheet locale.
   * @param {string} options.dataDir - Webhook data dir.
   * @param {string} options.sdkDir - Action SDK root dir.
   */
  constructor({sheets, sheetId, locale, dataDir, sdkDir}) {
    this.sheets = sheets;
    this.sheetId = sheetId;
    this.locale = locale;
    this.dataDir = dataDir;
    this.sdkDir = sdkDir;
  }

  /**
   * Parse data sheet and convert to appropriate local files.
   */
  async convert() {
    const parsed = {};
    for (const [key, tab] of Object.entries(Tab)) {
      parsed[key] = await this.parseTab(tab);
    }
    for (const [key, tab] of Object.entries(Tab)) {
      const dirPath = tab.outputType === OutputType.JSON ? this.dataDir : this.sdkDir;
      const filePath = this._getOutputFilePath(tab.outputType, dirPath, tab.name);
      this.writeTab(tab.outputType, filePath, parsed[key]);
    }
  }

  /**
   * Parse sheet tab based on tab's type.
   * @param {Object} tab - Sheet tab name.
   * @return {Object} - Parsed data.
   */
  async parseTab(tab) {
    tab = JSON.parse(JSON.stringify(tab)); // ensure original tab is not modified
    if (tab.type === TabType.ARRAY) return this.parseArrayTab(tab);
    if (tab.type === TabType.DICTIONARY) return this.parseDictTab(tab);
    throw new Error(`Tab type:${tab.type} is neither ARRAY or DICTIONARY.`);
  }

  /**
   * Parse tab as array of objects by rows using header row as keys and respective column as value.
   * @param {Object} tab - Sheet tab name.
   * @return {Array<Object>} - Parsed data.
   */
  async parseArrayTab(tab) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: tab.displayName,
      majorDimension: 'ROWS',
    });

    const rows = res.data.values;
    const excludeRows = new Set(tab.excludeRows.map((r) => r - 1));
    const headerRowIdx = this._getHeaderRowIdx(tab, rows);

    const idxToColDef = {};
    const validColIndices = [];
    for (const colDef of tab.columns) {
      const colIdx = rows[headerRowIdx].findIndex(
        (val) => val.toLowerCase().trim() === colDef.displayName.toLowerCase().trim()
      );
      if (colIdx === -1) {
        if (colDef.isRequired) {
          throw new Error(
            `Tab:${tab.displayName} Header:${colDef.displayName} is required but not found.`
          );
        }
      } else {
        idxToColDef[colIdx] = colDef;
        validColIndices.push(colIdx);
      }
    }

    const output = [];
    for (let r = headerRowIdx + 1; r < rows.length; ++r) {
      if (excludeRows.has(r)) continue;
      const row = rows[r];
      const doc = {};

      for (const c of validColIndices) {
        const colDef = idxToColDef[c];
        let value = (row[c] || '').trim();
        if (colDef.isRequired && !value) {
          throw new Error(
            `Tab:${tab.displayName} Row:${r + 1} Column:${
              colDef.displayName
            } is required but empty.`
          );
        }
        if (colDef.isRepeated) {
          value = this._parseRepeatedValue(value);
          if (colDef.isRequired && value.length === 0) {
            throw new Error(
              `Tab:${tab.displayName} Row:${r + 1} Column:${
                colDef.displayName
              } is required but empty.`
            );
          }
        }
        doc[colDef.name] = value;
      }

      output.push(doc);
    }
    return output;
  }

  /**
   * Parse tab as dictionary by using specified key column as keys and value object specified by
   * other columns as key/val pairs.
   * @param {Object} tab - Sheet tab name.
   * @return {Object} - Parsed data.
   */
  async parseDictTab(tab) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: tab.displayName,
      majorDimension: 'ROWS',
    });

    const rows = res.data.values;
    const excludeRows = new Set(tab.excludeRows.map((r) => r - 1));
    const headerRowIdx = this._getHeaderRowIdx(tab, rows);

    let keyColIdx = -1;
    const idxToColDef = {};
    const validColIndices = [];
    for (const colDef of tab.columns) {
      const colIdx = rows[headerRowIdx].findIndex(
        (val) => val.toLowerCase().trim() === colDef.displayName.toLowerCase().trim()
      );
      if (colIdx === -1 && colDef.isKey) {
        throw new Error(
          `Tab:${tab.displayName} Header:${colDef.displayName} is required but not found.`
        );
      }
      if (colDef.isKey) {
        keyColIdx = colIdx;
      } else {
        idxToColDef[colIdx] = colDef;
        validColIndices.push(colIdx);
      }
    }

    if (keyColIdx === -1) {
      throw new Error(`
        Tab:${tab.displayName} has no key column.
      `);
    }

    const output = {};
    for (let r = headerRowIdx + 1; r < rows.length; ++r) {
      if (excludeRows.has(r)) continue;
      const row = rows[r];
      const doc = {};
      const keyCol = row[keyColIdx] || '';
      const keyDef = tab.keys.find(
        (def) => def.displayName.toLowerCase().trim() === keyCol.toLowerCase().trim()
      );
      if (!keyDef) continue;
      const key = keyDef.name;

      for (const c of validColIndices) {
        const colDef = idxToColDef[c];
        let value = (row[c] || '').trim();
        if (colDef.isRequired.includes(key) && !value) {
          throw new Error(
            `Tab:${tab.displayName} Row:${r + 1} Column:${
              colDef.displayName
            } is required but empty.`
          );
        }
        if (colDef.isRepeated.includes(key)) {
          value = this._parseRepeatedValue(value);
          if (colDef.isRequired.includes(key) && value.length === 0) {
            throw new Error(
              `Tab:${tab.displayName} Row:${r + 1} Column:${
                colDef.displayName
              } is required but empty.`
            );
          }
        }
        doc[colDef.name] = value;
      }

      output[key] = doc;
    }
    return output;
  }

  /**
   * Get header row index by filtering out excluding rows.
   * @param {Object} tab - Sheet tab name.
   * @param {Array<Array<string>>} rows - Spreadsheet rows.
   * @return {number} - Header row index.
   */
  _getHeaderRowIdx(tab, rows) {
    const excludeRows = new Set(tab.excludeRows.map((r) => r - 1));
    let headerRowIdx = 0;
    for (let r = 0; r < rows.length; ++r) {
      if (!excludeRows.has(r)) {
        headerRowIdx = r;
        break;
      }
    }
    return headerRowIdx;
  }

  /**
   * Parsed repeated values by splitting with pipe(|) symbol.
   * @param {string} val - Raw value
   * @return {Array<string>} - Parsed values
   */
  _parseRepeatedValue(val) {
    return val
      .split('|')
      .map((str) => str.trim())
      .filter(Boolean);
  }

  /**
   * Write data to local file based on file type.
   * @param {string} type - Output file type.
   * @param {string} filePath - Output file path.
   * @param {string} data - Data to write.
   */
  writeTab(type, filePath, data) {
    switch (type) {
      case OutputType.JSON:
        util.writeJsonFile(filePath, data);
        break;
      case OutputType.YAML:
        util.writeYamlFile(filePath, data);
        break;
      default:
        throw new Error(`Invalid output type:${type}`);
    }
  }

  /**
   * Gets full file path based on output type and locale.
   * @param {string} type - Output file type.
   * @param {string} dirPath - Dir path.
   * @param {string} name - File name.
   * @return {string} - Full output file path.
   */
  _getOutputFilePath(type, dirPath, name) {
    return path.join(__dirname, dirPath, `${this.locale}/${name}.${type}`);
  }
}

module.exports = SheetConverter;
