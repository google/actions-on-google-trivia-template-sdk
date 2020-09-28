# Migration from the Trivia Quiz template to Actions Builder

This project contains the source code for the conversion from the [Trivia Quiz](https://developers.google.com/assistant/templates/trivia) template to the [Actions Builder](https://developers.google.com/assistant/conversational/build) platform.

## Directory structure

The following table describes the file structure for this project:

| Directory | Description                            |
| --------- | -------------------------------------- |
| converter | Sheets and locales conversion tool     |
| functions | Fulfillment webhook source code        |
| sdk       | Action SDK resource files              |

## Step 1: Prerequisites

Before you begin the migration, perform the following steps:

1. Install Node.js and NPM.
   - We recommend that you install them with [Node Version Manager (nvm) for Linux and Mac](https://github.com/nvm-sh/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows).
   - The webhook runtime requires Node.js version 10 or later.

2. Install the [Firebase CLI](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment).
   - We recommend that you install it with MAJOR version 8. To do so, run the following command: `npm install -g firebase-tools@^8.0.0`.
   - Run `firebase login` with your Google account.

3. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions).
   - Extract the package to a location of your choice and add the binary to your environment's PATH variable. Alternatively, extract the package to a location that's already in your PATH variable, such as `/usr/local/bin`.
   - Run `gactions login` with your Google account.

4. Go to [Google Sheet Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs).
   - From Step 1 on that page, click **Enable the Google Sheets API**.
   - Pick a project name or use the default *Quickstart* name, then click **Next**. Note that this project isn't the same as a new Actions on Google project that's needed for migration.
   - Under **Configure your Oauth client**, select **Desktop app**.
   - Click **Create**.
   - Click **Download client configuration** to download `credentials.json`. Save the JSON file in the `converter/` directory.

## Step 2: Setup

### Create a new project in Actions Console

From the [Actions on Google Console](https://console.actions.google.com/), select **New project&nbsp;> Create project** and then select **What kind of Action do you want to build?&nbsp;> Game&nbsp;> Blank project**.

After the new project has been created, you should see the Actions Builder console. To find your Project ID, navigate to **More ⋮&nbsp;> Project settings&nbsp;> Project ID**.

> Be careful not to mix the Project ID with the Project Name.

### Upgrade Firebase pricing plan

From the [Firebase Console](https://console.firebase.google.com/), select the same newly created project from Actions Console and upgrade its pricing plan to **Blaze (pay as you go)**.

> A Blaze plan is required for the Cloud Functions with Node.js version 10 runtime.

## Step 3: Migration

### Sample sheets to create a new action

To create a brand-new Trivia Quiz action, make a copy of the Trivia Quiz sample sheet in your preferred locale from the following list. Update the sheet with your own data. Alternatively, you can use your existing Trivia Quiz data sheet.

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

Open `converter/config.js` and update the `LOCALE_TO_SHEET_ID` mapping with your own Trivia Quiz data sheet ID for the specific locale you want to convert.

- The Sheet ID can be located in the sheet URL: `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit#gid=0`.
- Uncomment the specific locales you want to convert.
- The sheet IDs provided in `converter/config.js` are the default sample sheets for each locale. To create a brand new Trivia Quiz action, make a copy of the sample sheet and update it with your own data.
- Make sure the data sheet is owned by the same Google account that's performing the migration.

After you've updated the sheet ID, you have two options for how to proceed with the migration.

### (Option 1) Migration script

To automatically run all the migration steps, run `./build.sh <PROJECT_ID>` from the root directory of this project.

- On the initial run, the script asks you to grant read access to your sheets. To do so, you must visit the provided URL and copy the authorization code back after you accept read access. If you see a warning page that states "This app isn't verified", click **Advanced** to show the drop down text. Then, click **Go to Quickstart (unsafe)** to continue the authorization process.
- Alternatively, you can follow the [manual migration steps](#option-2-manual-migration-steps) to perform the migration.

### (Option 2) Manual migration steps

To manually migrate your project, perform the steps given in the following three sections.

#### Run the sheet and locale conversion script

1. Navigate to the `converter/` directory. To do so, run `cd converter` from the root directory of this project.
2. Run `npm install`.
3. Run `npm run convert -- --project_id <PROJECT_ID>`.
   - On the initial run, the script asks you to grant read access to your sheets. To do so, you must visit the provided URL and copy the authorization code back after you accept read access. If you see a warning page that states "This app isn't verified", click **Advanced** to show the drop down text. Then, click **Go to Quickstart (unsafe)** to continue the authorization process.
   - After the conversion script finishes, the parsed sheet data is added to the `functions/data/` directory, while locale-specific data is added to the `sdk/` directory.

#### Deploy the webhook to Cloud Functions for Firebase

1. Navigate to the `functions/` directory. To do so, run `cd functions` from the root directory of this project.
2. Run `npm install`.
3. To deploy the v1 webhook, run `firebase deploy --project <PROJECT_ID> --only functions:triviaQuiz_v1`.
   - After you release a version of the action, you can update your webhook and test your changes without affecting your production action. To do so, we recommend that you update the `FUNCTION_VERSION` in `functions/config.js` to deploy a new webhook URL, such as `triviaQuiz_v2`.

#### Use Actions CLI to push and preview your project

1. Navigate to the `sdk/` directory. To do so, run `cd sdk` from the root directory of this project.
2. To login to your Google account, run `gactions login`.
3. To push your project, run `gactions push`.
   - To fix the validation warnings, update the missing Directory information in the **Deploy** section of the Actions Console.
   - If you need to sync the changes made in the Actions Builder Console with your local `sdk/` directory, you can run `gactions pull`.
4. To deploy your project to the preview environment, run `gactions deploy preview`.

## Step 4: Test the converted action

You can test your Action on any Google Assistant-enabled device that's signed into the same account that was used to create this project. You can also use the Actions on Google Console [simulator](https://developers.google.com/assistant/console/simulator) to test most features and preview on-device behavior.

## References and issues

- Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google) or the [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/).
- If you find any bugs, report them through GitHub.
- To learn more about Actions on Google, read our [documentation](https://developers.google.com/assistant).
- To get guided, hands-on practice with Actions on Google, try some of our [Codelabs](https://codelabs.developers.google.com/?cat=Assistant).

## Contribute

To contribute to this project, follow the steps on the [CONTRIBUTING.md](CONTRIBUTING.md) page.

## License

For more information on our license, read the [LICENSE](LICENSE).
