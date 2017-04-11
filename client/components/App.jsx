import React from 'react';
import { Container, Col, Row, Card } from 'reactstrap';
import Header from './Header.jsx';
import CalculationPage from './CalculationPage/CalculationPage.jsx';
import styles from './style.scss';
import 'bootstrap/dist/css/bootstrap.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: [],
      parentTaskId: '',
      newTask: null,
    };
    this.changeState = this.changeState.bind(this);
  }
  componentDidMount() {
    if (!location.search) location.search = '{"tasks":[],"parentTaskId":"","newTask":null}';
    const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
    this.setState({ tasksData: state.tasks });
  }
  changeState(data) {
    this.setState({ tasksData: data });
  }

  render() {
    return (
      <Container>
        <Card>
          <Col
            xs="12" md="10"
            className={styles.estimator}
          >
            <Header onChangeState={this.changeState} />
            <CalculationPage className={styles.estimator__body} someProp={this.state.tasksData} />
          </Col>
        </Card>
      </Container>
    );
  }
}
