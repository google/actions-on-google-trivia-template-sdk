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

const chai = require('chai');
const {expect} = chai;

const schemaUtil = require('../schema.js');
const {SchemaType} = require('../../constant.js');
const logger = require('../../analytics/logger.js');

describe('util - schema', function() {
  before(function() {
    logger.transports.forEach((t) => (t.silent = true));
  });

  describe('validateSchemaType', function() {
    it('validates based on matched schema type', function() {
      const testSchema = {type: SchemaType.STRING};
      const testVal = ' foo bar ';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal(testVal.trim());
    });

    it('validates based on SchemaType.CUSTOM for unmatched schema type', function() {
      const testSchema = {type: undefined};
      const testVal = ' foo bar ';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal(testVal);
    });

    it('validates based on custom process method', function() {
      const testSchema = {
        type: SchemaType.CUSTOM,
        process: (v) => parseInt(v, 10),
      };
      const testVal = '123';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal(123);
    });

    it('validates based on custom validate method', function() {
      const testSchema = {
        type: SchemaType.CUSTOM,
        validate: (v) => ({error: 'test failed'}),
        default: 'abc',
      };
      const testVal = '123';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal('abc');
    });

    it('returns trimmed value if optional is true and trimmed value is empty string', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
        optional: true,
      };
      const testVal = '  ';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal('');
    });

    it('returns original value if optional is true and value is undefined', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
        optional: true,
      };
      const testVal = undefined;
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal(testVal);
    });

    it('returns validated value if optional is true & value is not empty or undefined', function() {
      const testSchema = {
        type: SchemaType.STRING,
        optional: true,
      };
      const testVal = ' abc ';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal('abc');
    });

    it('uses default value if processing failed and default is provided', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
        default: 'abc',
      };
      const testVal = undefined;
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal('abc');
    });

    it('throws error if processing failed and default is not provided', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
      };
      const testVal = undefined;
      expect(() => schemaUtil.validateSchemaType(testVal, testSchema)).to.throw();
    });

    it('uses default value if validation failed and default is provided', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
        default: 'abc',
      };
      const testVal = 'xyz';
      const output = schemaUtil.validateSchemaType(testVal, testSchema);
      expect(output).to.equal('abc');
    });

    it('throws error if validation failed and default is not provided', function() {
      const testSchema = {
        type: SchemaType.IMAGE,
      };
      const testVal = 'xyz';
      expect(() => schemaUtil.validateSchemaType(testVal, testSchema)).to.throw();
    });
  });

  describe('validateObject', function() {
    it('validates fields that exists in fieldSchema', function() {
      const testTarget = {
        name: ' John Smith ',
        age: '29',
        password: ' secret ',
      };
      const testFieldSchema = {
        name: {
          type: SchemaType.STRING,
        },
        age: {
          type: SchemaType.INTEGER,
        },
      };
      const output = schemaUtil.validateObject(testTarget, testFieldSchema);
      expect(output.name).to.equal('John Smith');
      expect(output.age).to.equal(29);
      expect(output.password).to.equal(testTarget.password);
    });

    it('throws error if validated failed and no default value', function() {
      const testTarget1 = {
        link: 'abc',
      };
      const testFieldSchema1 = {
        link: {type: SchemaType.IMAGE},
      };
      expect(() => schemaUtil.validateObject(testTarget1, testFieldSchema1))
        .to.throw()
        .with.property('isJoi', true);

      const testTarget2 = {
        link: {},
      };
      const testFieldSchema2 = {
        link: {type: SchemaType.DATE},
      };
      expect(() => schemaUtil.validateObject(testTarget2, testFieldSchema2))
        .to.throw()
        .not.with.property('isJoi');
    });

    it('replaces property name with new alias if provided in schema', function() {
      const testTarget = {
        USER_NAME: 'abc',
      };
      const testFieldSchema = {
        USER_NAME: {alias: 'name'},
      };
      const output = schemaUtil.validateObject(testTarget, testFieldSchema);
      expect(output.name).to.equal('abc');
      expect(output.USER_NAME).to.be.undefined;
    });
  });

  describe('validateCollection', function() {
    it('validates all objects in input array via schema type', function() {
      const testTargets = [
        {
          name: ' John Smith ',
          age: '29',
        },
        {
          name: ' Kevin Owen ',
          age: '15',
        },
      ];
      const testFieldSchema = {
        name: {
          type: SchemaType.STRING,
        },
        age: {
          type: SchemaType.INTEGER,
        },
      };
      const output = schemaUtil.validateCollection(testTargets, testFieldSchema);
      expect(output).to.eql([{name: 'John Smith', age: 29}, {name: 'Kevin Owen', age: 15}]);
    });
  });

  describe('defaultSchemas', function() {
    const validator = schemaUtil.validateSchemaType;

    describe('SchemaType.CUSTOM', function() {
      const type = SchemaType.CUSTOM;
      const schema = {type};

      it('validates as any values', function() {
        expect(validator('abc', schema)).to.eql('abc');
        expect(validator(123, schema)).to.eql(123);
      });
    });

    describe('SchemaType.BOOLEAN', function() {
      const type = SchemaType.BOOLEAN;
      const schema = {type};

      it('validates truthy values as boolean true', function() {
        expect(validator(true, schema)).to.eql(true);
        expect(validator('YES', schema)).to.eql(true);
      });

      it('validates falsy values as boolean false', function() {
        expect(validator(false, schema)).to.eql(false);
        expect(validator('NO', schema)).to.eql(false);
      });
    });

    describe('SchemaType.INTEGER', function() {
      const type = SchemaType.INTEGER;
      const defaultVal = 999;
      const schema = {type, default: defaultVal};

      it('validates truthy values as integer', function() {
        expect(validator(123, schema)).to.eql(123);
        expect(validator('123', schema)).to.eql(123);
        expect(validator('-123', schema)).to.eql(-123);
      });

      it('fails falsy values', function() {
        expect(validator('abc', schema)).to.eql(defaultVal);
        expect(validator(['a'], schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.FLOAT', function() {
      const type = SchemaType.FLOAT;
      const defaultVal = 99.99;
      const schema = {type, default: defaultVal};

      it('validates truthy values as float', function() {
        expect(validator(12.3, schema)).to.eql(12.3);
        expect(validator('12.3', schema)).to.eql(12.3);
        expect(validator('-12.3', schema)).to.eql(-12.3);
      });

      it('fails falsy values', function() {
        expect(validator('abc', schema)).to.eql(defaultVal);
        expect(validator(['a'], schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.SSML', function() {
      const type = SchemaType.SSML;
      const defaultVal = '<speak>foo</speak>';
      const schema = {type, default: defaultVal};

      it('validates truthy values as cleaned ssml string', function() {
        expect(validator(' < speak> \u{1f9ff} abc \u{1f300} < /speak> ', schema)).to.eql(
          '<speak>abc</speak>'
        );
      });

      it('uses default value for falsy values', function() {
        expect(validator(undefined, schema)).to.eql(defaultVal);
        expect(validator(null, schema)).to.eql(defaultVal);
        expect(validator(false, schema)).to.eql(defaultVal);
        expect(validator(NaN, schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.STRING', function() {
      const type = SchemaType.STRING;
      const defaultVal = 'default string';
      const schema = {type, default: defaultVal};

      it('validates truthy values as trimmed string', function() {
        expect(validator('  hello ', schema)).to.eql('hello');
      });

      it('uses default value for falsy values', function() {
        expect(validator(undefined, schema)).to.eql(defaultVal);
        expect(validator(null, schema)).to.eql(defaultVal);
        expect(validator(false, schema)).to.eql(defaultVal);
        expect(validator(NaN, schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.STRING_LIST', function() {
      const type = SchemaType.STRING_LIST;
      const defaultVal = [];
      const schema = {type, default: defaultVal};

      it('validates truthy values as trimmed string array', function() {
        expect(validator([' hello '], schema)).to.eql(['hello']);
        expect(validator(' hello ', schema)).to.eql(['hello']);
      });
    });

    describe('SchemaType.IMAGE', function() {
      const type = SchemaType.IMAGE;
      const defaultVal = 'default image';
      const schema = {type, default: defaultVal};

      it('validates truthy values as image uri link value', function() {
        const link = ' https://www.google.com/ ';
        expect(validator(link, schema)).to.eql(link.trim());
        expect(validator({contentUrl: link}, schema)).to.eql(link.trim());
      });

      it('fails invalided uri image link value', function() {
        const link = 'www.google.com/';
        expect(validator(link, schema)).to.eql(defaultVal);
        expect(validator({contentUrl: link}, schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.URL', function() {
      const type = SchemaType.URL;
      const defaultVal = 'default url';
      const schema = {type, default: defaultVal};

      it('validates truthy values as uri link value', function() {
        const link = ' https://www.google.com/ ';
        expect(validator(link, schema)).to.eql(link.trim());
      });

      it('fails invalided uri link value', function() {
        const link = ' www.google.com/ ';
        expect(validator(link, schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.GOOGLE_FONT', function() {
      const type = SchemaType.GOOGLE_FONT;
      const defaultVal = 'default url';
      const schema = {type, default: defaultVal};

      it('validates truthy values as valid Google Font url', function() {
        const link = ' https://fonts.googleapis.com/css?family=Roboto ';
        expect(validator(link, schema)).to.eql(link.trim());
      });

      it('fails invalid uri link value', function() {
        const link = 'https://www.google.com/';
        expect(validator(link, schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.COLOR_HEX', function() {
      const type = SchemaType.COLOR_HEX;
      const defaultVal = 'default hex';
      const schema = {type, default: defaultVal};

      it('validates truthy values as cleaned color hex string', function() {
        expect(validator('CDE', schema)).to.eql('#CDE');
        expect(validator('cde', schema)).to.eql('#cde');
        expect(validator('123CDE', schema)).to.eql('#123CDE');
        expect(validator('#ABC', schema)).to.eql('#ABC');
        expect(validator('#ABC123', schema)).to.eql('#ABC123');
        expect(validator('##ABC', schema)).to.eql('#ABC');
      });

      it('fails invalided color hex', function() {
        expect(validator('', schema)).to.eql(defaultVal);
        expect(validator('#', schema)).to.eql(defaultVal);
        expect(validator('#12ABC', schema)).to.eql(defaultVal);
        expect(validator('1234ABC', schema)).to.eql(defaultVal);
        expect(validator('123XYZ', schema)).to.eql(defaultVal);
      });
    });

    describe('SchemaType.DATE', function() {
      const type = SchemaType.DATE;
      const defaultVal = 'default date';
      const schema = {type, default: defaultVal};

      it('validates truthy values as parsed date', function() {
        const convertedDate1 = new Date('2018-10-20');
        const convertedDate2 = new Date('10-20-2018');
        expect(validator('2018-10-20', schema)).to.eql(convertedDate1);
        expect(validator('2018/10/20', schema)).to.eql(convertedDate2);
        expect(validator('10-20-2018', schema)).to.eql(convertedDate2);
        expect(validator('10/20/2018', schema)).to.eql(convertedDate2);
      });

      it('fails invalid date value', function() {
        expect(validator('20a9-10-20', schema)).to.eql(defaultVal);
        expect(validator('abc', schema)).to.eql(defaultVal);
        expect(validator('5@-20-99', schema)).to.eql(defaultVal);
        expect(validator('g123', schema)).to.eql(defaultVal);
      });
    });
  });
});
