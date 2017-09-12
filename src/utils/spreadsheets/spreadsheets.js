import google from 'googleapis';
import googleAuth from 'google-auth-library'
import util from 'util';
import { createEstimateRequest, getEstimateSheet, getRowsFromSheet  } from './sheetHelper.js';

const oAuth2 = require('googleapis').auth.OAuth2;
const { GOOGLE_CLIEN_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
const oauth2Client = new oAuth2(GOOGLE_CLIEN_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

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
      const newCreds = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
      oauth2Client.setCredentials(newCreds)
      resolve({ token: tokens.access_token, refreshToken });
    })
  })
}

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

SheetsHelper.prototype.updateSpreadsheet = function(estimate, callback) {
  const self = this;
  const { spreadsheetId, sprintNumber } = estimate
  const sheeet = getEstimateSheet(estimate, 2);
  const rows = getRowsFromSheet(sheeet)
  const request = {
    spreadsheetId,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              sheetId: 3,
              title: 'v2'
            },
          }
        },
        {
          deleteSheet: {
            sheetId: 2,
          },
        },
         {
          addSheet: {
            properties: {
              sheetId: 2,
              title: `sprint ${sprintNumber}`,
            },
          }
         },
        {
          deleteSheet: {
            sheetId: 3,
          },
        },
        // append company info, technologies, tasks, estimate options, pm info
        {
          appendCells: {
            sheetId: 2,
            rows,
            fields: '*',
          }
        },
        // set width of cells
        {
          updateDimensionProperties: {
            range: {
              sheetId: 2,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 1
            },
            properties: {
              pixelSize: 560,
            },
            fields: 'pixelSize'
          }
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: 2,
              dimension: 'COLUMNS',
              startIndex: 1,
              endIndex: 3
            },
            properties: {
              pixelSize: 250,
            },
            fields: 'pixelSize'
          }
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: 2,
              dimension: 'COLUMNS',
              startIndex: 3,
              endIndex: 4,
            },
            properties: {
              pixelSize: 400,
            },
            fields: 'pixelSize'
          }
        },
      ]
    }
  }
  self.service.spreadsheets.batchUpdate(request, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, res);
  })

};

const getSpreadsheetHelper = (accessToken) => (new SheetsHelper(accessToken));

export default getSpreadsheetHelper;
