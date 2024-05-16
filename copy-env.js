#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

(function () {
  const sourceFile = path.join(__dirname, '.env.example');
  const destinationFile = path.join(__dirname, '.env');

  try {
    fs.copyFileSync(sourceFile, destinationFile);
    console.log('.env file has been created/overwritten successfully');
  } catch (error) {
    console.error(
      `Error occurred while copying .env.example to .env: ${error.message}`,
    );
    process.exit(1);
  }
})();
