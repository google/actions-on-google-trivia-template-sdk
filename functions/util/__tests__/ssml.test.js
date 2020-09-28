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

const ssml = require('../ssml.js');
const config = require('../../config.js');
const {TtsMark} = require('../../constant.js');

describe('util - ssml', function() {
  describe('sanitize', function() {
    it('returns a string', function() {
      const output = ssml.sanitize``;
      expect(output).to.be.a('string');
    });

    it('replaces & symbol with &amp;', function() {
      const output = ssml.sanitize`${'&'}`;
      expect(output).to.eql('&amp;');
    });

    it('replaces < symbol with &lt;', function() {
      const output = ssml.sanitize`${'<'}`;
      expect(output).to.eql('&lt;');
    });

    it('replaces > symbol with &gt;', function() {
      const output = ssml.sanitize`${'>'}`;
      expect(output).to.eql('&gt;');
    });

    it('replaces " symbol with &quot;', function() {
      const output = ssml.sanitize`${'"'}`;
      expect(output).to.eql('&quot;');
    });

    it('trims whitespace around <speak> tags', function() {
      const output = ssml.sanitize`  <speak></speak>  `;
      expect(output).to.eql('<speak></speak>');
    });

    it('removes leading whitespace before <speak> tag per line', function() {
      const output = ssml.sanitize`
        <speak>
          ${'input'}
        </speak>
      `;
      expect(output).to.eql('<speak>\n  input\n</speak>');
    });

    it('inserts multiple expressions into template literal output', function() {
      const output = ssml.sanitize`<speak>${'Hello'} ${'World'}</speak>`;
      expect(output).to.eql('<speak>Hello World</speak>');
    });
  });

  describe('merge', function() {
    const parts = ['<speak>a</speak>', '<speak>b</speak>'];
    const breakTime = 0;

    it('returns a string', function() {
      const output = ssml.merge(parts, breakTime);
      expect(output).to.be.a('string');
    });

    it('surrounds by <speak> tag', function() {
      const output = ssml.merge(['a', 'b'], breakTime);
      expect(output).to.eql('<speak>a b</speak>');
    });

    it('trims whitespace for input strings', function() {
      const output = ssml.merge([' test '], breakTime);
      expect(output).to.eql('<speak>test</speak>');
    });

    it('filters trimmed empty parts', function() {
      const output = ssml.merge([' ', '  ', 'test', '  '], breakTime);
      expect(output).to.eql('<speak>test</speak>');
    });

    it('separate input strings by a whitespace', function() {
      const output = ssml.merge(['a', 'b'], breakTime);
      expect(output).to.eql('<speak>a b</speak>');
    });

    it('removes inner <speak> tags from input strings', function() {
      const output = ssml.merge(parts, breakTime);
      expect(output).to.eql('<speak>a b</speak>');
    });

    it('Add break tag if specify breakTime argument greater than 0', function() {
      const output = ssml.merge(parts, 5);
      expect(output).to.eql('<speak>a <break time="5ms"/>b</speak>');
    });

    it('Use default break time from config if second argument is not specified', function() {
      const output = ssml.merge(parts);
      expect(output).to.eql(`<speak>a <break time="${config.SSML_BREAK_TIME}ms"/>b</speak>`);
    });
  });

  describe('clean', function() {
    it('returns a string', function() {
      const output = ssml.clean('');
      expect(output).to.be.a('string');
    });

    it('removes whitespace around < and > symbol', function() {
      const output = ssml.clean(' < speak > a < /speak > ');
      expect(output).to.eql('<speak>a</speak>');
    });

    it('removes extra whitespace symbol', function() {
      const output = ssml.clean('  <  speak >     a   b    <  /speak  >   ');
      expect(output).to.eql('<speak>a b</speak>');
    });

    it('removes emoji symbols', function() {
      const output = ssml.clean(' < speak> \u{1f9ff} abc \u{1f300} < /speak> ');
      expect(output).to.eql('<speak>abc</speak>');
    });

    it('escapes special characters if input is not surrounded by <speak> tag', function() {
      const output = ssml.clean('"1 + 1 > 1"');
      expect(output).to.eql('<speak>&quot;1 + 1 &gt; 1&quot;</speak>');
    });

    it('returns empty string if no content inside ssml speak tag', function() {
      const output = ssml.clean(' < speak > \u{1f9ff} < /speak > ');
      expect(output).to.eql('');
    });

    it('returns empty string if no content as raw string', function() {
      const output = ssml.clean(' \u{1f9ff} ');
      expect(output).to.eql('');
    });
  });

  describe('escape', function() {
    it('returns a string', function() {
      const output = ssml.escape('');
      expect(output).to.be.a('string');
    });

    it('escapes special ssml characters', function() {
      const output = ssml.escape('\'a\' > "b" < &');
      expect(output).to.eql('&apos;a&apos; &gt; &quot;b&quot; &lt; &amp;');
    });
  });
});
