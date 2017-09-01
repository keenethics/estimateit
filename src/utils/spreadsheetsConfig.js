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

const userEnteredFormat = {
  padding: {
    left: 20
  },
  horizontalAlignment: 1,
}

const highlightedTabBackground = {
  red: 0.89,
  green: 0.89,
  blue: 0.89,
  alpha: 1,
}
const cellsFormattingConfig = {
  GridDataProto,
  taskNameCell: { userEnteredFormat },
  taskNameCellHightlighted: { userEnteredFormat:  Object.assign({}, userEnteredFormat, { backgroundColor: highlightedTabBackground }) },
  taskHoursCell: { userEnteredFormat: { horizontalAlignment: 2 } },
  taskHoursCellHighlighted: { userEnteredFormat: { horizontalAlignment: 2, backgroundColor: highlightedTabBackground } },
  tableTitleCell: { userEnteredFormat: { horizontalAlignment: 2, textFormat: { bold: true } } },

}

export default cellsFormattingConfig;