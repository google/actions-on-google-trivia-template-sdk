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

const Joi = require('joi');

const logger = require('../analytics/logger.js');
const {SchemaType} = require('../constant.js');
const objectUtil = require('./object.js');
const ssmlUtil = require('./ssml.js');

/**
 * @module util/schema
 * @desc FieldSchema validation tool.
 */

/**
 * Default validator schemas for supported schema types.
 * @type {Object<module:constant.SchemaType, ValidatorSchema>}
 */
const defaultSchemas = {
  [SchemaType.CUSTOM]: {
    process: (v) => v,
    validate: Joi.any(),
  },
  [SchemaType.BOOLEAN]: {
    process: (v) => ['TRUE', 'YES'].includes(String(v).toUpperCase()),
    validate: Joi.boolean(),
  },
  [SchemaType.INTEGER]: {
    process: (v) => parseInt(v, 10),
    validate: Joi.number().integer(),
  },
  [SchemaType.FLOAT]: {
    process: (v) => parseFloat(v),
    validate: Joi.number(),
  },
  [SchemaType.SSML]: {
    process: (v) => ssmlUtil.clean(v || ''),
    validate: Joi.string().trim(),
  },
  [SchemaType.STRING]: {
    process: (v) => v || '',
    validate: Joi.string().trim(),
  },
  [SchemaType.STRING_LIST]: {
    process: (v) => (Array.isArray(v) ? v : [v]),
    validate: Joi.array().items(Joi.string().trim()),
  },
  [SchemaType.IMAGE]: {
    process: (v) => (typeof v === 'string' ? v : v['contentUrl']).trim(),
    validate: Joi.string().uri(),
  },
  [SchemaType.URL]: {
    process: (v) => v.trim(),
    validate: Joi.string().uri(),
  },
  [SchemaType.URL_LIST]: {
    process: (v) => (Array.isArray(v) ? v : [v]),
    validate: Joi.array().items(Joi.string().uri()),
  },
  [SchemaType.GOOGLE_FONT]: {
    process: (v) => v.trim(),
    validate: Joi.string()
      .uri()
      .regex(/https:\/\/fonts\.googleapis\.com\//),
  },
  [SchemaType.COLOR_HEX]: {
    process: (v) => `#${v.trim()}`.replace(/#+/g, '#'),
    validate: Joi.string().regex(/(^#[0-9A-F]{3}$)|(^#[0-9A-F]{6}$)/i, 'Color HEX'),
  },
  [SchemaType.DATE]: {
    process: (v) => v.trim(),
    validate: Joi.date(),
  },
};

/**
 * Validates array of targets with same object shape by field schema.
 * @param {Array<Object<string, any>>} targets - Array of target to be validated.
 * @param {Object<string, ValidatorSchema>} [fieldSchema={}] - Object with validation schema
 *    for target keys.
 * @return {Array<Object<string, any>>} - Array of validated targets.
 * @static
 */
const validateCollection = (targets, fieldSchema = {}) =>
  targets.map((target) => validateObject(target, fieldSchema));

/**
 * Validates target object by field schema.
 * @param {Object<string, any>} target - Target to be validated.
 * @param {Object<string, ValidatorSchema>} [fieldSchema={}] - Object with validation schema
 *    for target keys.
 * @return {Object<string, any>} - Validated target.
 * @throws {Error} - Failed validation with no default value.
 * @static
 */
const validateObject = (target, fieldSchema = {}) =>
  objectUtil.entries(target).reduce((output, [key, val]) => {
    if (!fieldSchema.hasOwnProperty(key)) {
      output[key] = val;
    } else {
      try {
        const newKey = fieldSchema[key].alias || key;
        output[newKey] = validateSchemaType(val, fieldSchema[key], key);
      } catch (err) {
        logger.warn(`Failed schema validation for ${key}, received: ${val}, no default value.`, {
          key,
          value: val,
          error: err.isJoi ? err : {message: err.message, stack: err.stack},
        });
        throw err;
      }
    }
    return output;
  }, {});

/**
 * Validates input by validator schema. Returns provided default value if validation failed.
 * @param {*} value - Input value to be validated.
 * @param {ValidatorSchema} schema - Validation schema, can override default process
 *    and validate steps.
 * @param {string} [label] - Optional name for clearer error logging.
 * @return {*} - Validated input.
 * @throws {Joi.ValidationError} - Failed validation with no default value.
 * @static
 */
const validateSchemaType = (value, schema, label) => {
  const defaultSchema = defaultSchemas[schema.type] || defaultSchemas[SchemaType.CUSTOM];
  const validator = Object.assign({}, defaultSchema, schema);
  if (validator.optional) {
    if (typeof value === 'string' && value.trim() === '') {
      return value.trim();
    }
    if (value == null) {
      return value;
    }
  }
  const meta = {value: String(value), key: label, default: validator.default};

  let processed;
  try {
    processed = validator.process(value);
  } catch (err) {
    if (validator.hasOwnProperty('default')) {
      logger.info(
        `Failed schema preprocess for ${label}, received: ${value}, use default: ${
          validator.default
        }`,
        Object.assign(meta, {error: {message: err.message, stack: err.stack}})
      );
      return validator.default;
    }
    throw err;
  }

  const result = Joi.validate(processed, validator.validate);
  if (result.error) {
    if (validator.hasOwnProperty('default')) {
      logger.info(
        `Failed schema validation for ${label}, received: ${value}, use default: ${
          validator.default
        }`,
        Object.assign(meta, {error: result.error})
      );
      return validator.default;
    }
    throw result.error;
  }
  return result.value;
};

module.exports = {
  validateCollection,
  validateObject,
  validateSchemaType,
};
