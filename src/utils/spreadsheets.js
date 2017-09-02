import google from 'googleapis';
import googleAuth from 'google-auth-library'
import util from 'util';
const oAuth2 = require('googleapis').auth.OAuth2;
import spreadsheetConfig from './spreadsheetsConfig.js';

const { GridDataProto } = spreadsheetConfig;

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
const createTitleCell = (title, options) => (
  formatCell(createCell(title), { userEnteredFormat: Object.assign({}, options)}))


const createTaskTable = (startRow ,tasks, moneyRate) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] });
  const columnFormat =  { horizontalAlignment: 1 }
  const titleCells = [];
  titleCells.push(formatCell(createCell('task'), spreadsheetConfig.tableTitleCell));
  titleCells.push(formatCell(createCell('min hours'), spreadsheetConfig.tableTitleCell));
  titleCells.push(formatCell(createCell('max hours'), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(titleCells) });

  let totalMin = 0;
  let totalMax = 0;

  tasks.forEach((t,i) => {

    totalMin += t.minimumMinutes / 60;
    totalMax += t.maximumMinutes / 60;

    const { maximumMinutes , minimumMinutes, taskName } = t;
    const rowCells = [];
    let subTaskCellsObj = {};
    let taskNameOptions = spreadsheetConfig.taskNameCell;
    let taskHoursOptions = spreadsheetConfig.taskHoursCell;
    if (i % 2 == 0) {
      taskNameOptions = spreadsheetConfig.taskNameCellHightlighted;
      taskHoursOptions = spreadsheetConfig.taskHoursCellHighlighted;
    }

    rowCells.push(formatCell(createCell(`${i+1}. ${taskName}`), taskNameOptions ));
    rowCells.push(formatCell(createCell(minimumMinutes / 60), taskHoursOptions ));
    rowCells.push(formatCell(createCell(maximumMinutes / 60), taskHoursOptions ));
    // prink subtasks
    if (t.tasks) {
      t.tasks.forEach((subTask,j) => {
        const subTaskCells = [];
        const { maximumMinutes , minimumMinutes, taskName } = subTask;
        subTaskCells.push(formatCell(createCell(`${i+1}.${j+1}. ${taskName}`), taskNameOptions));
        subTaskCells.push(formatCell(createCell(minimumMinutes / 60), taskHoursOptions));
        subTaskCells.push(formatCell(createCell(maximumMinutes / 60), taskHoursOptions));
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

  // add total development time row
  let totalRow = [];
  totalRow.push(formatCell(createCell('Total development time:'), spreadsheetConfig.totalDevTime ));
  totalRow.push(formatCell(createCell(totalMin), spreadsheetConfig.tableTitleCell ));
  totalRow.push(formatCell(createCell(totalMax), spreadsheetConfig.tableTitleCell ));
  GridData.rowData.push({ values: [].concat(totalRow) });
  totalRow = [];

  // add rate info
  totalRow.push(formatCell(createCell('Money rate:'), spreadsheetConfig.totalDevTime ));
  totalRow.push(formatCell(createCell(moneyRate), spreadsheetConfig.tableTitleCell ));
  GridData.rowData.push({ values: [].concat(totalRow) });
  totalRow = [];

   // add total price
  totalRow.push(formatCell(createCell('Total price:'), spreadsheetConfig.totalDevTime ));
  totalRow.push(formatCell(createCell(moneyRate * totalMin), spreadsheetConfig.tableTitleCell ));
  totalRow.push(formatCell(createCell(moneyRate * totalMax), spreadsheetConfig.tableTitleCell ));
  GridData.rowData.push({ values: [].concat(totalRow) });
  totalRow = [];


  return GridData;
}

const createTechTable = (startRow, technologies) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] });
  const titleCells = [];
  titleCells.push(formatCell(createCell('Suggested technologies'), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: titleCells });
  const columnFormat = { horizontalAlignment: 2 };
  technologies.forEach((t,i) => {
    const rowCells = [];
    const formatOptions = (i % 2 == 0) ? spreadsheetConfig.taskNameCellHightlighted : spreadsheetConfig.taskNameCell;
    rowCells.push(formatCell(createCell(t), formatOptions));
    GridData.rowData.push({ values: rowCells });
  });
  return GridData;
};

const createPMInfo = (startRow, email, skype, pm, position) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] }, { columnMetadata: [{ pixelSize: 500 }, { pixelSize: 300 }] });
  let rowCells = [];

  const title = `If you have any questions about this estimate, please contact our ${position}`
  rowCells.push(formatCell(createCell(title), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('name'), spreadsheetConfig.tableTitleCell));
  rowCells.push(formatCell(createCell(pm), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('email'), spreadsheetConfig.tableTitleCell));
  rowCells.push(formatCell(createCell(email), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('skype'), spreadsheetConfig.tableTitleCell));
  rowCells.push(formatCell(createCell(skype), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  return GridData;
};

SheetsHelper.prototype.createSpreadsheet = function(options, callback) {
  var self = this;
  const { tasks, technologies, moneyRate, email, skype, pm, position } = options;
  const Grids = [];
  Grids.push(createTechTable(0, technologies));
  Grids.push(createTaskTable(technologies.length + 3, tasks, moneyRate));
  Grids.push(createPMInfo(technologies.length + tasks.length + 12, email, skype, pm));
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
