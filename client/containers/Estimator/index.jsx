import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import * as actionsHeader from '../../actions/Header';
import * as actionsMain from '../../actions/Main';

import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';
import 'bootstrap/dist/css/bootstrap.css';

export const App = (props) => {
  const { headerActions, mainActions, headerState, mainState } = props;
  const { headerAdditional, tasks, parentTaskId } = headerState;
  const {
    addNewTask,
    addNewSubTask,
    removeTask,
    findTaskAndModify,
    addNewClientData,
    setParentTaskId,
    removeParentTaskId,
  } = headerActions;
  const { devHours, calculationData, moneyRate } = mainState;
  const { addEstimateOptions, calcDevHours, changeMoneyRate } = mainActions;
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
            headerAdditional={headerAdditional}
            tasks={tasks}
            parentId={parentTaskId}
          />
          <Main
            className={styles.estimator__body}
            changeMoneyRate={changeMoneyRate}
            calcDevHours={calcDevHours}
            addEstimateOptions={addEstimateOptions}
            devHours={devHours}
            options={calculationData}
            moneyRate={moneyRate}
            tasks={tasks}
          />
        </Col>
      </Card>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    headerState: {
      ...state.Header,
    },
    mainState: {
      ...state.Main,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    headerActions: {
      ...bindActionCreators(actionsHeader, dispatch),
    },
    mainActions: {
      ...bindActionCreators(actionsMain, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
