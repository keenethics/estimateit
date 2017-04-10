import React from 'react';
import { Container, Col, Row, Card} from 'reactstrap';
import Header from './Header.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './style.scss';

import CalculationPage from './CalculationPage/CalculationPage.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: [],
      parentTaskId: '',
      newTask: null
    };
    this.changeState = this.changeState.bind(this);
  }
  changeState(data) {
    this.setState({tasksData: data})
  }

  componentDidMount() {
    if (!location.search) location.search = '{"tasks":[],"parentTaskId":"","newTask":null}';
    const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
    this.setState({tasksData: state.tasks});
  }

  render() {
    return (
      <Container>
        <Card>
          <Col xs="10" className={styles.estimator}>
            <Header onChangeState={this.changeState}/>
            <CalculationPage className={styles.estimator__body} someProp={this.state.tasksData} />
          </Col>
        </Card>
      </Container>
    );
  }
}
