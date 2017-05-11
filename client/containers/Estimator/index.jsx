import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Card } from 'reactstrap';
import * as actions from '../../actions/tasks';

import Header from '../../components/Estimator/Cards/Header';
import Main from '../../components/Estimator/Cards/Main';
import styles from '../../components/Estimator/styles.scss';
import 'bootstrap/dist/css/bootstrap.css';


export const App = (props) => {
  return (
    <Container>
      <Card id="screen">
        <Col xs="12" md="12" lg="10" className={styles.estimator}>
          <Header
            className={styles.estimator__header}
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
    estimator: state.estimator,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
