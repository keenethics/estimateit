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

const formatCell = (cell, options) => (Object.assign({}, cell, options));

const createCell = (value) => ({ userEnteredValue: createTaskCell(value) });

const createCellData = (columns) => (columns.map(co => ({ userEnteredValue: createTaskCell(co) })));

const GridDataProto = {
    startRow: 0,
    startColumn: 0,
    rowData: [],
    columnMetadata: [
      { pixelSize: 550 },
      { pixelSize: 150 },
      { pixelSize: 150 },
    ]
  };

const createTitleCell = (title, options) => (
  formatCell(createCell(title), { userEnteredFormat: Object.assign({}, { horizontalAlignment: 2 }, options)}))


const createTaskTable = (startRow ,tasks) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] });
  const columnFormat =  { horizontalAlignment: 1 }
  const titleCells = [];
  titleCells.push(createTitleCell('task'));
  titleCells.push(createTitleCell('min hours'));
  titleCells.push(createTitleCell('max hours'));
  GridData.rowData.push({ values: titleCells });

  tasks.forEach((t,i) => {
    const { maximumMinutes , minimumMinutes, taskName } = t;
    const rowCells = [];
    let subTaskCellsObj = {};
    const formatOptions = (i % 2 == 0) ? columnFormat
    : Object.assign({}, columnFormat, { backgroundColor: {red: 0.89, green: 0.89, blue: 0.89, alpha: 1 }});
    rowCells.push(formatCell(createCell(`${i}. ${taskName}`), { userEnteredFormat: Object.assign({}, formatOptions, { padding: { left: 20 } })}));
    rowCells.push(formatCell(createCell(minimumMinutes / 60), { userEnteredFormat: Object.assign({}, formatOptions, { horizontalAlignment: 2 })}));
    rowCells.push(formatCell(createCell(maximumMinutes / 60), { userEnteredFormat: Object.assign({}, formatOptions, { horizontalAlignment: 2 })}));
    // prink subtasks
    if (t.tasks) {
      t.tasks.forEach((subTask,j) => {
        const subTaskCells = [];
        const { maximumMinutes , minimumMinutes, taskName } = subTask;
        subTaskCells.push(formatCell(createCell(`${i}.${j}. ${taskName}`), { userEnteredFormat: Object.assign({}, formatOptions, { padding: { left: 40 } })}));
        subTaskCells.push(formatCell(createCell(minimumMinutes / 60), { userEnteredFormat: Object.assign({}, formatOptions, { horizontalAlignment: 2 })}));
        subTaskCells.push(formatCell(createCell(maximumMinutes / 60), { userEnteredFormat: Object.assign({}, formatOptions, { horizontalAlignment: 2 })}));
        if (!subTaskCellsObj[i]) { subTaskCellsObj[i] = [] };
        subTaskCellsObj[i].push(subTaskCells);
      });

    }

    GridData.rowData.push({ values: rowCells });
    if (subTaskCellsObj[i]) {
      subTaskCellsObj[i].forEach(subTaskCell => {
        GridData.rowData.push({ values: subTaskCell });
      })
    }

  });
  return GridData;
}

const createTechTable = (startRow, technologies) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] });
  const titleCells = [];
  titleCells.push(createTitleCell('Suggested technologies'));
  GridData.rowData.push({ values: titleCells });
  const columnFormat = { horizontalAlignment: 2 };
  technologies.forEach((t,i) => {
    const rowCells = [];
    const formatOptions = (i % 2 == 0) ? columnFormat
    : Object.assign({}, columnFormat, { backgroundColor: {red: 0.89, green: 0.89, blue: 0.89, alpha: 1 }});
    rowCells.push(formatCell(createCell(t), { userEnteredFormat: Object.assign({}, formatOptions, { horizontalAlignment: 2 })}));
    GridData.rowData.push({ values: rowCells });
  });
  return GridData;
};

SheetsHelper.prototype.createSpreadsheet = function(options, callback) {
  var self = this;
  const { tasks, technologies } = options;
  const Grids = [];
  Grids.push(createTaskTable(0,tasks));
  Grids.push(createTechTable(tasks.length + 4, technologies));
  var request = {
    resource: {
      properties: {
        title: 'title'
      },
      sheets: [
        {
          data: [Grids],
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
