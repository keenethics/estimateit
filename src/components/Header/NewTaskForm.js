import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import shortid from 'shortid';
import styles from './styles.scss';

export default class NewTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskName: '',
      minimumHours: '',
      maximumHours: '',
      isChecked: true,
    };

    this.addTask = this.addTask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  addTask(event) {
    event.preventDefault();
    const { taskName, minimumHours, maximumHours, isChecked } = this.state;
    const target = event.target;
    const parentTaskId = target.dataset.parentid;

    const newTask = {
      id: shortid.generate(),
      taskName,
      minimumHours: minimumHours || 0,
      maximumHours: maximumHours || 0,
      isChecked,
      parentTaskId,
    };

    if (!parentTaskId) {
      this.props.addNewTask(newTask);
      this.props.removeParentTaskId();
    } else {
      this.props.addNewSubTask(parentTaskId, newTask);
      this.props.removeParentTaskId();
    }

    this.props.calculateHours(parentTaskId, newTask);
    this.setState({
      taskName: '',
      minimumHours: '',
      maximumHours: '',
      isChecked: true,
      parentTaskId: undefined,
    });
    this.taskNameInput.focus();
  }

  handleInputChange(event) {
    const target = event.target;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
      parentTaskId: target.dataset.parentid,
    });
  }

  render() {
    const { taskName, minimumHours, maximumHours, isChecked } = this.state;
    const { parentTaskId, isSubtask } = this.props;
    console.log(this);
    return (
      <Form
        id="screenShot"
        data-parentId={parentTaskId}
        onSubmit={this.addTask}
      >
        <FormGroup
          data-parentId={parentTaskId}
          className={styles.tasks__group}
        >
          <Input
            data-parentId={parentTaskId}
            className={styles.tasks__group_item}
            type="checkbox"
            name="isChecked"
            checked={isChecked}
            onChange={this.handleInputChange}
          />
          <Input
            data-parentId={parentTaskId}
            className={styles.tasks__group_item}
            type="text"
            placeholder={isSubtask ? 'Subtask' : 'Task'}
            name="taskName"
            getRef={input => (this.taskNameInput = input)}
            value={taskName}
            onChange={this.handleInputChange}
          />
          <Input
            data-parentId={parentTaskId}
            className={styles.tasks__group_item}
            type="number"
            placeholder="min"
            name="minimumHours"
            value={minimumHours}
            onChange={this.handleInputChange}
          />
          <Input
            data-parentId={parentTaskId}
            className={styles.tasks__group_item}
            type="number"
            placeholder="max"
            name="maximumHours"
            value={maximumHours}
            onChange={this.handleInputChange}
          />
          <Button
            className={styles.tasks__group_item}
            type="submit"
            color="danger"
          >
            {isSubtask ? 'Add subtask' : 'Add task'}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

NewTaskForm.defaultProps = {
  parentTaskId: undefined,
  isSubtask: false,
};

NewTaskForm.propTypes = {
  parentTaskId: PropTypes.string,
  isSubtask: PropTypes.bool,
  addNewTask: PropTypes.func.isRequired,
  removeParentTaskId: PropTypes.func.isRequired,
  addNewSubTask: PropTypes.func.isRequired,
  calculateHours: PropTypes.func.isRequired,
};
