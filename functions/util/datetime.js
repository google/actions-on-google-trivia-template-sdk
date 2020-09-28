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

const moment = require('moment-timezone');

/**
 * @module util/datetime
 * @desc Utility functions for date and time.
 */

const TIMEZONE_DEFAULT = 'America/Los_Angeles';
const DATE_FORMAT_DEFAULT = 'YYYY-MM-DD';
const LOCALE_DEFAULT = 'en';

// Sets default locale and timezone for datetime reference.
moment.locale(LOCALE_DEFAULT);
moment.tz.setDefault(TIMEZONE_DEFAULT);

/**
 * Converts day to milliseconds.
 * @param {number} day - Day to convert.
 * @return {number} - Milliseconds.
 * @static
 */
const toMillisecondsFromDay = (day) => day * 24 * 60 * 60 * 1000;

/**
 * Set default timezone for moment library.
 * @param {string} timezone - Timezone identifier.
 * @return {boolean} - True if input is valid and default timezone is updated.
 * @static
 */
const setDefaultTimezone = (timezone) => {
  if (moment.tz.zone(timezone)) {
    moment.tz.setDefault(timezone);
    return true;
  }
  return false;
};

/**
 * Convert ISO date or UNIX epoch timestamp to specific string format in target timezone and locale.
 * @see {@link https://momentjs.com/docs/#/displaying/format/}
 * @see {@link https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json}
 * @param {string|number} date - ISO 8601 date format or UNIX epoch timestamp.
 * @param {string} [format=DATE_FORMAT_DEFAULT] - MomentJS format tokens.
 * @param {string} [locale=LOCALE_DEFAULT] - Reference locale to parse format tokens.
 * @param {string} [timezone=TIMEZONE_DEFAULT] - Reference timezone local date.
 * @return {string} - Formatted date in target timezone and locale.
 * @static
 */
const formatDate = (
  date,
  format = DATE_FORMAT_DEFAULT,
  locale = LOCALE_DEFAULT,
  timezone = TIMEZONE_DEFAULT
) =>
  moment(date)
    .tz(timezone.trim().replace(/\s+/g, '_'))
    .locale(locale)
    .format(format);

/**
 * Calculate day difference between two days.
 * @param {string} date - Date string in ISO 8601 format.
 * @param {string} [reference] - Reference date from comparison, default is current date.
 * @return {number} - Day difference.
 * @static
 */
const calculateDayDifference = (date, reference) => {
  const localDate = moment(date).endOf('day');
  const localReference = moment(reference).endOf('day');
  return localDate.diff(localReference, 'days');
};

module.exports = {
  toMillisecondsFromDay,
  setDefaultTimezone,
  formatDate,
  calculateDayDifference,
};
