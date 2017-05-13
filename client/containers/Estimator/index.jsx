import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import * as tasks from '../../actions/tasks';
import * as additionalHeader from '../../actions/headerAdditional';

import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';
import 'bootstrap/dist/css/bootstrap.css';


export const App = (props) => {
  const { estimator } = props;
  const {
    addNewClientData,
  } = props.additionalHeader;
  const {
    addNewTask,
    addNewSubTask,
    removeTask,
    findTaskAndModify,
  } = props.tasks;
  return (
    <Container>
      <Card id="screen">
        <Col xs="12" md="12" lg="10" className={styles.estimator}>
          <Header
            className={styles.estimator__header}
            addNewClientData={addNewClientData}
            addNewTask={addNewTask}
            addNewSubTask={addNewSubTask}
            removeTask={removeTask}
            findTaskAndModify={findTaskAndModify}
            tasks={estimator}
          />
          <Main
            className={styles.estimator__body}
          />
        </Col>
      </Card>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    estimator: state.tasks,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    additionalHeader: bindActionCreators(additionalHeader, dispatch),
    tasks: bindActionCreators(tasks, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
