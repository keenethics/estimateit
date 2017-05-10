import React, { Component } from 'react';
import { Container, Col, Card } from 'reactstrap';
import Header from './Cards/Header';
import Main from './Cards/Main';
import styles from './styles.scss';
import 'bootstrap/dist/css/bootstrap.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],

    };
    this.changeStateHeaderTasks = this.changeStateHeaderTasks.bind(this);
    this.changeStateHeaderOptions = this.changeStateHeaderOptions.bind(this);
    this.changeStateMain = this.changeStateMain.bind(this);

  }
  componentDidMount() {
    if (location.search.length > 0) {
      const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
      this.setState( state, () => {
        history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
      });
    }
  }

  changeStateHeaderTasks(e) {
    this.setState({ tasks: e }, () => {
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    });
  }
  changeStateHeaderOptions(e) {
    this.setState({ infoCollector: e }, () => {
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    });
  }

  changeStateMain(data) {
    this.setState({ options: data }, () => {
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    });

  }

  render() {
    console.log('Estimator, ', this.state);
    return (
      <Container>
        <Card id="screen">
          <Col xs="12" md="12" lg="10" className={styles.estimator}>
            <Header
              className={styles.estimator__header}
              data={this.state.tasks}
              additional={this.state.infoCollector}
              onChangeStateOptions={this.changeStateHeaderOptions}
              onChangeStateTasks={this.changeStateHeaderTasks}
            />
            <Main
              className={styles.estimator__body}
              onChangeState={this.changeStateMain}
              someProp={this.state.tasks}
            />
          </Col>
        </Card>
      </Container>
    );
  }
}
