/**
 * Created by nikolay on 14.04.17.
 */
const newLine = '\r\n';

export default function csv(columns, datas, separator = ',', noHeader = false) {
  console.clear();
  let columnOrder;
  const content = [];
  const column = [];
  if (columns) {
    columnOrder = columns.map((v) => {
      if (typeof v === 'string') {
        return v;
      }
      if (!noHeader) {
        column.push((typeof v.displayName !== 'undefined') ? v.displayName : v.id);
      }
      return v.id;
    });
    if (column.length > 0) {
      content.push(column.join(separator));
    }
  } else {
    columnOrder = [];
    datas.forEach((v) => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);

      if (!noHeader) {
        content.push(columnOrder.join(separator));
      }
    }
  }
  function addColumn(data) {
    let local = [];
    data.map((v) => {
      columnOrder.map((k) => {
        if (!Array.isArray(v[k]) && typeof v[k] !== 'undefined') {
          local.push(v[k]);
        } else {
          content.push(local);
          local = [];
          if (typeof v[k] !== 'undefined') {
            v[k][0].taskName = `${v[k][0].taskName}`;
            addColumn(v[k]);
          }
        }
      });
    });
  }
  addColumn(datas);
  return content.join(newLine);
}
