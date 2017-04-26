const newLine = '\r\n';

export default function csv(columns, data, separator = ',', noHeader = false) {
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
    data.forEach((v) => {
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
  const regex = new RegExp(',', 'g');
  const taskToRow = (task, No) => [No, task.taskName.replace(regex, ''), task.minimumHours, task.maximumHours].join(separator);
  const assembleNo = (parentNo, No) => parentNo ? `${parentNo}.${No}` : No;

  const tasksToRows = (tasks, parentNo) => [].concat(
    ...tasks.map((task, i) => {
      const No = assembleNo(parentNo, i + 1);
      return [taskToRow(task, No), ...tasksToRows(task.tasks || [], No)];
    }),
  );
  return content.concat(tasksToRows(data)).join(newLine);
}
