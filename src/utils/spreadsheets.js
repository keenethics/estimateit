import google from 'googleapis';
import googleAuth from 'google-auth-library'
import util from 'util';

let helper = null;

const oAuth2 = require('googleapis').auth.OAuth2;
const oauth2Client = new oAuth2();

const SheetsHelper = function(credentials) {
  oauth2Client.setCredentials(credentials);
  this.service = google.sheets({version: 'v4', auth: oauth2Client});
};

SheetsHelper.prototype.updateCredentials = function() {
  return new Promise((resolve, reject) => {
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) {
        reject(err);
      }
      resolve(tokens);
    })
  })
}

SheetsHelper.prototype.createSpreadsheet = function(title, callback) {
  var self = this;
  var request = {
    resource: {
      properties: {
        title: title
      },
      sheets: [
        {
          properties: {
            title: 'Data',
            gridProperties: {
              columnCount: 6,
              frozenRowCount: 1
            }
          }
        },
      ]
    }
  };
  self.service.spreadsheets.create(request, function(err, spreadsheet) {
    if (err) {
      return callback(err);
    }
    // need to save spreadsheet id into db
    return callback(null, spreadsheet);
  });
};

const getSpreadsheetHelper = (accessToken) => {
  if (!helper) {
    helper = new SheetsHelper(accessToken);
  }
  return helper;
}

export default getSpreadsheetHelper;
