/**
 * Created by nikolay on 14.04.17.
 */
const newLine = '\r\n';
// const tab = '\t';

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
  function getData(data) {
    data.map((a) => {
      if (Array.isArray(a)) {
        a.map(v => addColumn(v));
      }
    });
  }
  function addColumn(data) {
    console.log('a');
    if (Array.isArray(data)) {
      data.map((v) => {
        if (Array.isArray(v)) {
          return v;
        }
        return columnOrder.map((k) => {
          if (typeof v[k] !== 'undefined') {
            return v[k];
          }
          return '';
        });
      }).forEach((v) => {
        console.log(v);
        content.push(v.join(separator));
        v.map((a) => {
          if (Array.isArray(a)) {
            console.log('a', a);
            a.map(c => addColumn(c));
          }
        });
      });
    }
  }
  addColumn(datas);
  return content.join(newLine);
}
