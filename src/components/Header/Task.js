import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button } from 'reactstrap';
import styles from './styles.scss';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.setParentTaskId = this.setParentTaskId.bind(this);
  }

  setParentTaskId(event) {
    this.props.setParentTaskId(event.target.dataset.id);
  }

  editTask({ target: { dataset: { parentid, id }, name, type, checked, value } }) {

    value = type === 'checkbox' ? checked : value;
    this.props.findTaskAndModify(id, name, value);

    const { taskName, minimumHours, maximumHours, isChecked } = this.props;
    const newTask = {
      taskName,
      minimumHours: minimumHours || 0,
      maximumHours: maximumHours || 0,
      isChecked,
    };
    this.props.saveTaskIntoState(parentid, newTask);
  }

  deleteTask({ target: { dataset: { id, parentid } } }) {
    const { target } = event;
    this.props.removeTask(id);

    const { taskName, minimumHours, maximumHours, isChecked } = this.props;
    const newTask = {
      taskName,
      minimumHours: minimumHours || 0,
      maximumHours: maximumHours || 0,
      isChecked,
    };
    this.props.saveTaskIntoState(parentid, newTask);
  }

  render() {
    const { taskId, sumMin, sumMax, iterator } = this.props;
    const { taskName, minimumHours, maximumHours, isChecked } = this.props;

    return (
      <FormGroup className={styles.subtasks}>
        <Input
          type="checkbox"
          name="isChecked"
          data-id={taskId}
          checked={isChecked}
          onChange={this.editTask}
          className={styles.subtasks__item}
        />
        <Input
          type="text"
          name="taskName"
          value={taskName}
          data-id={taskId}
          onChange={this.editTask}
          className={styles.subtasks__item}
          placeholder={iterator === 0 ? 'Task' : 'Subtask'}
        />
        <Input
          type="number"
          data-id={taskId}
          placeholder="min"
          name="minimumHours"
          onChange={this.editTask}
          value={sumMin || minimumHours}
          className={styles.subtasks__item}
        />
        <Input
          type="number"
          data-id={taskId}
          placeholder="max"
          min={minimumHours}
          name="maximumHours"
          onChange={this.editTask}
          value={sumMax || maximumHours}
          className={styles.subtasks__item}
        />

        {iterator < 2 ?
          <Button
            color="danger"
            data-id={taskId}
            onClick={this.setParentTaskId}
            className={styles.subtasks__item}
          >
            Add subtask
          </Button>
          : ''}
        <Button
          color="danger"
          data-id={taskId}
          onClick={this.deleteTask}
          className={styles.subtasks__item}
        >
          Delete
        </Button>
      </FormGroup>
    );
  }
}

Task.propTypes = {
  taskId: PropTypes.string.isRequired,
  taskName: PropTypes.string.isRequired,
  minimumHours: PropTypes.number.isRequired,
  maximumHours: PropTypes.number.isRequired,
  isChecked: PropTypes.bool.isRequired,
  sumMin: PropTypes.number,
  sumMax: PropTypes.number,
  iterator: PropTypes.number.isRequired,
  findTaskAndModify: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  setParentTaskId: PropTypes.func.isRequired,
  saveTaskIntoState: PropTypes.func.isRequired,
};
