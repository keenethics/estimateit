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
      parentTaskId: '',
      newTask: null,
    };
    this.changeStateHeader = this.changeStateHeader.bind(this);
    this.changeStateMain = this.changeStateMain.bind(this);

  }
  componentDidMount() {
    if (location.search.length > 0) {
      const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
      this.setState({ tasks: state.tasks });
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    }
  }

  changeStateHeader(e) {
    this.setState({ tasks: e }, () => {
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
              onChangeState={this.changeStateHeader}
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
