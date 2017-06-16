import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button } from 'reactstrap';
import styles from './styles.scss';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   taskName: '',
    //   minimumHours: '',
    //   maximumHours: '',
    //   isChecked: true,
    // };

    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.setParentTaskId = this.setParentTaskId.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { taskName, minimumHours, maximumHours, isChecked } = nextProps;
  //   this.setState({
  //     taskName,
  //     minimumHours,
  //     maximumHours,
  //     isChecked,
  //   });
  // }

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
    this.props.calculateHours(parentid, newTask);
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
    this.props.calculateHours(parentid, newTask);
  }

  render() {
    const { taskId, sumMin, sumMax, iterator } = this.props;
    const { taskName, minimumHours, maximumHours, isChecked } = this.props;

    return (
      <FormGroup className={styles.subtasks}>
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="checkbox"
          name="isChecked"
          checked={isChecked}
          onChange={this.editTask}
        />
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="text"
          name="taskName"
          placeholder={iterator === 0 ? 'Task' : 'Subtask'}
          value={taskName}
          onChange={this.editTask}
        />
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="number"
          value={sumMin || minimumHours}
          name="minimumHours"
          placeholder="min"
          onChange={this.editTask}
        />
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="number"
          value={sumMax || maximumHours}
          name="maximumHours"
          placeholder="max"
          min={minimumHours}
          onChange={this.editTask}
        />

        {iterator < 2 ?
          <Button
            data-id={taskId}
            className={styles.subtasks__item}
            color="danger"
            onClick={this.setParentTaskId}
          >
            Add subtask
          </Button>
          : ''}
        <Button
          data-id={taskId}
          className={styles.subtasks__item}
          color="danger"
          onClick={this.deleteTask}
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
  minimumHours: PropTypes.string.isRequired,
  maximumHours: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  sumMin: PropTypes.number,
  sumMax: PropTypes.number,
  iterator: PropTypes.number.isRequired,
  findTaskAndModify: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  setParentTaskId: PropTypes.func.isRequired,
  calculateHours: PropTypes.func.isRequired,
};
