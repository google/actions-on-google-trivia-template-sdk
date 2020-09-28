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

const response = require('../response.js');
const ssml = require('../ssml.js');

describe('util - response', function() {
  describe('toSimple', function() {
    const textCol = 'text-column';
    const speechCol = 'speech-column';
    const testText = 'testText';
    const testSpeech = 'testSpeech';

    it('returns an object with simple response shape', function() {
      const testDoc = {[textCol]: testText, [speechCol]: testSpeech};
      const output = response.toSimple(testDoc, textCol, speechCol);
      expect(output).to.eql({text: testText, speech: `<speak>${testSpeech}</speak>`});
    });

    it('defaults to empty string for text prop if text column has no value', function() {
      const testDoc = {[textCol]: null, [speechCol]: testSpeech};
      const output = response.toSimple(testDoc, textCol, speechCol);
      expect(output).to.eql({text: '', speech: `<speak>${testSpeech}</speak>`});
    });

    it('uses text column for speech prop if speech column has no value', function() {
      const testDoc = {[textCol]: testText, [speechCol]: null};
      const output = response.toSimple(testDoc, textCol, speechCol);
      expect(output).to.eql({text: testText, speech: `<speak>${testText}</speak>`});
    });

    it('defaults to empty string for speech prop if text & speech column has no value', function() {
      const testDoc = {[textCol]: null, [speechCol]: null};
      const output = response.toSimple(testDoc, textCol, speechCol);
      expect(output).to.eql({text: '', speech: ''});
    });
  });

  describe('mergeSimple', function() {
    it('returns an object with speech and text props', function() {
      const output = response.mergeSimple();
      expect(output).to.have.ownProperty('text');
      expect(output).to.have.ownProperty('speech');
    });

    it('returns speech property built by merged speech values of input responses', function() {
      const testObjects = [{speech: 'a', text: 'x'}, {speech: 'b', text: 'y'}];
      const output = response.mergeSimple(...testObjects);
      expect(output.speech).to.eql(ssml.merge([testObjects[0].speech, testObjects[1].speech]));
    });

    it('returns text property built by joined text values of input responses', function() {
      const testObjects = [{speech: 'a', text: 'x'}, {speech: 'b', text: 'y'}];
      const output = response.mergeSimple(...testObjects);
      expect(output.text).to.eql(`${testObjects[0].text} ${testObjects[1].text}`);
    });

    it('returns speech property built by merged speech values with custom break time', function() {
      const testObjects = [{speech: 'a', text: 'x'}, {speech: 'b', text: 'y'}];
      const output = response.mergeSimple(testObjects, 100);
      expect(output.speech).to.eql(ssml.merge([testObjects[0].speech, testObjects[1].speech], 100));
    });

    it('returns text property built by joined text values with custom break time', function() {
      const testObjects = [{speech: 'a', text: 'x'}, {speech: 'b', text: 'y'}];
      const output = response.mergeSimple(testObjects, 100);
      expect(output.text).to.eql(`${testObjects[0].text} ${testObjects[1].text}`);
    });

    it('trims edge whitespace chars for merged text property', function() {
      const testObjects = [{speech: 'a', text: ''}, {speech: 'b', text: ' y '}];
      const output = response.mergeSimple(...testObjects);
      expect(output.text).to.eql('y');
    });
  });

  describe('formatSimple', function() {
    const prompt = {speech: '%s', text: '%s'};
    const speechArgs = ['a'];
    const textArgs = ['b'];
    const formatArgs = {speechArgs, textArgs};
    const input = [prompt, formatArgs];

    it('returns an object with speech and text props', function() {
      const output = response.formatSimple(...input);
      expect(output).to.have.ownProperty('text');
      expect(output).to.have.ownProperty('speech');
    });

    it('replaces placeholders in prompt with formatArgs', function() {
      const output = response.formatSimple(...input);
      expect(output).to.eql({text: 'b', speech: '<speak>a</speak>'});
    });
  });
});
