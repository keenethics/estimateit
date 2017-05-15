import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import * as tasks from '../../actions/tasks';
import * as additionalHeader from '../../actions/headerAdditional';
import * as parentTaskId from '../../actions/parentTaskId';

import * as mainActions from '../../actions/Main';


import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';
import 'bootstrap/dist/css/bootstrap.css';

export const App = (props) => {
  const { estimator, parentId } = props;
  const { addNewClientData } = props.additionalHeader;
  const {
    addNewTask,
    addNewSubTask,
    removeTask,
    findTaskAndModify,
  } = props.tasks;

  const { setParentTaskId, removeParentTaskId } = props.parentTaskId;

  const {
    devHours,
  } = props.mainState;
  const {
    changeMoneyRate,
    calcDevHours,
  } = props.mainActions;
  return (
    <Container>
      <Card id="screen">
        <Col xs="12" md="12" lg="10" className={styles.estimator}>
          <Header
            className={styles.estimator__header}
            addNewClientData={addNewClientData}
            addNewTask={addNewTask}
            addNewSubTask={addNewSubTask}
            setParentTaskId={setParentTaskId}
            removeParentTaskId={removeParentTaskId}
            removeTask={removeTask}
            findTaskAndModify={findTaskAndModify}
            tasks={estimator}
            parentId={parentId}
          />
          <Main
            className={styles.estimator__body}
            changeMoneyRate={changeMoneyRate}
            calcDevHours={calcDevHours}
            devHours={devHours}
            tasks={estimator}
          />
        </Col>
      </Card>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    estimator: state.tasks,
    parentId: state.parentTaskId,

    mainState: state.Main,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    additionalHeader: bindActionCreators(additionalHeader, dispatch),
    tasks: bindActionCreators(tasks, dispatch),
    parentTaskId: bindActionCreators(parentTaskId, dispatch),

    mainActions: bindActionCreators(mainActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
