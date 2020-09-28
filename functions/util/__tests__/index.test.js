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

const util = require('../index.js');

describe('util - index', function() {
  it('contains reference to all utils', function() {
    expect(util.common).to.be.a('object');
    expect(util.array).to.be.a('object');
    expect(util.string).to.be.a('object');
    expect(util.object).to.be.a('object');
    expect(util.datetime).to.be.a('object');
    expect(util.response).to.be.a('object');
    expect(util.ssml).to.be.a('object');
    expect(util.schema).to.be.a('object');
  });
});
