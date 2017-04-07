import React from 'react';
import Header from './Header.jsx';
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
      <div className={styles.main}>
        <Header onChangeState={this.changeState}/>
        <CalculationPage someProp={this.state.tasksData} />
      </div>
    );
  }
}
