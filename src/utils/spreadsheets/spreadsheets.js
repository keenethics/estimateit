/* eslint-disable */

import google from 'googleapis';
import googleAuth from 'google-auth-library'
import util from 'util';
import { createEstimateRequest, getRowsFromSheet  } from './sheetHelper.js';

const oAuth2 = require('googleapis').auth.OAuth2;
const { GOOGLE_CLIEN_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
const oauth2Client = new oAuth2(GOOGLE_CLIEN_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

const SheetsHelper = function(credentials) {
  oauth2Client.setCredentials(credentials);
  this.service = google.sheets({version: 'v4', auth: oauth2Client});
  this.drive = google.drive({version: 'v3', auth: oauth2Client});
};

SheetsHelper.prototype.updateCredentials = function() {
  return new Promise((resolve, reject) => {
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) {
        reject(err);
      }
      const newCreds = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
      oauth2Client.setCredentials(newCreds)
      resolve({ token: tokens.access_token, refreshToken });
    })
  })
}

SheetsHelper.prototype.deleteFile = function(fileId) {
  const self = this;
  return new Promise((resolve, reject) => {
    self.drive.files.delete({ fileId }, function (err, f) {
      if (err) reject(false);
      resolve(true);
    })
  });
};

SheetsHelper.prototype.getFile = function(fileId) {
  const self = this;
  return new Promise((resolve, reject) => {
    self.drive.files.get({ fileId }, function (err, f) {
      if (err) resolve(false);
      resolve(f);
    })
  });
};

SheetsHelper.prototype.createSpreadsheet = function(estimate, callback) {
  const self = this;
  const request = createEstimateRequest(estimate);
  self.service.spreadsheets.create(request, function(err, spreadsheet) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    // need to save spreadsheet id into db
    return callback(null, spreadsheet);
  });
};

const getSpreadsheetHelper = (accessToken) => (new SheetsHelper(accessToken));

export default getSpreadsheetHelper;
