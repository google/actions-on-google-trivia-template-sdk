# Migration from the Trivia Quiz template to the Actions Builder

This step-by-step guide describes the project and its source code for the conversion from the [Trivia Quiz](https://developers.google.com/assistant/templates/trivia) template to the [Actions Builder](https://developers.google.com/assistant/conversational/build) platform.

## Directory structure

The file structure for the project is comprised of the following directories, as described:

- converter: Sheets and locales conversion tool
- functions: Fulfillment webhook source code
- sdk: Action SDK resource files

## Step 1: Prerequisites

Before you begin the migration, perform the following steps:

1. Install [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm) as follows:
   - Install them with [Node Version Manager (nvm) for Linux and Mac](https://github.com/nvm-sh/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows).
   - The webhook runtime requires Node.js version 10 or higher.

2. Install the [Firebase CLI](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment) as follows:
   1. Install it with [MAJOR](https://firebase.google.com/docs/cli) version 8. To do so, run the following command: `npm install -g firebase-tools@^8.0.0`.
   2. Run `firebase login` with your Google account.

3. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions) as follows:
   1. Extract the package to a location of your choice and add the binary to your environment's PATH variable. Alternatively, extract the package to a location that's already in your PATH variable, such as `/usr/local/bin`.
   2. Run `gactions login` with your Google account.

4. Go to [Google Sheet Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs) as follows:
   1. From that page, go to [Step 1](https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the), and click **Enable the Google Sheets API**.
   2. Enter a project name or select the default name, "Quickstart", then click **Next**.
      - **Note:** this project isn't the same as a new "Actions on Google" project needed for migration.
   3. For **Configure your Oauth client**, select **Desktop app**.
   4. Click **Create**.
   5. To download `credentials.json`, click **Download client configuration**.
   6. Save the JSON file in the `converter/` directory.

## Step 2: Setup

Create a new project in Actions Console and upgrade the Firebase price plan as described here.

### Create a new project in Actions Console

Perform the following steps:

1. Go to [Actions on Google Console](https://console.actions.google.com/).
2. Select **New project&nbsp;> Create project**.
3. Select **What kind of Action do you want to build?&nbsp;> Game&nbsp;> Blank project**.

To find your Project ID, go to Actions on Google Console for your project, and go to **More ⋮&nbsp;> Project settings&nbsp;> Project ID**.

> **Note:** Don't confuse the Project ID with the Project Name.

### Upgrade the Firebase price plan

From the [Firebase Console](https://console.firebase.google.com/), select the same newly created project from Actions Console and upgrade its price plan to **Blaze (pay as you go)**.

> **Caution:** A Blaze plan is required for Cloud Functions for Node.js version 10 runtime.

## Step 3: Migration

Perform the steps described here.

### Sample sheets to create a new action

To create a new Trivia Quiz action, make a copy of the Trivia Quiz sample sheet in your preferred locale-specific language. Update the sheet with your data. Alternatively, you can use your current Trivia Quiz data sheet. Refer to the following links to the Trivia Quiz sample sheets, in your preferred locale-specific language:

- [de](https://docs.google.com/spreadsheets/d/1lJUqxdQmETErmWw-5YyJlw78rGBna3ANcMPBh8_sXO4/copy)
- [en](https://docs.google.com/spreadsheets/d/1y3FHJgQlofapqcJDgfeW3umOlQHFQX-BV9gQA1tB1sE/copy)
- [en-GB](https://docs.google.com/spreadsheets/d/1xMrYF_N53CeUJfweE1Q6vyYm2eFWEtzZ_f7YMGJ1F5c/copy)
- [en-US](https://docs.google.com/spreadsheets/d/1y3FHJgQlofapqcJDgfeW3umOlQHFQX-BV9gQA1tB1sE/copy)
- [es](https://docs.google.com/spreadsheets/d/14d7f--BCsGZQzDnPgPNF1GxErK1C6MFpL8VKt8cKXbk/copy)
- [es-419](https://docs.google.com/spreadsheets/d/1d4qfu7_Kk80GHTpSuTaBL8wrvf542M2qQ3xqXORTi-U/copy)
- [es-ES](https://docs.google.com/spreadsheets/d/14d7f--BCsGZQzDnPgPNF1GxErK1C6MFpL8VKt8cKXbk/copy)
- [fr](https://docs.google.com/spreadsheets/d/1lv0RRM6nfSzfcEUyDIUJmpizr6yVANoFPrtHBnFTo8c/copy)
- [fr-CA](https://docs.google.com/spreadsheets/d/1DEVlmBHuzes2reJgRpvlaRyw8m7vOtCQELXHkxi_0ns/copy)
- [fr-FR](https://docs.google.com/spreadsheets/d/1lv0RRM6nfSzfcEUyDIUJmpizr6yVANoFPrtHBnFTo8c/copy)
- [hi](https://docs.google.com/spreadsheets/d/1Tf8ZMb_jAL3W1RGNUn52RFzqShakTb52XoMIozRjh9Y/copy)
- [id](https://docs.google.com/spreadsheets/d/1rDKzFMfzPqq8fnZwPFOhYgHPd6EcG1hKzA16yNa57R0/copy)
- [it](https://docs.google.com/spreadsheets/d/1aFWBTYdRRyUbhfKU1BG1JJRzhJtT5zrC9M93fu2xuv8/copy)
- [ja](https://docs.google.com/spreadsheets/d/1m9MW5xaQv84SJKNI-2oGYcHF7-Ki0WwDTo0DTIiI608/copy)
- [ko](https://docs.google.com/spreadsheets/d/1b1eUARjWetnyJXO6w_lnmkHbf8UmNeXvw3FFnU8TxFE/copy)
- [pt-BR](https://docs.google.com/spreadsheets/d/1XiurioqBra-ADYPwI8nrtztFOik-erTU0QjKXueCqkQ/copy)
- [ru](https://docs.google.com/spreadsheets/d/1p-0Mo9pjFX5X3w2gFHhqsllilYgKzJNgeQBwvky1oeo/copy)
- [th](https://docs.google.com/spreadsheets/d/17k4SbW-k4MRMhpTbCroPoVAYvK1J979W93IdrFMqQlM/copy)

### Update the Trivia Quiz sheet ID

Open `converter/config.js` and update the `LOCALE_TO_SHEET_ID` mapping with your own Trivia Quiz data sheet ID for the specific locale you need to convert, as follows:

1. Determine the Sheet ID, which is hard-coded as part of the sheet URL:  `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit#gid=0`.
2. Uncomment the specific locales you need to convert.
3. The sheet IDs provided in `converter/config.js` are the default sample sheets for each locale. To create a new Trivia Quiz action, make a copy of the sample sheet and update it with your own data.
4. Verify that the data sheet is owned by the same Google Account that performs the migration.

After you've updated the sheet ID, you have two options for how to proceed with the migration.

### Automatic migration script: Option 1

To automatically run all the migration steps, go to the root directory of the project, and run the following command: `./build.sh <PROJECT_ID>`. Be aware of the following guidance:

- When the script is run for the first time, it asks you to grant read access to your sheets. To do so, go to the URL it provides, accept read access, and copy the authorization code and enter it when prompted by the script.
- If you're taken to a warning page that says, "This app isn't verified," click **Advanced**. From the dropdown text that appears, click **Go to Quickstart (unsafe)** and continue the authorization process.
- If you encounter an issue, you can, instead, perform a [manual migration steps](#Manual-migration:-Option-2).

### Manual migration: Option 2

To manually migrate the project, perform the steps described here:

1. [Run the sheet and locale conversion script](#Run-the-sheet-and-locale-conversion-script)
2. [Deploy the webhook to Cloud Functions for Firebase](#Deploy-the-webhook-to-Cloud-Functions-for-Firebase)
3. [Use Actions CLI to push and preview your project](#Use-Actions-CLI-to-push-and-preview-your-project)

#### Run the sheet and locale conversion script

Perform the following steps:

1. Go to the `converter/` directory. To do so, go to the root directory of the project and run `cd converter`.
2. Run `npm install`.
3. Run `npm run convert -- --project_id <PROJECT_ID>`. Be aware of the following guidance:
    - When the script is run for the first time, it asks you to grant read access to your sheets. To do so, go to the URL it provides, accept read access, and copy the authorization code and enter it when prompted by the script.
    - If you're taken to a warning page that says, "This app isn't verified," click **Advanced**. From the dropdown text that appears, click **Go to Quickstart (unsafe)** and continue the authorization process.
    - After the conversion script completes, the parsed sheet data is added to the `functions/data/` directory, and the locale-specific data is added to the `sdk/` directory.

#### Deploy the webhook to Cloud Functions for Firebase

Perform the following steps:

1. Go to the `functions/` directory. To do so, go to the root directory of the project and run `cd functions`.
2. Run `npm install`.
3. To deploy the "v1" webhook, run `firebase deploy --project <PROJECT_ID> --only functions:triviaQuiz_v1`.
4. After you release a version of the action, you can update your webhook and test your changes, so that you avoid an effect to your production action. To do so, go to the `functions/config.js` file, and update the `FUNCTION_VERSION` value to an appropriate value such as `triviaQuiz_v2`. This update deploys a new webhook URL, which reflects the updated value.

#### Use Actions CLI to push and preview your project

Perform the following steps:

1. Go to the `sdk/` directory. To do so, go to the root directory of the project and `cd sdk`.
2. To login to your Google account, run `gactions login`.
3. To push your project, run `gactions push`.
   - To fix the validation warnings, go to Actions Console, and from the **Deploy** section, update the missing directory information.
   - If you need to sync the changes made in the Actions Builder Console with your local `sdk/` directory, run `gactions pull`.
4. To deploy the project to the preview environment, run `gactions deploy preview`.

## Step 4: Test the converted action

You can test your action on any Google Assistant-enabled device that's signed into the same account used to create the project. You can also use the [Actions on Google Console's simulator](https://developers.google.com/assistant/console/simulator) to test most features and preview on-device behavior.

## Support and additional resources

If you encounter an issue or need additional information, refer to any of the following:

- If you have a question, the following forums are singificantly helpful:
  - [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google)
  - [Reddit's Assistant Developer Community](https://www.reddit.com/r/GoogleAssistantDev/)
- If you find any bugs, report them through [GitHub](https://github.com/google/actions-on-google-trivia-template-sdk/issues).
- To learn more about Actions on Google, refer to [Google Assistant's developer documentation](https://developers.google.com/assistant).
- For guided, hands-on practice with Actions on Google, try some of the [Codelabs for Google Assistant](https://codelabs.developers.google.com/?cat=Assistant).

## Contribute

To contribute to this project, adhere to the steps described on the [CONTRIBUTING.md](CONTRIBUTING.md) page.

## License

For more information on our license, read the [LICENSE](LICENSE).
