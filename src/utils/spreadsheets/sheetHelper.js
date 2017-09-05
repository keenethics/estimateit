import spreadsheetConfig from './spreadsheetsConfig.js';
import fs from 'fs';
const { GridDataProto } = spreadsheetConfig;

const createTaskCell = (value) => {
  if (/[A-Za-z]+/g.test(value)) {
   return { stringValue: value }
  }
  return { numberValue: Math.round(parseFloat(value) * 10) / 10 };
}

const formatCell = (cell, options) => (Object.assign({}, cell, options));

const createCell = (value) => ({ userEnteredValue: createTaskCell(value) });

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
    let subtaskNameOptions = spreadsheetConfig.subtaskNameCell;

    if (i % 2 == 0) {
      taskNameOptions = spreadsheetConfig.taskNameCellHightlighted;
      taskHoursOptions = spreadsheetConfig.taskHoursCellHighlighted;
      subtaskNameOptions = spreadsheetConfig.subtaskNameCellHightlighted;
    }

    rowCells.push(formatCell(createCell(`${i+1}. ${taskName}`), taskNameOptions ));
    rowCells.push(formatCell(createCell(minimumMinutes / 60), taskHoursOptions ));
    rowCells.push(formatCell(createCell(maximumMinutes / 60), taskHoursOptions ));
    // prink subtasks
    if (t.tasks) {
      t.tasks.forEach((subTask,j) => {
        const subTaskCells = [];
        const { maximumMinutes , minimumMinutes, taskName } = subTask;
        subTaskCells.push(formatCell(createCell(`${i+1}.${j+1}. ${taskName}`), subtaskNameOptions));
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

const createEstimateOptionsTable = (startRow, estimateOptions) => {
  const { qa, pm, risks, bugFixes, probability } = estimateOptions;
  const GridData = Object.assign({}, GridDataProto, { startRow }, { rowData: [] }, { columnMetadata: [{ pixelSize: 200 }, { pixelSize: 200 }] });
  let rowCells = [];

  const title = 'Estimate options'
  rowCells.push(formatCell(createCell(title), spreadsheetConfig.tableTitleCell));
  rowCells.push(formatCell(createCell('percentage'), spreadsheetConfig.tableTitleCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('QA'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(`${qa}%`), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('PM'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(`${pm}%`), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('Risks'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(`${risks}%`), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('Bug Fixes'), spreadsheetConfig.taskNameCell ));
  rowCells.push(formatCell(createCell(`${bugFixes}%`), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('Probability'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(`${probability}%`), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  return GridData
}

const createTechTable = (startRow, technologies) => {
  const GridData = Object.assign({}, GridDataProto, { startRow }, { columnMetadata: [{ pixelSize: 500 }] }, { rowData: [] });
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

  rowCells.push(formatCell(createCell('name'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(pm), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('email'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(email), spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  rowCells.push(formatCell(createCell('skype'), spreadsheetConfig.taskNameCell));
  rowCells.push(formatCell(createCell(skype),  spreadsheetConfig.taskHoursCell));
  GridData.rowData.push({ values: [].concat(rowCells) });
  rowCells = [];

  return GridData;
};

const getEstimateSheet = (estimate, title, sheetId) => {
  const { tasks, technologies, moneyRate, email, skype, pm, position, estimateOptions } = estimate;
  const Grids = [];
  const techTableStart = 0;
  const taskTableStart = techTableStart + technologies.length + 2;
  const estimateOptionsStart = taskTableStart + tasks.length + 8;
  const pmInfoStart = estimateOptionsStart + 5 + 2;
  Grids.push(createTechTable(techTableStart, technologies));
  Grids.push(createTaskTable(taskTableStart, tasks, moneyRate));
  Grids.push(createEstimateOptionsTable(estimateOptionsStart, estimateOptions))
  Grids.push(createPMInfo(pmInfoStart, email, skype, pm));
  return {
    data: [Grids],
    properties: {
      title: title || 'Estimate',
      sheetId: sheetId || 1,
      gridProperties: {
        columnCount: 6,
        frozenRowCount: 1
      }
    }
  }
}

const createEstimateRequest = (estimate, id) => {
  const { tasks, technologies, moneyRate, email, skype, pm, position, estimateOptions, projectName, sprintNumber } = estimate;
  const Grids = [];
  const techTableStart = 0;
  const taskTableStart = techTableStart + technologies.length + 2;
  const estimateOptionsStart = taskTableStart + tasks.length + 8;
  const pmInfoStart = estimateOptionsStart + 5 + 2;

  Grids.push(createTechTable(techTableStart, technologies));
  Grids.push(createTaskTable(taskTableStart, tasks, moneyRate));
  Grids.push(createEstimateOptionsTable(estimateOptionsStart, estimateOptions))
  Grids.push(createPMInfo(pmInfoStart, email, skype, pm));

  const request = {
    resource: {
      properties: {
        title: projectName || 'title',
      },
      sheets: [
        {
          data: [Grids],
          properties: {
            title: `sprint ${sprintNumber}`,
            sheetId: id || 2,
            gridProperties: {
              columnCount: 6,
              frozenRowCount: 1
            }
          }
        },
      ]
    }
  };
  return request;
}

const getRowsFromSheet = (sheet) => {
  const grid = sheet.data[0];
  const rows = grid.map(d => {
    return d.rowData;
  })
  const realRows = rows.reduce((prev, next) => {
    return prev.concat(next);
  })
  console.log(realRows)

    return rows;
}

export { createEstimateRequest, getEstimateSheet, getRowsFromSheet };

