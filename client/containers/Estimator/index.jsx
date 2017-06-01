import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import * as actionsHeader from '../../actions/Header';
import * as actionsMain from '../../actions/Main';
import * as actionsLoading from '../../actions/loading';

import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';


export class App extends Component {

  componentDidMount() {
    this.props.loadingActions.fetchTodos(location.pathname);
  }
  render() {
    const {
      mainState,
      headerState,
      mainActions: {
        calcDevHours,
        addClientData,
        changeMoneyRate,
        addEstimateOptions,
      },
      headerActions: {
        addNewTask,
        removeTask,
        addNewSubTask,
        setParentTaskId,
        addNewClientData,
        findTaskAndModify,
        removeParentTaskId,
      },
    } = this.props;

    return (
      <Container>
        <Card id="screen">
          <Col xs="12" md="12" lg="10" className={styles.estimator}>
            <Header
              removeTask={removeTask}
              addNewTask={addNewTask}
              headerState={headerState}
              addNewSubTask={addNewSubTask}
              setParentTaskId={setParentTaskId}
              addNewClientData={addNewClientData}
              className={styles.estimator__header}
              findTaskAndModify={findTaskAndModify}
              removeParentTaskId={removeParentTaskId}
            />
            <Main
              mainState={mainState}
              headerState={this.props.headerState}
              calcDevHours={calcDevHours}
              addClientData={addClientData}
              changeMoneyRate={changeMoneyRate}
              className={styles.estimator__body}
              addEstimateOptions={addEstimateOptions}
            />
          </Col>
        </Card>
      </Container>
    );
  }
}

App.propTypes = {
  mainState: PropTypes.object.isRequired,
  headerState: PropTypes.object.isRequired,
  mainActions: PropTypes.object.isRequired,
  headerActions: PropTypes.object.isRequired,
  loadingActions: PropTypes.object.isRequired,
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
    loadingActions: {
      ...bindActionCreators(actionsLoading, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
