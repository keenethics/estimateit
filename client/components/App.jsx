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
    if (location.href === location.origin + '/') return;
    const loc = decodeURIComponent(location.href);
    const state = JSON.parse(loc.split('?').pop());
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
