import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import * as actionsHeader from '../../actions/Header';
import * as actionsMain from '../../actions/Main';
import * as actionsLoading from '../../actions/loading';


import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';
import 'bootstrap/dist/css/bootstrap.css';

export class App extends Component {

  componentDidMount() {
    this.props.loadingActions.fetchTodos(location.pathname);
  }
  render() {
    const { props } = this;
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
    const { devHours, calculationData, moneyRate, estimateOptions } = mainState;
    const { addEstimateOptions, calcDevHours, changeMoneyRate, addClientData } = mainActions;
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
              addClientData={addClientData}
              devHours={devHours}
              options={calculationData}
              estimateOptions={estimateOptions}
              moneyRate={moneyRate}
              tasks={tasks}
              headerState={headerState}
              mainState={mainState}
            />
          </Col>
        </Card>
      </Container>
    );
  }
}

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
    loadingActions: {
      ...bindActionCreators(actionsLoading, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);