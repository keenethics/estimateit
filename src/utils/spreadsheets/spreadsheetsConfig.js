/* eslint-disable */

const GridDataProto = {
    startRow: 0,
    startColumn: 0,
    rowData: [],
    columnMetadata: [
      { pixelSize: 550 },
      { pixelSize: 150 },
      { pixelSize: 150 },
      { pixelSize: 550 },
    ]
  };

const userEnteredFormat = {
  padding: {
    left: 20
  },
  borders: {
    top: {
      style: 'NONE',
    },
    bottom: {
      style: 'NONE',
    },
    left: {
      style: 'NONE',
    },
    right: {
      style: 'NONE',
    },
  },
  verticalAlignment: 'MIDDLE',
  hyperlinkDisplayType: 'PLAIN_TEXT',
  horizontalAlignment: 1,
}

const regularCellTextFormat = {
  textFormat: {
    fontSize: 10,
    fontFamily: 'Arial',
  }

}

const highlightedTabBackground = {
  red: 0.89,
  green: 0.89,
  blue: 0.89,
  alpha: 1,
}

const redBackground = {
  backgroundColor: {
    red: 1,
    green: 0.5,
    blue: 0.5,
    alpha: 0,
  },
}

const paddingVertical10 = {
  padding: {
    top: 10,
    bottom: 10,
    left: 20,
  }
}

const textGrey = {
  red: 128,
  green: 128,
  blue: 128,
  alpha: 0,
}

const cellsFormattingConfig = {
  GridDataProto,
  taskNameCell: { userEnteredFormat },
  taskNameCellHightlighted: { userEnteredFormat:  Object.assign({},  userEnteredFormat, regularCellTextFormat,  { backgroundColor: highlightedTabBackground }) },
  subtaskNameCellHightlighted: { userEnteredFormat:  Object.assign({}, userEnteredFormat, regularCellTextFormat, { backgroundColor: highlightedTabBackground }, { padding: {left: 40 } }) },
  taskHoursCell: { userEnteredFormat: Object.assign({}, userEnteredFormat, regularCellTextFormat, { horizontalAlignment: 2 }) },
  subtaskNameCell: { userEnteredFormat: Object.assign({}, userEnteredFormat, regularCellTextFormat,  { padding: { left: 40 } }) },
  taskHoursCellHighlighted: { userEnteredFormat: Object.assign({}, userEnteredFormat, regularCellTextFormat, { horizontalAlignment: 2, backgroundColor: highlightedTabBackground }) },
  tableTitleRedCell: { userEnteredFormat: Object.assign({}, redBackground, userEnteredFormat, regularCellTextFormat,  paddingVertical10, { horizontalAlignment: 2, textFormat: { bold: true } }) },
  tableTitleCell: { userEnteredFormat: Object.assign({}, userEnteredFormat, regularCellTextFormat, { horizontalAlignment: 2, textFormat: { bold: true } }) },
  totalDevTime: { userEnteredFormat: Object.assign({}, userEnteredFormat, regularCellTextFormat, { horizontalAlignment: 1, textFormat: { bold: true } }) },
  companyName: { userEnteredFormat: Object.assign({}, userEnteredFormat, { textFormat: { fontSize: 27 } }) },
  keenApps: { userEnteredFormat: Object.assign({}, userEnteredFormat, { padding: { left: 70 }, textFormat: { fontSize: 14 } }) },
  companyInfo: { userEnteredFormat: Object.assign({}, userEnteredFormat, { textFormat: { fontSize: 10, italic: true } }) },
  notes: { userEnteredFormat: Object.assign({}, { backgroundColor: highlightedTabBackground }, userEnteredFormat, regularCellTextFormat,  paddingVertical10, { horizontalAlignment: 2, textFormat: { bold: true } }) },
  italic: { userEnteredFormat: Object.assign({}, userEnteredFormat, { textFormat: { italic: true } }) },
}

export default cellsFormattingConfig;
