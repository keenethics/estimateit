/**
 * Created by nikolay on 14.04.17.
 */
const newLine = '\r\n';

export default function csv(columns, datas, separator = ',', noHeader = false) {
  console.clear();
  const data = [{ taskName: 'task', minimumHours: '1', maximumHours: '2', id: 'H1wt2vURx', depth: 0, tasks: [{ taskName: 'subtask ', parentTaskId: 'H1wt2vURx', minimumHours: '1', maximumHours: '2', id: 'Skrq3vIRg', depth: null, tasks: [{ taskName: 'subsubtask', parentTaskId: 'Skrq3vIRg', minimumHours: '3', maximumHours: '44', id: 'SJT5nP8Ag', depth: null }] }] }, { taskName: ' task ', minimumHours: '3', maximumHours: '3', id: 'Byjn3wLRl', depth: 0, tasks: [{ taskName: ' dsf', parentTaskId: 'Byjn3wLRl', minimumHours: '1', maximumHours: '3', id: 'Hkt1pwLAg', depth: null, tasks: [{ taskName: ' tsad', parentTaskId: 'Hkt1pwLAg', minimumHours: '3', maximumHours: '3', id: 'HkpgpPL0e', depth: null }] }] }];

  //
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

  const taskToRow = (task, No) => [No, task.taskName, task.minimumHours, task.maximumHours].join(',');
  const assembleNo = (parentNo, No) => parentNo ? `${parentNo}.${No}` : No;

  const tasksToRows = (tasks, parentNo) => [].concat(
    ...tasks.map((task, i) => {
      const No = assembleNo(parentNo, i + 1);
      return [taskToRow(task, No), ...tasksToRows(task.tasks || [], No)];
    }),
  );
  return content.concat(tasksToRows(data)).join(newLine);
}
