#!/usr/bin/env bash

# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Build script for Trivia Quiz template to Actions Builder migration
# - Make sure you have completed the Prerequisites and Setup sections of the README
# - To run this script: ./build.sh <PROJECT_ID>

set -euo pipefail
cd "$(dirname "$0")"

PROJECT_ID=$(echo $1 | tr '[:upper:]' '[:lower:]')
FUNCTION_NAME=$(grep -w "FUNCTION_NAME:" functions/config.js | cut -d ':' -f 2 | tr -d " ,'\"")
FUNCTION_VERSION=$(grep -w "FUNCTION_VERSION:" functions/config.js | cut -d ':' -f 2 | tr -d " ,'\"")
FUNCTION_FULLNAME=$(echo ${FUNCTION_NAME}_${FUNCTION_VERSION})

# Log in to Firebase SDK tool
firebase login
if [ $? -ne 0 ]; then
    echo "Something went wrong with firebase login"
    exit
fi

echo "Deployment started for $PROJECT_ID"

# Run sheet and locale conversion script
pushd converter
npm install
npm run convert -- --project_id $PROJECT_ID
popd

# Deploy webhook to Cloud Functions for Firebase
pushd functions
npm install
firebase deploy --project $PROJECT_ID --only functions:$FUNCTION_FULLNAME
popd

# Use Actions CLI to push and preview your project
pushd sdk
gactions login
gactions push
gactions deploy preview
popd

if [ $? -ne 0 ]; then
    echo "Deployment failed for $PROJECT_ID"
    exit
else
    echo "Deployment completed for $PROJECT_ID"
fi