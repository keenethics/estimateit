const newLine = '\r\n';

export default function csv(columns, data, separator = ',') {
  let columnOrder;
  const content = [];
  let column = [];
  if (columns) {
    columnOrder = columns.map(v => (v.id));
    column = columns.map(v => (typeof v.displayName !== 'undefined') ? v.displayName : v.id);
    if (column.length) {
      content.push(column.join(separator));
    }
  } else {
    columnOrder = data.map(v => (!Array.isArray(v)));
    if (columnOrder.length) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      content.push(columnOrder.join(separator));
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
