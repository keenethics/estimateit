import google from 'googleapis';
import googleAuth from 'google-auth-library'
import util from 'util';
const oAuth2 = require('googleapis').auth.OAuth2;

let helper = null;

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

const createTaskCell = (value) => {
  if (/[A-Za-z]+/g.test(value)) {
   return { stringValue: value }
  }
  return { numberValue: Math.round(parseFloat(value) * 10) / 10 };
}

let spPosition = 0;

const createRow = (columns, rowNumber) => {
  const values = columns.map(co => ({ userEnteredValue: createTaskCell(co) }));
  spPosition++;
  return {
    startRow: rowNumber,
    startColumn: 0,
    rowData: [{
      values,
    }]
  };
}

SheetsHelper.prototype.createSpreadsheet = function(options, callback) {
  var self = this;
  const { tasks, technologies } = options;
  const rows = [];
  rows.push(createRow(['Suggested technologies'], spPosition++));
  technologies.map(t => {
    rows.push(createRow([t], spPosition++));
  });
  rows.push(createRow(['task', 'minimum hours', 'maximum hours'], spPosition++));
  tasks.forEach((t,i) => {
    const { maximumMinutes , minimumMinutes, taskName } = t;
    rows.push(createRow([taskName, minimumMinutes / 60, maximumMinutes / 60], spPosition++));
  })
  var request = {
    resource: {
      properties: {
        title: 'title'
      },
      sheets: [
        {
          data: rows,
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
      console.log(err);
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
