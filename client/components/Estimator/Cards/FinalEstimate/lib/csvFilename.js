export default function downloadCsv(prefix = true, filename = 'estimate') {
  if (filename.indexOf('.csv') === -1) {
    filename += '.csv';
  }
  if (prefix) {
    if (typeof prefix === 'string' || typeof prefix === 'number') {
      filename = `${prefix}_${filename}`;
    } else {
      filename = `${(new Date()).getTime()}_${filename}`;
    }
  }
  return filename;
}
