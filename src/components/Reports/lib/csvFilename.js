export default function downloadCsv(prefix = true, filename = 'estimate') {
  let fn = filename;
  if (filename.indexOf('.csv') === -1) {
    fn += '.csv';
  }
  if (prefix) {
    if (typeof prefix === 'string' || typeof prefix === 'number') {
      fn = `${prefix}_${filename}`;
    } else {
      fn = `${(new Date()).getTime()}_${filename}`;
    }
  }
  return `${fn}.csv`;
}
