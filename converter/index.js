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
 * @fileoverview Tool that imports data from data spreadsheet and produce local data files.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');
const flags = require('flags');
const {google} = require('googleapis');

const {FUNCTION_NAME, FUNCTION_VERSION, FUNCTION_REGION} = require('../functions/config.js');
const {LOCALE_TO_SHEET_ID} = require('./config.js');
const console = require('./console.js');
const {readYamlFile, writeYamlFile} = require('./util.js');
const SheetConverter = require('./sheet-converter.js');
const LocaleConverter = require('./locale-converter.js');

// Command line flags.
flags.defineString('project_id', '', 'Actions on Google project id');
flags.defineString('credentials_path', './credentials.json', 'Sheet Parser credentials file path');
flags.defineString('token_path', './token.json', 'Read/write path for user-granted access token');
flags.defineString('sdk_dir', '../sdk', 'Root dir for the action sdk files');
flags.defineString('data_dir', '../functions/data', 'Root webhook data dir for the json files');
flags.defineInteger('verbosity', 0, 'Verbosity of output to console');
flags.parse();

// Set console verbosity level.
console.setVerbosity(flags.get('verbosity'));

// Project id is required.
if (!flags.get('project_id')) {
  throw new Error('Missing project_id flag.');
}

// Run sheet parser and conversion.
convert(flags.get('credentials_path'), flags.get('data_dir'), flags.get('sdk_dir'))
  .then((isOK) => {
    if (isOK) {
      console.info(`Sheet conversion has finished.`);
    } else {
      console.error(`Sheet conversion has failed.`);
    }
    return process.exit(isOK ? 0 : 1);
  })
  .catch((err) => {
    console.error(`Error in conversion: ${err}`);
    process.exit(1);
  });

/**
 * Run the sheet convert and output the files to the data and action dirs.
 * @param {string} credentialsPath - Credentials path.
 * @param {string} dataDir - Webhook data dir.
 * @param {string} sdkDir - Action SDK root dir.
 * @return {boolean} - True for successful conversion.
 */
async function convert(credentialsPath, dataDir, sdkDir) {
  const content = fs.readFileSync(credentialsPath);
  let oAuth2Client;
  try {
    oAuth2Client = await authorize(JSON.parse(content));
  } catch (err) {
    console.error(`Failed to create OAuth2 client: ${err}`);
    return false;
  }

  const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
  for (const [locale, sheetId] of Object.entries(LOCALE_TO_SHEET_ID)) {
    if (!sheetId) continue;

    const sheetConverter = new SheetConverter({sheets, sheetId, locale, dataDir, sdkDir});
    try {
      await sheetConverter.convert();
    } catch (err) {
      console.error(`Failed to convert ${sheetId} ${err}`);
      return false;
    }

    if (locale === 'en') continue; // skip 'en' locale as it is the default locale for sdk.

    const localeConverter = new LocaleConverter({locale, dataDir, sdkDir});
    try {
      localeConverter.convert();
    } catch (err) {
      console.error(`Failed to convert ${sheetId} ${err}`);
      return false;
    }

    console.info(`Finished converting ${locale} data`);
  }

  // Update action sdk project id and webhook url
  const projectId = flags.get('project_id').toLowerCase();
  const webhookUrl = `https://${FUNCTION_REGION}-${projectId}.cloudfunctions.net/${FUNCTION_NAME}_${FUNCTION_VERSION}`;

  const sdkPath = path.join(__dirname, sdkDir);
  const sdkSettingsPath = path.join(sdkPath, 'settings/settings.yaml');
  const sdkWebhookPath = path.join(sdkPath, 'webhooks/AssistantStudioFulfillment.yaml');

  const sdkSettings = readYamlFile(sdkSettingsPath);
  sdkSettings.projectId = projectId;
  writeYamlFile(sdkSettingsPath, sdkSettings);

  const sdkWebhook = readYamlFile(sdkWebhookPath);
  sdkWebhook.httpsEndpoint.baseUrl = webhookUrl;
  writeYamlFile(sdkWebhookPath, sdkWebhook);

  return true;
}

/**
 * Creates an OAuth2 client with the provided credentials and Sheets authorization token
 * (either loaded from local file or newly generated through getNewToken()).
 * @param {!Object} credentials - Authorization client credentials.
 * @return {?google.auth.OAuth2} - Authorized oAuth2 client.
 */
async function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = await (fs.existsSync(flags.get('token_path'))
    ? readLocalToken()
    : getNewToken(oAuth2Client));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

/**
 * Prompts the user to visit an authorization URL, adds the authorization token to oAuth2Client,
 * saves a copy of the token locally.
 * @param {!google.auth.OAuth2} oAuth2Client - OAuth2 client to get token for.
 * @return {Object} - New token.
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  console.log('Grant Sheets Converter read access to your sheets by visiting:'.cyan.bold);
  console.log(authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const code = await readlineQuestionAsync(rl, '\nEnter the code from that page here: '.cyan.bold);
  rl.close();

  const getTokenAsync = util.promisify(oAuth2Client.getToken.bind(oAuth2Client));
  const token = await getTokenAsync(code);
  await writeLocalToken(token); // Store the token to disk for later program executions
  return token;
}

/**
 * Read local access token json file.
 * @return {Promise<Object>} - Local token.
 */
async function readLocalToken() {
  const readFileAsync = util.promisify(fs.readFile);
  let token;
  try {
    token = await readFileAsync(flags.get('token_path'));
  } catch (err) {
    throw new Error(`Failed to retrieve access token: ${err}`);
  }
  return JSON.parse(token);
}

/**
 * Write access token to a local json file.
 * @param {Object} token - Token to save locally.
 */
async function writeLocalToken(token) {
  const writeFileAsync = util.promisify(fs.writeFile);
  try {
    await writeFileAsync(flags.get('token_path'), JSON.stringify(token));
  } catch (err) {
    throw new Error(`Failed to write access token: ${err}`);
  }
  console.info(`Token stored at ${flags.get('token_path')}`);
}

/**
 * Async wrapper for readline.question.
 * @param {!Object} rl - Readline interface.
 * @param {string} prompt - Question prompt.
 * @return {!Promise<string>} - Promise that resolves to the user's response.
 */
async function readlineQuestionAsync(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}
