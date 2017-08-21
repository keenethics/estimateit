const newLine = '\r\n';

export default function csv(columns, data, calculationData, separator = ',') {
  let columnOrder;
  const content = [];
  let column = [];

  if (columns) {
    columnOrder = columns.map(v => v.map(a => (a.id)));
    column = columns.map(v => v.map(a => ((typeof a.displayName !== 'undefined') ? a.displayName : a.id)));
    if (column.length) {
      content.push(column[0].join(separator));
    }
  } else {
    columnOrder = data.map(v => (!Array.isArray(v)));
    if (columnOrder.length) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      content.push(columnOrder.join(separator));
    }
  }

  const minutesToHours = minutes => `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`;

  const getSubTaskData = (subtasks) => {
    const regex = new RegExp(',', 'g');
    const taskToRow = (task, No) => [No, task.taskName.replace(regex, ''), minutesToHours(task.minimumMinutes), minutesToHours(task.maximumMinutes)].join(separator);
    const assembleNo = (parentNo, No) => (parentNo ? `${parentNo}.${No}` : No);
    const tasksToRows = (tasks, parentNo) => [].concat(
      ...tasks.map((task, i) => {
        const No = assembleNo(parentNo, i + 1);
        return [taskToRow(task, No), ...tasksToRows(task.tasks || [], No)];
      }),
    );
    return tasksToRows(subtasks);
  };

  const getAdditonalData = (additionalData) => {
    const dataToRow = element => [columnOrder[1].map(e => element[e])].join(separator);
    return dataToRow(additionalData);
  };
  return content
    .concat([...getSubTaskData(data), '\n'], column[1]
    .join(separator), getAdditonalData(calculationData))
    .join(newLine);
}
